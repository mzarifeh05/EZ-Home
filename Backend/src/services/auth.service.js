const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

function createError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

class AuthService {
  async login({ phone, password }) {
    if (!phone || !password) {
      throw createError(400, 'رقم الهاتف وكلمة المرور مطلوبان');
    }

    const user = await User.findOne({ phone });
    if (!user) throw createError(401, 'رقم الهاتف أو كلمة المرور غير صحيحة');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createError(401, 'رقم الهاتف أو كلمة المرور غير صحيحة');

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const safeUser = await User.findById(user._id).select('-password').lean();
    return { user: safeUser, token };
  }
  async register({ fullName, phone, password }) {
    if (!fullName || !phone || !password) {
      throw createError(400, 'جميع الحقول مطلوبة');
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) throw createError(409, 'رقم الهاتف مسجل مسبقاً');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName,
      phone,
      password: hashedPassword,
      role: 'user'
    });

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const safeUser = await User.findById(newUser._id).select('-password').lean();
    return { user: safeUser, token };
  }
  async getMe(userId) {
    const user = await User.findById(userId).select('-password').lean();
    if (!user) throw createError(404, 'المستخدم غير موجود');
    return user;
  }
  async update(id, payload) {
    const { password, ...rest } = payload;
    const updateData = { ...rest };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    return User.findByIdAndUpdate(id, updateData, { new: true })
      .select('-password')
      .lean();
  }
}

module.exports = new AuthService();
