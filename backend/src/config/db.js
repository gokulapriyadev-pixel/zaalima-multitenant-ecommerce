const mongoose = require('mongoose');
const dns = require('dns');

// Use Google/Cloudflare DNS to fix local ISP/Router querySrv ECONNREFUSED errors
dns.setServers(['8.8.8.8', '1.1.1.1']);
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    // Attempt to connect to the database using the URI from the .env file
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB (${error.name}): ${error.message}`);
    console.error(error);
    // Exit the process with failure if the connection fails
    process.exit(1);
  }
};

module.exports = connectDB;