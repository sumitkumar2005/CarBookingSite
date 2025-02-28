import captainModel from "../models/captain.model.js";
import { validationResult } from "express-validator";
import Blacklist from "../models/blackList.model.js";

async function registerCaptain(req, res, next) {
    console.log("Request Body: ", req.body); // Add this line to check the incoming body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { fullname, email, password, vehicle } = req.body;

        // Hash the password
        const hashedPassword = await captainModel.hashPassword(password);

        // Create captain object
        const captain = new captainModel({
            fullname,
            email,
            password: hashedPassword,
            vehicle,
        });

        // Save captain to the database
        await captain.save();

        // Generate auth token
        const token = await captain.generateAuthToken();

        res.status(201).json({ captain, token });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while registering the captain.", error: error.message });
    }
}

async function loginCaptain(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Validation failed", errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find captain and include password for verification
        const captain = await captainModel.findOne({ email }).select('+password');
        if (!captain) {
            return res.status(400).json({ message: "Email or password is incorrect" });
        }

        // Verify password
        const isMatch = await captain.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Email or password is incorrect" });
        }

        // Generate token
        const token = await captain.generateAuthToken();

        // Remove password from response
        const captainResponse = captain.toObject();
        delete captainResponse.password;

        // Set cookie and send response
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Send response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            captain: captainResponse
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during login",
            error: error.message
        });
    }
}

async function CaptainProfile(req, res) {
    res.status(200).send(req.captain);
}

async function logoutCaptain(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header
        if (!token) {
            return res.status(400).json({ message: "No token found to logout" });
        }

        // Add token to blacklist
        await Blacklist.create({ token });

        // Clear cookie if it exists
        if (req.cookies.token) {
            res.clearCookie('token');
        }
        
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const updateLocation = async (req, res) => {
    try {
        const { location } = req.body;

        if (!location || !location.lat || !location.long) {
            return res.status(400).json({
                success: false,
                message: 'Invalid location data.  Must include lat and long.'
            });
        }

        const updatedCaptain = await captainModel.findByIdAndUpdate(
            req.captain._id,
            {
                $set: {
                    'location.lat': location.lat,
                    'location.long': location.long,
                    'currentLocation.lat': location.lat,
                    'currentLocation.long': location.long,
                    lastLocationUpdate: new Date()
                }
            },
            { new: true }
        );

        if (!updatedCaptain) {
            return res.status(404).json({
                success: false,
                message: 'Captain not found'
            });
        }

        res.json({
            success: true,
            message: 'Location updated successfully',
            location: updatedCaptain.location
        });

    } catch (error) {
        console.error('Error updating captain location:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating location',
            error: error.message
        });
    }
};

export default { registerCaptain, loginCaptain, logoutCaptain, CaptainProfile, updateLocation };
