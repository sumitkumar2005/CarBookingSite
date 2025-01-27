import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Blacklist from "../models/blackList.model.js";
import captainModel from "../models/captain.model.js";
dotenv.config();

async function authUser(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const token = req.headers.authorization.split(' ')[1] || req.cookies.token;

        console.log(token);
        const isBlackListed = await Blacklist.findOne({ token: token }); // Await the blacklist check
        if (isBlackListed) {
            return res.status(400).json({ message: "Unauthorized access" });
        }

        // Verify token
        const decoded = jwt.verify(token, "HELLO_THERE");

        // Find user by ID
        const user = await userModel.findById(decoded._id);
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
}

async function authCaptain(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(' ')[1] || req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        console.log(token);
        // Decode the token
        const decoded = jwt.verify(token, "YOUR_CAPTAIN");
        const captain = await captainModel.findById(decoded._id);

        if (!captain) {
            return res.status(401).json({ message: "Unauthorized: Captain not found" });
        }

        req.captain = captain;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized", error: error.message });
    }
}

export default { authUser, authCaptain };
