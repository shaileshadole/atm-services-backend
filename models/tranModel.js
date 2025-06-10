import mongoose from "mongoose";

const tranSchema = new mongoose.Schema({
    amount: {
        type: Number,
        require: true,

    },
    balance: {
        type: Number,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isCredited: {
        type: Boolean,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    }
})

export const Transaction = mongoose.model("Transation", tranSchema);