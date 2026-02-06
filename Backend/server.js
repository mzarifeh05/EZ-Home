const express = require('express')
require('dotenv').config();
const connectDB = require('./src/config/db.js')
const port = process.env.port

connectDB();

const app = express();



app.listen(port, () => {
    console.log("Server running...");
});
