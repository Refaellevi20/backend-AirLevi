module.exports = {
  dbURL: process.env.DB_URL || 'mongodb+srv://Raf_Levi:Raf_Levi123@cluster0.rkdpf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
 dbName:'AirLevi_db',
}

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

