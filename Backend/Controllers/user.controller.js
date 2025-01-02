import { validationResult } from 'express-validator';
import userModel from '../models/user.model.js';
import userService from '../Services/user.services.js';

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
        res.status(200).json({ token, user });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
}


export default { registerUser,loginUser };
