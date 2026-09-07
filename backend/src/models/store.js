const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true
    }

}, { timestamps: true });

const storeModel = mongoose.model("store", storeSchema);

module.exports = storeModel;