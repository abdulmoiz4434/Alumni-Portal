const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MongoDB URI. Set MONGO_URI or MONGODB_URI in .env');
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error on mongoose: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;