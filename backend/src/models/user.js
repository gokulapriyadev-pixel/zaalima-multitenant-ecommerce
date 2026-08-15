const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : String,
    email : {
        type : String,
        unique : true
    },
    password : String,
    role : {
        type : String,
        enum : ["superadmin", "vendor", "customer"],
        default : "vendor"
    }
},{timestamps:true});


const userModel = mongoose.model("user", userSchema);

module.exports = userModel;