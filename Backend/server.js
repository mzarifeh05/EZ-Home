const express = require('express')
require('dotenv').config();
const connectDB = require('./src/config/db.js')
const app = require('./src/app.js');

const port = process.env.port


const startServer = async () => {
  try {
    connectDB();
    const port = process.env.PORT
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);

    });
  } catch (error) {
    console.error("Failed to connect to DB:", error);
    process.exit(1);
  }
}

startServer();