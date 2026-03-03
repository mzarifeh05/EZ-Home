const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const { NODE_ENV } = require('./config/env.config.js');
const { apiLimiter } = require('./middlewares/rateLimit.middlewares');
const {CLIENT_URL} = require('./config/env.config.js');
const authRoutes = require('./routes/auth.routes.js');
const categoryRoutes = require('./routes/category.routes.js');
const productRoutes = require('./routes/product.routes.js');
const cartRoutes = require('./routes/cart.routes.js');
const wishlistRoutes = require('./routes/wishlist.routes.js');
const orderRoutes = require('./routes/order.routes.js');
const errorHandler = require('./middlewares/error.middlewares.js');
const notFound = require('./middlewares/notFound.middlewares.js');
const app = express();

const isProduction = NODE_ENV;

app.use(helmet({
  contentSecurityPolicy: isProduction ? {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'"],
      styleSrc:    ["'self'", "'unsafe-inline'"],
      imgSrc:      ["'self'", "data:", "https:"],
      connectSrc:  ["'self'"],
      objectSrc:   ["'none'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: []
    }
  } : false,

  frameguard: { action: 'deny' },


  hsts: isProduction ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  } : false,

  noSniff: true,
  hidePoweredBy: true,
  dnsPrefetchControl: { allow: false },
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-origin" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  originAgentCluster: true,
}));

app.use(cors({
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(hpp());
app.use("/api/auth", authRoutes);
app.use('/api/', apiLimiter);
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
