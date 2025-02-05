import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        captain: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Captain",
        },
        pickUp: {
            type: String,
            required: true,
        },
        dropOff: {
            type: String,
            required: true,
        },
        fare: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "ongoing", "completed", "accepted", "rejected", "cancelled"],
            default: "pending",
        },
        duration: {
            type: Number,
        },
        distance: {
            type: Number,
        },
        paymentId: {
            type: String,
        },
        orderId: {
            type: String,
        },
        signature: {
            type: String,
        },
        otp:{
            type:String,
            selected:false,
            required:true
        }
    },
    { timestamps: true }
);

const rideModel = mongoose.model("Ride", rideSchema);
export default rideModel;
