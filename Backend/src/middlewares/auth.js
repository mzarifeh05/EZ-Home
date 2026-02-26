const { verifyToken } = require('../utils/jwt');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const userId = decoded.userId || decoded.UserId;

    const user = await User.findById(userId).select('-password').lean();
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح'
      });
    }

    req.user = user;
    return next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح'
    });
  }
};

const authorize = (roles) => {
  const normalizedRoles = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح'
      });
    }

    if (!normalizedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'غير مسموح'
      });
    }

    return next();
  };
};

module.exports = {
  authMiddleware,
  authorize
};
