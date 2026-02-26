const { Types } = require('mongoose');

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.status = statusCode;
  error.statusCode = statusCode;
  return error;
};

const ensureObjectBody = (body) => body && typeof body === 'object' && !Array.isArray(body);

const getString = (value) => (typeof value === 'string' ? value.trim() : '');

const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  return null;
};

const validateCategoryId = (req, res, next) => {
  try {
    if (!Types.ObjectId.isValid(req.params?.id)) {
      throw createError(400, 'معرّف التصنيف غير صالح');
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

const validateCreateCategory = (req, res, next) => {
  try {
    if (!ensureObjectBody(req.body)) {
      throw createError(400, 'بيانات الطلب غير صالحة');
    }

    const name = getString(req.body.name);
    const hasIsActive = req.body.isActive !== undefined;
    const isActive = hasIsActive ? parseBoolean(req.body.isActive) : undefined;

    if (!name) throw createError(400, 'اسم التصنيف مطلوب');
    if (name.length > 100) throw createError(400, 'اسم التصنيف طويل جداً');

    if (hasIsActive && isActive === null) {
      throw createError(400, 'حالة التفعيل يجب أن تكون قيمة منطقية');
    }

    req.body = hasIsActive ? { name, isActive } : { name };
    return next();
  } catch (error) {
    return next(error);
  }
};

const validateUpdateCategory = (req, res, next) => {
  try {
    if (!ensureObjectBody(req.body)) {
      throw createError(400, 'بيانات الطلب غير صالحة');
    }

    const payload = {};

    if (req.body.name !== undefined) {
      const name = getString(req.body.name);
      if (!name) throw createError(400, 'اسم التصنيف لا يمكن أن يكون فارغاً');
      if (name.length > 100) throw createError(400, 'اسم التصنيف طويل جداً');
      payload.name = name;
    }

    if (req.body.isActive !== undefined) {
      const isActive = parseBoolean(req.body.isActive);
      if (isActive === null) throw createError(400, 'حالة التفعيل يجب أن تكون قيمة منطقية');
      payload.isActive = isActive;
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

module.exports = {
  validateCategoryId,
  validateCreateCategory,
  validateUpdateCategory
};
