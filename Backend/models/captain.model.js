import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-2024";

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
        default: null,
        index: true
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
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere'
        }
    },
    currentLocation: {
        long: Number,
        lat: Number
    },
    lastLocationUpdate: {
        type: Date,
        default: Date.now
    },
    isAvailable: {
        type: Boolean,
        default: false
    }
});

captainSchema.index({ location: "2dsphere" });

captainSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        { _id: this._id },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
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
