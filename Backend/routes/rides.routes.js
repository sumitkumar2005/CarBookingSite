import express from "express";
import { body } from "express-validator";
import ControllerCreateRide from "../Controllers/ride.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import mapsServices from '../Services/ride.service.js';
import rideService from "../Services/ride.service.js";
const router = express.Router();
import { query } from "express-validator";
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
        query('pickUp').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
        query('dropOff').isString().isLength({ min: 3 }).withMessage('Invalid destination address')
    ],
    async (req, res) => {
        try {
            const { pickUp, dropOff } = req.query;
            const fare = await rideService.getFare(pickUp, dropOff);
            return res.json(fare);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
);


export default router;
