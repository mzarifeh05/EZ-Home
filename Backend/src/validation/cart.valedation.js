const { Types } = require('mongoose');

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.status = statusCode;
  error.statusCode = statusCode;
  return error;
};

const ensureObjectBody = (body) => body && typeof body === 'object' && !Array.isArray(body);

const parseInteger = (value) => {
  if (typeof value === 'number' && Number.isInteger(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isInteger(parsed)) return parsed;
  }
  return null;
};

const validateItemIdParam = (paramName = 'itemId') => (req, res, next) => {
  try {
    if (!Types.ObjectId.isValid(req.params?.[paramName])) {
      throw createError(400, 'معرّف عنصر السلة غير صالح');
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

const validateAddItem = (req, res, next) => {
  try {
    if (!ensureObjectBody(req.body)) {
      throw createError(400, 'بيانات الطلب غير صالحة');
    }

    const productId = typeof req.body.productId === 'string'
      ? req.body.productId.trim()
      : '';
    const qty = req.body.qty === undefined ? 1 : parseInteger(req.body.qty);

    if (!Types.ObjectId.isValid(productId)) {
      throw createError(400, 'معرّف المنتج غير صالح');
    }

    if (qty === null || qty < 0 || qty > 100) {
      throw createError(400, 'الكمية يجب أن تكون رقماً صحيحاً بين 0 و 100');
    }

    req.body = { productId, qty };
    return next();
  } catch (error) {
    return next(error);
  }
};

const validateUpdateItemQty = (req, res, next) => {
  try {
    if (!ensureObjectBody(req.body)) {
      throw createError(400, 'بيانات الطلب غير صالحة');
    }

    const qty = parseInteger(req.body.qty);
    if (qty === null || qty < 0 || qty > 100) {
      throw createError(400, 'الكمية يجب أن تكون رقماً صحيحاً بين 0 و 100');
    }

    req.body = { qty };
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  validateItemIdParam,
  validateAddItem,
  validateUpdateItemQty
};
