const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests' },
});

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,             
  skipSuccessfulRequests: true,
  message: { error: 'Too many login attempts' },
});

module.exports = { apiLimiter, authLimiter };