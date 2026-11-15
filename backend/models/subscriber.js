const mongoose = require("mongoose");
const { subscribe } = require("../routes/UserRoutes");

const subscriberSchema = mongoose.Schema({
    email: {
        type: String,
        requried: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    subscribedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("subcriber", subscriberSchema)