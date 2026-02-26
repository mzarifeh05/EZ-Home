const mongoose = require("mongoose");
const { DB_CONNECTION } = require('./env');
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB_CONNECTION);

    console.log(`Connected to MongoDB`);
  } catch (error) {
    console.error("Failed to connect to MongoDB");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
