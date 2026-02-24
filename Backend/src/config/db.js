const mongoose = require("mongoose");
const { DB_CONNECTION } = require('./env');
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB_CONNECTION);

    console.log(`MongoDB Connected:`);
  } catch (error) {
    console.error("Database connection failed");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;