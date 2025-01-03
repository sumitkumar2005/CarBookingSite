import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Blacklist from "../models/blackList.model.js";
dotenv.config();

async function authUser(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const token = req.headers.authorization.split(' ')[1] || req.cookies.token;

            console.log(token)
            const isBlackListed = Blacklist.findOne({token:token});
            if(isBlackListed)
            {
                return res.status(400).json({message:"Unauthorized access"});
            }


        // Verify token
        const decoded = jwt.verify(token,"HELLO_THERE");

        // Find user by ID
        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized", error: error.message });
    }
}

export default {authUser};
