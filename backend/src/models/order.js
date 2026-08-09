const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: Number,
      },
    ],
    totalAmount: Number,
    status: {
      type: String,
      default: "pending",
    },
  },{ timestamps: true },);

  const orderModel = mongoose.model("order", orderSchema);

  module.exports = orderModel;
