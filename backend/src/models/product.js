const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    stock: {
        type: Number,
        required: true,
        min: 0
    },

    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store',
        required: true,
        index: true
    }

}, { timestamps: true });

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;