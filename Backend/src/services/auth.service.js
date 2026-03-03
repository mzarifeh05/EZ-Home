const { hashPassword, comparePassword } = require('../utils/hash.utils');
const { generateToken } = require('../utils/jwt.utils');
const User = require('../models/user.model');

function createError(status, message) {
  const err = new Error(message);
  err.status = status;
  err.statusCode = status;
  return err;
}

class AuthService {
  async login({ phone, password }) {
    const user = await User.findOne({ phone }).select('+password');
    if (!user) throw createError(401, 'رقم الهاتف أو كلمة المرور غير صحيحة');

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw createError(401, 'رقم الهاتف أو كلمة المرور غير صحيحة');

    const token = generateToken({ userId: user._id, role: user.role });

    const safeUser = await User.findById(user._id).select('-password').lean();
    return { user: safeUser, token };
  }

  async register({ fullName, phone, password }) {
    const existingUser = await User.findOne({ phone });
    if (existingUser) throw createError(409, 'رقم الهاتف مسجل مسبقاً');

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      fullName,
      phone,
      password: hashedPassword,
      role: 'user'
    });

    const token = generateToken({ userId: newUser._id, role: newUser.role });

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
      updateData.password = await hashPassword(password);
    }

    return User.findByIdAndUpdate(id, updateData, { new: true })
      .select('-password')
      .lean();
  }

}

module.exports = new AuthService();
