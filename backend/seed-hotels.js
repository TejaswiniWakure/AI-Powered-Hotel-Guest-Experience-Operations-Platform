const mongoose = require('mongoose');
const Hotel = require('./src/models/Hotel');
const Room = require('./src/models/Room');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stayflow').then(async () => {
  const hotels = [
    {
      name: 'Grand Pune Demo',
      hotelCode: 'STAY001',
      subdomain: 'grandpunedemo',
      contactEmail: 'gm@grandpune.com',
      contactPhone: '1234567890',
      address: {
        street: 'MG Road',
        city: 'Pune',
        state: 'MH',
        country: 'India',
        zipCode: '411001'
      },
      roomsConf: { floors: 4, roomsPerFloor: 20 }
    },
    {
      name: 'Silver Jubilee Demo',
      hotelCode: 'SIL814',
      subdomain: 'silverjubileedemo',
      contactEmail: 'gm@silverjubilee.com',
      contactPhone: '0987654321',
      address: {
        street: 'FC Road',
        city: 'Pune',
        state: 'MH',
        country: 'India',
        zipCode: '411004'
      },
      roomsConf: { floors: 5, roomsPerFloor: 10 }
    }
  ];

  for (const h of hotels) {
    let hotel = await Hotel.findOne({ hotelCode: h.hotelCode });
    if (!hotel) {
      try {
        hotel = await Hotel.create({
          name: h.name,
          hotelCode: h.hotelCode,
          subdomain: h.subdomain,
          contactEmail: h.contactEmail,
          contactPhone: h.contactPhone,
          address: h.address
        });
        console.log(`Created hotel: ${h.name}`);
      } catch (e) {
        console.log(`Failed to create hotel ${h.name}: ${e.message}`);
        continue;
      }
    } else {
      console.log(`Hotel ${h.name} already exists`);
    }

    // Generate rooms
    const existingRooms = await Room.countDocuments({ hotelId: hotel._id });
    if (existingRooms === 0) {
      const roomsToCreate = [];
      for (let f = 1; f <= h.roomsConf.floors; f++) {
        for (let r = 1; r <= h.roomsConf.roomsPerFloor; r++) {
          roomsToCreate.push({
            hotelId: hotel._id,
            roomNumber: `${f}${String(r).padStart(2, '0')}`,
            floor: f,
            type: 'standard',
            status: 'available'
          });
        }
      }
      await Room.insertMany(roomsToCreate);
      console.log(`Generated ${roomsToCreate.length} rooms for ${h.name}`);
    } else {
       console.log(`Rooms already exist for ${h.name}`);
    }
  }

  process.exit(0);
});
