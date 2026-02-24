const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const authRoutes = require('./routes/auth.routes.js');
const categoryRoutes = require('./routes/category.routes.js');
const productRoutes = require('./routes/product.routes.js');
const errorHandler = require('./middlewares/error.js');
const notFound = require('./middlewares/notFound.js');
const app = express();


app.use(cors());
app.use(express.json());
app.use(helmet());
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Running..." });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
