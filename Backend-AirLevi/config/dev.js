module.exports = {
  dbURL: 'mongodb+srv://Raf_Levi:Raf_Levi123@cluster0.rkdpf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
 dbName: 'AirLevi_db',
 "isGuestMode":true
}

// module.exports = {
// dbURL: 'mongodb+srv://Raf_Levi:Raf_Levi123@cluster0.rkdpf.mongodb.net/AirLevi_db?retryWrites=true&w=majority',
// dbName: 'AirLevi_db'
// }

// require('dotenv').config();

// const config = {
//     dbURL: process.env.MONGO_DB_URL || 'mongodb+srv://Raf_Levi:Raf_levi123@cluster0.rkdpf.mongodb.net/AirLevi_db?retryWrites=true&w=majority',
//     dbName: 'AirLevi_db',
//     isGuestMode: true,
// };

// const mongoose = require('mongoose');
// mongoose.connect(config.dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connected to MongoDB successfully'))
//     .catch((err) => console.error('Failed to connect to MongoDB', err));



// module.exports = {
//   dbURL: 'mongodb+srv://Raf_Levi:Raf_Levi123@cluster0.rkdpf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
//   dbName:'AirLevi_db',
//  isGuestMode: true
// }


// const mongoose = require('mongoose');

// // Get DB URL from environment variable or use default
// const dbURL = process.env.DB_URL ||  'mongodb+srv://Raf_Levi:Raf_Levi123@cluster0.rkdpf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('Successfully connected to MongoDB');
//   })
//   .catch((err) => {
//     console.error('MongoDB connection error:', err);
//   });

