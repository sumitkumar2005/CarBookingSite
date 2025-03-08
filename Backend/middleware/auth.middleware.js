import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Blacklist from "../models/blackList.model.js";
import captainModel from "../models/captain.model.js";
dotenv.config();

const JWT_SECRET = "THIS IS MY SECRET BRO";

const authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        // Use the correct secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "THIS IS MY SECRET BRO");
        
        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Error:", error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(401).json({ message: "Authentication failed" });
    }
};

async function authCaptain(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Invalid authorization header" });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Use the same JWT_SECRET for consistency
        const decoded = jwt.verify(token, JWT_SECRET);
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

export { authUser };
export default { authUser, authCaptain };
