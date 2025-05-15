const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();
const connectDB = require('../app');

const seedAdmin = async () => {
  await connectDB();

  const existing = await User.findOne({ email: 'admin@admin.com' });
  if (existing) {
    console.log('Admin already exists');
    process.exit();
  }

  const hashedPassword = await bcrypt.hash('987654321@#', 10);

  const admin = new User({
    name: 'Admin',
    email: 'admin@admin.com',
    password: hashedPassword,
    role: 'super_admin',
  });

  await admin.save();
  console.log('Admin user created');
  process.exit();
};

seedAdmin();
