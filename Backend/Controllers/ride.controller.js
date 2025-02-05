import rideService from "../Services/ride.service.js";  // Import as an object
import { validationResult } from "express-validator";

export default async function ControllerCreateRide(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }

    const { pickUp, dropOff, vehicleType } = req.body;  // Fixing destructuring

    try {
        // Call the function as a method of rideService
        const ride = await rideService.createRide({
            user: req.user._id,
            pickUp,
            dropOff,
            vehicleType
        });

        return res.status(201).send(ride);
    } catch (error) {
        console.error("Error creating ride:", error.message); // Improved error handling
        res.status(500).json({ message: "An error occurred while creating the ride.", error: error.message });
    }
}
