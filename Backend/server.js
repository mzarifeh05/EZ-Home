const express = require('express')
require('dotenv').config();
const connectDB = require('./src/config/db.config.js')
const app = require('./src/app.js');
const {PORT} = require('./src/config/env.config.js');


const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server running`);

    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
