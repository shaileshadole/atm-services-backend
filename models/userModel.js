import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    atmNumber: {
        type: String,
        default: 0
    },
    pin: {
        type: Number,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const User = mongoose.model("User", userSchema);