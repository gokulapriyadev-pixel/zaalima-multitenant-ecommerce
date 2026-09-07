const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["superadmin", "vendor", "customer"],
        default: "customer"
    }

}, { timestamps: true });

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;