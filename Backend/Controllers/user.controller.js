import { validationResult } from 'express-validator';
import userModel from '../models/user.model.js';
import userService from '../Services/user.services.js';
import Blacklist from '../models/blackList.model.js';


async function registerUser(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { fullname, email, password } = req.body;

        // Hash password
        const hashedPassword = await userModel.hashPassword(password);

        // Create user
        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword,
        });

        // Generate token
        const token = user.generateAuthToken();
        res.status(201).json({ token, user });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

async function loginUser(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = user.generateAuthToken();
        res.cookie('token',token)
        res.status(200).json({ token, user });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

async function getUserProfile(req,res,next){
res.status(200).json(req.user)
}

async  function logoutUser(req,res,next)
{
    const authHeader = req.headers.authorization;
    const token = req.headers.authorization.split(' ')[1] || req.cookies.token;
    await Blacklist.create({token});

    res.status(200).json({message:"User Logout Successfully"});


}
export default { registerUser,loginUser ,getUserProfile,logoutUser};
