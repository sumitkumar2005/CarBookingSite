import express from 'express';
import { body, validationResult } from 'express-validator';
import userController from '../Controllers/user.controller.js';
import authmiddleware from  '../middleware/auth.middleware.js'
import userModel from '../models/user.model.js';

const router = express.Router();
router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Invalid Email'),
        body('fullname.firstname')
            .isString()
            .isLength({ min: 3 })
            .withMessage('First name must be at least 3 characters long'),
        body('fullname.lastname')
            .isString()
            .isLength({ min: 3 })
            .withMessage('Last name must be at least 3 characters long'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
    ],
    userController.registerUser
);

router.post('/login',[(body('email').isEmail().withMessage('Invalid Email'),body('password').isLength({min:6}).withMessage('password should be 6'))], userController.loginUser)

router.get('/profile', authmiddleware.authUser, userController.getUserProfile);
router.get('/logout',authmiddleware.authUser,userController.logoutUser)

router.get('/check-socket', authmiddleware.authUser, async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        res.json({ 
            userId: user._id,
            socketId: user.socketId,
            hasSocket: !!user.socketId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
