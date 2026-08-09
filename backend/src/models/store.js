const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name : String,
    ownerId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
},{timestamps:true});

const storeModel = mongoose.model("store", storeSchema);

module.exports = storeModel;