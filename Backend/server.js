const express = require('express')
require('dotenv').config();
const connectDB = require('./src/config/db.js')
const app = require('./src/app.js');
const {PORT} = require('./src/config/env.js');


const startServer = async () => {
  try {
    connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);

    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
