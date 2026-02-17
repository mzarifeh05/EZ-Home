const mongoose = require("mongoose");
require('dotenv').config();
const DB = process.env.DBConnection;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB);

    console.log(`MongoDB Connected:`);
  } catch (error) {
    console.error("Database connection failed");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;