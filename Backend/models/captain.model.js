import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, "First name must be at least 3 characters"],
        },
        lastname: {
            type: String,
            required: true,
            minlength: [3, "Last name must be at least 3 characters"],
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, "Email must be at least 5 characters long"],
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters long"],
        select: false,
    },
    socketId: {
        type: String,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive",
    },
    vehicle: {
        color: {
            type: String,
            required: true,
            minlength: 3,
        },
        plate: {
            type: String,
            required: true,
            minlength: 3,
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ["car", "bike", "auto"],
        },
    },
    location: {
        lat: {
            type: Number,
        },
        long: {
            type: Number,
        },
    },
});

captainSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id }, "YOUR_CAPTAIN");
    return token;
};

captainSchema.statics.hashPassword = async function (password) {
    if (!password) {
        throw new Error("Password is required");
    }
    const salt = await bcrypt.genSalt(10);
   return  await bcrypt.hash(password, salt);
    
    
    
};

captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const captainModel = mongoose.model("Captain", captainSchema);
export default captainModel;
