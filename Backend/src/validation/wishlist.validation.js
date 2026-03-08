const { Types } = require('mongoose');

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.status = statusCode;
  error.statusCode = statusCode;
  return error;
};

const ensureObjectBody = (body) => body && typeof body === 'object' && !Array.isArray(body);

const validateWishlistProductBody = (req, res, next) => {
  try {
    if (!ensureObjectBody(req.body)) {
      throw createError(400, 'Request body is invalid');
    }

    const productId = typeof req.body.productId === 'string'
      ? req.body.productId.trim()
      : '';

    if (!Types.ObjectId.isValid(productId)) {
      throw createError(400, 'Product id is invalid');
    }

    req.body = { productId };
    return next();
  } catch (error) {
    return next(error);
  }
};

const validateWishlistProductParam = (req, res, next) => {
  try {
    const { productId } = req.params;
    if (!Types.ObjectId.isValid(productId)) {
      throw createError(400, 'Product id is invalid');
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  validateWishlistProductBody,
  validateWishlistProductParam
};
