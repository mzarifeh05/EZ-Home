const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const authRoutes = require('./routes/auth.routes.js');


const app = express();


app.use(cors());
app.use(express.json());
app.use(helmet());


app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.json({ message: "API Running..." });
});

module.exports = app;