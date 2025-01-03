import mongoose from 'mongoose';

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600, // TTL in seconds (1 hour)
    },
});

// Create the model
const Blacklist = mongoose.model('Blacklist', blacklistSchema);

export default Blacklist;
