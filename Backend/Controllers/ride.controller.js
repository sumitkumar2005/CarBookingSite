import rideService from "../Services/ride.service.js";
import { validationResult } from "express-validator";
import mapsServices from "../Services/maps.services.js";
import { sendMessageToSocketId } from "../socket.js";


export async function confirmRide(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }
    const {rideId} = req.body;
    try {
        const ride = await rideService.confirmRide(rideId,req.captain._id)
        sendMessageToSocketId(ride.user.socketId,{
            event:'ride-confirmed',
            data:ride
        })
        return res.status(200).json(ride);
    } catch (error) {
        return res.status(500).send({"message":error.message})
    }
    
}
export default async function ControllerCreateRide(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }

    const { pickUp, dropOff, vehicleType } = req.body;

    try {
        console.log(`Creating ride from ${pickUp} to ${dropOff} with vehicle type ${vehicleType}`);
        
        const ride = await rideService.createRide({
            user: req.user._id,
            pickUp,
            dropOff,
            vehicleType
        });

        console.log("Ride created:", ride._id);

        const pickupCoordinates = await mapsServices.getCoordinate(pickUp);
        if (!pickupCoordinates) {
            return res.status(400).json({ message: "Could not determine pickup coordinates." });
        }

        console.log("Pickup coordinates:", pickupCoordinates);

        const captainInRadius = await mapsServices.getNearByCaptains(
            pickupCoordinates.lat,
            pickupCoordinates.long,
            5, // Increase to 5 mile radius
            false // Normal mode
        );

        console.log(`Found ${captainInRadius.length} captains in radius`);
        console.log("Details of nearby captains:", JSON.stringify(captainInRadius, null, 2));
        ride.otp = "";
        captainInRadius.map(captain => {
            sendMessageToSocketId(captain.socketId, "ride-request", {
                event: "ride-request",
                data:ride
            })
        })
        res.status(201).json({
            ride: ride,
            nearbyCaptains: captainInRadius
        });

    } catch (error) {
        console.error("Error creating ride:", error.message);
        res.status(500).json({
            message: "An error occurred while creating the ride.",
            error: error.message
        });
    }
}
