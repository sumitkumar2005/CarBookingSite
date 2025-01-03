import express from 'express'
const router  = express();
import { body } from 'express-validator';
import captainController from '../Controllers/captain.controller.js'


router.post('/register', [
    // Validate fullname
    body('fullname.firstname')
        .isString()
        .withMessage('First name must be a string')
        .isLength({ min: 3 })
        .withMessage('First name must be at least 3 characters long'),
    body('fullname.lastname')
        .isString()
        .withMessage('Last name must be a string')
        .isLength({ min: 3 })
        .withMessage('Last name must be at least 3 characters long'),

    // Validate email
    body('email').isEmail().withMessage('Invalid email address'),

    // Validate password
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    // Validate vehicle
    body('vehicle.color')
        .isString()
        .withMessage('Vehicle color must be a string')
        .isLength({ min: 3 })
        .withMessage('Vehicle color must be at least 3 characters long'),
    body('vehicle.plate')
        .isString()
        .withMessage('Vehicle plate must be a string')
        .isLength({ min: 3 })
        .withMessage('Vehicle plate must be at least 3 characters long'),
    body('vehicle.capacity')
        .isInt({ min: 1 })
        .withMessage('Vehicle capacity must be a number and at least 1'),
    body('vehicle.vehicleType')
        .isIn(['car', 'bike', 'auto'])
        .withMessage('Vehicle type must be one of car, bike, or auto'),

    // Validate location
    body('location.lat')
        .optional()
        .isNumeric()
        .withMessage('Latitude must be a number'),
    body('location.long')
        .optional()
        .isNumeric()
        .withMessage('Longitude must be a number'),
],captainController.registerCaptain)



export default router;