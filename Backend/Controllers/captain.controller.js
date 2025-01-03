import captainModel from "../models/captain.model.js";
import { validationResult } from "express-validator";

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


export default { registerCaptain };
