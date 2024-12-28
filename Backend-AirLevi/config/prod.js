module.exports = {
  dbURL: 'mongodb+srv://Raf_Levi:Raf_levi123@cluster0.rkdpf.mongodb.net/AirLevi_db?retryWrites=true&w=majority',
  dbName: 'AirLevi_db'
}


const mongoose = require('mongoose');

function connectToDB() {
  const dbURL = process.env.DB_URL;

  if (!dbURL) {
    throw new Error('MongoDB URL is missing in environment variables.');
  }

  return mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });
}

module.exports = {
  connectToDB,
};

console.log('MongoDB URL from environment:', process.env.DB_URL);
