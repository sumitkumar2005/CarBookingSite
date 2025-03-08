import express from "express";
import { body } from "express-validator";
import ControllerCreateRide from "../Controllers/ride.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import mapsServices from '../Services/ride.service.js';
import rideService from "../Services/ride.service.js";
const router = express.Router();
import { query, validationResult } from "express-validator";
import { confirmRide } from "../Controllers/ride.controller.js";

router.get('/', (req, res) => {
    res.send('Ride API');
});

router.post(
    "/create",
    [
        authMiddleware.authUser, // Ensure user is authenticated
        body("pickUp").isString().withMessage("Invalid pickup location"),
        body("dropOff").isString().withMessage("DropOff should be a string"),
        body("vehicleType").isString().isIn(["auto", "car", "bike"]).withMessage("Invalid vehicle type"),
    ],
    ControllerCreateRide
);

router.get('/get-fare',
    authMiddleware.authUser,
    [
        query('pickUp').isString().notEmpty().withMessage('Pickup location is required'),
        query('dropOff').isString().notEmpty().withMessage('Drop-off location is required')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { pickUp, dropOff } = req.query;
            console.log("Calculating fare for:", { pickUp, dropOff });
            
            const fare = await rideService.getFare(pickUp, dropOff);
            console.log("Calculated fare:", fare);
            
            return res.json(fare);
        } catch (error) {
            console.error("Fare calculation error:", error);
            return res.status(500).json({ 
                error: error.message || "Failed to calculate fare" 
            });
        }
    }
);

router.post('/confirm-ride',
    authMiddleware.authUser,
    [
        body('rideId').isString().withMessage('Invalid ride ID'),
      
        
    ],
   confirmRide
)
export default router;
