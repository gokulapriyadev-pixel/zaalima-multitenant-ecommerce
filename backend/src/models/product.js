const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name : String,
    price : Number,
    stock : Number, 
    storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'store'
  }
},{timestamps : true});

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;