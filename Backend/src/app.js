const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const authRoutes = require('./routes/auth.routes.js');
const categoryRoutes = require('./routes/category.routes.js');
const productRoutes = require('./routes/product.routes.js');
const cartRoutes = require('./routes/cart.routes.js');
const errorHandler = require('./middlewares/error.js');
const notFound = require('./middlewares/notFound.js');
const app = express();


app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(helmet());
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", require("./routes/wishlist.routes.js"));

app.get("/", (req, res) => {
  res.json({ message: "API Running..." });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
