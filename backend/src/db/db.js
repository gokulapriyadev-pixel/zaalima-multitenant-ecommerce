const mongoose = require('mongoose');

async function connectDB() {
    await mongoose.connect("mongodb+srv://15suraj05_db_user:o00dAyOQEKT95FBA@cluster0.pizcclt.mongodb.net/Users")

    console.log("Connected to DB")
}

module.exports = connectDB;