import bcrypt from "bcrypt";
import rideModel from "../models/ride.model.js";
import mapsServices from "./maps.services.js";
import crypto from "crypto";

const VEHICLE_RATES = {
    auto: { baseFare: 20, ratePerKm: 10, ratePerMin: 5 },
    bike: { baseFare: 15, ratePerKm: 5, ratePerMin: 3 },
    car: { baseFare: 50, ratePerKm: 15, ratePerMin: 10 },
};

// Function to generate OTP and return both hashed and plain OTP
async function getOtp() {
    // Generate a random 6-digit OTP securely
    const otp = await crypto.randomInt(100000, 999999).toString();
    console.log("Generated OTP:", otp);  // Send this to the user
    return otp;
}

async function getFare(pickUp, dropOff) {
    if (!pickUp || !dropOff) {
        throw new Error("Pick up and drop off locations are required");
    }

    const distanceTime = await mapsServices.getDistanceTime(pickUp, dropOff);
    console.log("Distance Time Data:", distanceTime); // Debugging

    if (!distanceTime || !distanceTime.distance || !distanceTime.duration) {
        throw new Error("Failed to calculate distance and time");
    }

    const distance = parseFloat(distanceTime.distance.replace(/[^\d.]/g, ""));
    const time = parseFloat(distanceTime.duration.replace(/[^\d.]/g, ""));

    if (isNaN(distance) || isNaN(time)) {
        throw new Error("Invalid distance or time received (NaN)");
    }

    const fareDetails = Object.keys(VEHICLE_RATES).reduce((fares, vehicle) => {
        const { baseFare, ratePerKm, ratePerMin } = VEHICLE_RATES[vehicle];
        fares[vehicle] = baseFare + ratePerKm * distance + ratePerMin * time;
        return fares;
    }, {});

    return fareDetails;
}


async function createRide({ user, pickUp, dropOff, vehicleType }) {
    if (!user || !pickUp || !dropOff || !vehicleType) {
        throw new Error("All fields are required");
    }

    // Get fare details for all vehicle types
    const fareDetails = await getFare(pickUp, dropOff);
    
    // Extract the specific fare for the selected vehicle type
    const fare = fareDetails[vehicleType];
    
    if (!fare || typeof fare !== 'number') {
        throw new Error("Invalid fare calculation");
    }

    const otp = await getOtp(); // Generate OTP
    const hashedOtp = await bcrypt.hash(otp, 10);

    const ride = await rideModel.create({
        user,
        pickUp,
        dropOff,
        vehicleType,
        fare: Math.round(fare), // Use the specific fare for the selected vehicle type
        otp: hashedOtp,
    });

    console.log("Your OTP:", otp); // Send OTP to user via SMS/Email

    return ride;
}


export default { createRide, getFare, getOtp };
