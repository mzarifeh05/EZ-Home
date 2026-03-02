const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const {CLIENT_URL} = require('./config/env.js');
const authRoutes = require('./routes/auth.routes.js');
const categoryRoutes = require('./routes/category.routes.js');
const productRoutes = require('./routes/product.routes.js');
const cartRoutes = require('./routes/cart.routes.js');
const wishlistRoutes = require('./routes/wishlist.routes.js');
const orderRoutes = require('./routes/order.routes.js');
const errorHandler = require('./middlewares/error.js');
const notFound = require('./middlewares/notFound.js');
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});

app.use(cors({
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use(hpp());
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);


app.get("/", (req, res) => {
  res.json({ message: "API Running..." });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
