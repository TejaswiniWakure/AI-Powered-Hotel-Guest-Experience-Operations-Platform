const mongoose = require('mongoose');
const User = require('./src/models/User');
const Hotel = require('./src/models/Hotel');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stayflow').then(async () => {
  let systemHotel = await Hotel.findOne({ hotelCode: 'SYS000' });
  if (!systemHotel) {
    systemHotel = await Hotel.create({
      name: 'System Admin Hotel',
      hotelCode: 'SYS000',
      subdomain: 'sysadmin',
      contactEmail: 'admin@stayflow.com',
      contactPhone: '+10000000000',
      address: {
        street: 'Admin St',
        city: 'System',
        state: 'Admin',
        country: 'Cloud',
        zipCode: '000000'
      }
    });
  }

  const email = 'admin@stayflow.com';
  const password = 'Admin@123'; // Note: User schema has pre-save hook for password

  let admin = await User.findOne({ email });
  if (!admin) {
    await User.create({
      name: 'System Admin',
      email,
      password: password, // The hook hashes it automatically
      role: 'admin',
      active: true,
      hotelId: systemHotel._id
    });
    console.log('Admin user created successfully.');
  } else {
    admin.password = password; // The hook will hash it
    admin.role = 'admin';
    admin.hotelId = systemHotel._id;
    await admin.save();
    console.log('Admin user updated successfully.');
  }
  process.exit(0);
});
