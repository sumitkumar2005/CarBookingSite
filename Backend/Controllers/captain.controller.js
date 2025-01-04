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
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}
async function loginCaptain(req, res, next) {
    console.log("Request Body: ", req.body); // Add this line to check the incoming body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
        try {
            const {email,password} = req.body;

            const captain = await captainModel.findOne({email}).select('+password');

            if(!captain)
            {
                return res.status(400).json({messgae:"email or password is wrong"})
            }

            const isMatch = await captain.comparePassword(password);

            if(!isMatch)
            {
               return res.status(401).send({messgae:"Email or Password is wrong"});
            }

                const token = await captain.generateAuthToken();

                res.cookie('token',token);
                res.status(200).send({token,captain});


        } catch (error) {
            return res.status(400).json({error});
        }
}

async function CaptainProfile(req,res) {
     res.status(200).send(req.captain)


}

async function logoutCaptain(req, res) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: "No token found to logout" });
        }

        // Add token to blacklist
        await Blacklist.create({ token });

        // Clear cookie
        res.clearCookie('token');
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


export default { registerCaptain,loginCaptain ,logoutCaptain,CaptainProfile};
