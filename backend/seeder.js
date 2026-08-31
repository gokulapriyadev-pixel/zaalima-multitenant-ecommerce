require('dotenv').config();
const dns = require('dns');

// Use Google/Cloudflare DNS to fix local ISP/Router querySrv ECONNREFUSED errors
dns.setServers(['8.8.8.8', '1.1.1.1']);
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const mongoose = require('mongoose');
const User = require('./src/models/User');

const seedAdmin = async () => {
  try {
    // 1. STRICT SECURITY CHECK: Ensure env variables exist before doing anything
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.error('❌ SEEDING ABORTED: You must define ADMIN_EMAIL and ADMIN_PASSWORD in your .env file.');
      console.error('This is a security measure to prevent default guessable passwords in production.');
      process.exit(1);
    }

    // 2. Connect to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Database connected for seeding.');

    // 3. Check if a Super Admin already exists
    const adminExists = await User.findOne({ role: 'super_admin' });
    if (adminExists) {
      console.log('⚠️ A Super Admin already exists. Aborting seed to prevent duplicates.');
      process.exit(0);
    }

    // 4. Create the Admin using ONLY Environment Variables
    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'Admin', // Name fallback is safe
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'super_admin',
    });

    console.log(`🎉 Super Admin created successfully!`);
    console.log(`👤 Name: ${admin.name}`);
    console.log(`📧 Email: ${admin.email}`);

    // 5. Disconnect and exit safely
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error seeding admin: ${error.message}`);
    process.exit(1);
  }
};

// Run the function
seedAdmin();