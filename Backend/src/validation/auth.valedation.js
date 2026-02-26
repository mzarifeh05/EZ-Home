const { Types } = require('mongoose');

const USER_ROLES = ['user', 'admin'];

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.status = statusCode;
  error.statusCode = statusCode;
  return error;
};

const normalizePhone = (input) => {
  if (typeof input !== 'string') return null;

  const value = input.replace(/\s+/g, '').trim();

  if (/^009627\d{8}$/.test(value)) return value;
  if (/^\+9627\d{8}$/.test(value)) return `00962${value.slice(4)}`;
  if (/^9627\d{8}$/.test(value)) return `00${value}`;
  if (/^07\d{8}$/.test(value)) return `00962${value.slice(1)}`;
  if (/^7\d{8}$/.test(value)) return `00962${value}`;

  return null;
};

const getString = (value) => (typeof value === 'string' ? value.trim() : '');

const ensureObjectBody = (body) => body && typeof body === 'object' && !Array.isArray(body);

const validateLogin = (req, res, next) => {
  try {
    if (!ensureObjectBody(req.body)) {
      throw createError(400, 'بيانات الطلب غير صالحة');
    }

    const phone = normalizePhone(req.body.phone);
    const password = getString(req.body.password);

    if (!phone || !password) {
      throw createError(400, 'رقم الهاتف وكلمة المرور مطلوبان');
    }

    req.body = { phone, password };
    return next();
  } catch (error) {
    return next(error);
  }
};

const validateRegister = (req, res, next) => {
  try {
    if (!ensureObjectBody(req.body)) {
      throw createError(400, 'بيانات الطلب غير صالحة');
    }

    const fullName = getString(req.body.fullName);
    const phone = normalizePhone(req.body.phone);
    const password = getString(req.body.password);

    if (!fullName || !phone || !password) {
      throw createError(400, 'جميع الحقول مطلوبة');
    }

    if (fullName.length < 3 || fullName.length > 80) {
      throw createError(400, 'الاسم يجب أن يكون بين 3 و 80 حرفاً');
    }

    if (password.length < 6 || password.length > 72) {
      throw createError(400, 'كلمة المرور يجب أن تكون بين 6 و 72 حرفاً');
    }

    req.body = { fullName, phone, password };
    return next();
  } catch (error) {
    return next(error);
  }
};

const buildUpdateValidator = ({ allowRole }) => (req, res, next) => {
  try {
    if (!ensureObjectBody(req.body)) {
      throw createError(400, 'بيانات الطلب غير صالحة');
    }

    const payload = {};

    if (req.body.fullName !== undefined) {
      const fullName = getString(req.body.fullName);
      if (!fullName) throw createError(400, 'الاسم لا يمكن أن يكون فارغاً');
      if (fullName.length < 3 || fullName.length > 80) {
        throw createError(400, 'الاسم يجب أن يكون بين 3 و 80 حرفاً');
      }
      payload.fullName = fullName;
    }

    if (req.body.phone !== undefined) {
      const phone = normalizePhone(req.body.phone);
      if (!phone) throw createError(400, 'رقم الهاتف غير صالح');
      payload.phone = phone;
    }

    if (req.body.password !== undefined) {
      const password = getString(req.body.password);
      if (password.length < 6 || password.length > 72) {
        throw createError(400, 'كلمة المرور يجب أن تكون بين 6 و 72 حرفاً');
      }
      payload.password = password;
    }

    if (allowRole && req.body.role !== undefined) {
      const role = getString(req.body.role).toLowerCase();
      if (!USER_ROLES.includes(role)) {
        throw createError(400, 'قيمة الدور غير صالحة');
      }
      payload.role = role;
    }

    if (Object.keys(payload).length === 0) {
      throw createError(400, 'لا توجد بيانات صالحة للتحديث');
    }

    req.body = payload;
    return next();
  } catch (error) {
    return next(error);
  }
};

const validateObjectIdParam = (paramName = 'id') => (req, res, next) => {
  try {
    const value = req.params?.[paramName];
    if (!Types.ObjectId.isValid(value)) {
      throw createError(400, 'معرّف المستخدم غير صالح');
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  validateLogin,
  validateRegister,
  validateUpdateMe: buildUpdateValidator({ allowRole: false }),
  validateAdminUpdate: buildUpdateValidator({ allowRole: true }),
  validateObjectIdParam
};
