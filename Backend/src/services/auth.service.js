const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

class AuthService {
  async login({ phone, password }) {
    if (!JWT_SECRET) {
      throw createError(500, 'JWT_SECRET is not configured');
    }

    if (!phone || !password) {
      throw createError(400, 'phone and password are required');
    }

    const user = await User.findOne({ phone });
    if (!user) {
      throw createError(401, 'invalid phone or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw createError(401, 'invalid phone or password');
    }

    const token = jwt.sign(
      {
        userId: user._id,
        UserId: user._id,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const userData = await User.findById(user._id).select('-password').lean();

    return {
      user: userData,
      token
    };
  }

  async register({ fullName, phone, password }) {
    if (!JWT_SECRET) {
      throw createError(500, 'JWT_SECRET is not configured');
    }

    if (!fullName || !phone || !password) {
      throw createError(400, 'fullName, phone and password are required');
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      throw createError(409, 'phone already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      phone,
      password: hashedPassword,
      role: 'user'
    });

    const token = jwt.sign(
      {
        userId: newUser._id,
        UserId: newUser._id,
        role: newUser.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const userData = await User.findById(newUser._id).select('-password').lean();

    return {
      user: userData,
      token
    };
  }

  async updateUser(userId, payload) {
    const { password, ...rest } = payload;
    const updateData = { ...rest };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    return User.findByIdAndUpdate(userId, updateData, { new: true })
      .select('-password')
      .lean();
  }
}

module.exports = new AuthService();
