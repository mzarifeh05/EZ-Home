const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { JWT_SECRET } = require('../config/env');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'unauthorized'
      });
    }



    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded.UserId;

    const user = await User.findById(userId).select('-password').lean();
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'unauthorized'
      });
    }

    req.user = user;
    return next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'unauthorized'
    });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'unauthorized'
      });
    }

    if (!Array.isArray(roles) || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'forbidden'
      });
    }

    return next();
  };
};

module.exports = {
  authMiddleware,
  authorize
};
