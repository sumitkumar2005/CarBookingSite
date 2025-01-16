import captainModel from "../models/captain.model.js";
import bcrypt from 'bcrypt';

async function createCaptain({ firstname, lastname, email, password, color, plate, capacity, vehicleType }) {
    if (!firstname) return { error: 'Firstname is required' };
    if (!email) return { error: 'Email is required' };
    if (!password) return { error: 'Password is required' };
    if (!color) return { error: 'Color is required' };
    if (!plate) return { error: 'Plate is required' };
    if (!capacity) return { error: 'Capacity is required' };
    if (!vehicleType) return { error: 'Vehicle Type is required' };

    const hashedPassword = await bcrypt.hash(password, 10);

    const captain = await captainModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password: hashedPassword,
        vehicle: { color, plate, capacity, vehicleType }
    });
    return captain;
}

export default createCaptain;
