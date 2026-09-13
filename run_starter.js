const mongoose = require('mongoose');
const { Hotel } = require('./backend/src/models');
const { generateStarterDataForHotel } = require('./backend/src/services/starterDataGenerator');

mongoose.connect('mongodb://localhost:27017/stayflow')
  .then(async () => {
    const hotels = await Hotel.find();
    for (const hotel of hotels) {
      await generateStarterDataForHotel(hotel);
    }
    console.log('Done');
    process.exit(0);
  });
