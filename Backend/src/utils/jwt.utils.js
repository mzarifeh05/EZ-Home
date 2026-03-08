const jwt = require('jsonwebtoken');
const env = require('../config/env.config');

const generateToken = (payload, expiresIn = env.JWT_EXPIRES_IN) => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
    return jwt.verify(token, env.JWT_SECRET);
};

module.exports = {
    generateToken,
    verifyToken
};
