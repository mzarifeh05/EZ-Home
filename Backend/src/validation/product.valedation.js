const { Types } = require('mongoose');

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.status = statusCode;
  error.statusCode = statusCode;
  return error;
};

const ensureObjectBody = (body) => body && typeof body === 'object' && !Array.isArray(body);

const getString = (value) => (typeof value === 'string' ? value.trim() : '');

const parseNumber = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const validateProductId = (req, res, next) => {
  try {
    if (!Types.ObjectId.isValid(req.params?.id)) {
      throw createError(400, 'معرّف المنتج غير صالح');
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

const validateCreateProduct = (req, res, next) => {
  try {
    if (!ensureObjectBody(req.body)) {
      throw createError(400, 'بيانات الطلب غير صالحة');
    }

    const name = getString(req.body.name);
    const price = parseNumber(req.body.price);
    const category = getString(req.body.category);
    const image = req.body.image === undefined ? '' : getString(req.body.image);
    const description =
      req.body.description === undefined ? '' : getString(req.body.description);
    const stock = req.body.stock === undefined ? 0 : parseNumber(req.body.stock);

    if (!name) throw createError(400, 'اسم المنتج مطلوب');
    if (name.length > 150) throw createError(400, 'اسم المنتج طويل جداً');

    if (price === null || price < 0) {
      throw createError(400, 'السعر يجب أن يكون رقماً أكبر من أو يساوي 0');
    }

    if (!category) throw createError(400, 'الفئة مطلوبة');
    if (!Types.ObjectId.isValid(category)) {
      throw createError(400, 'معرّف الفئة غير صالح');
    }

    if (stock === null || stock < 0) {
      throw createError(400, 'المخزون يجب أن يكون رقماً أكبر من أو يساوي 0');
    }

    req.body = { name, price, category, image, description, stock };
    return next();
  } catch (error) {
    return next(error);
  }
};

const validateUpdateProduct = (req, res, next) => {
  try {
    if (!ensureObjectBody(req.body)) {
      throw createError(400, 'بيانات الطلب غير صالحة');
    }

    const payload = {};

    if (req.body.name !== undefined) {
      const name = getString(req.body.name);
      if (!name) throw createError(400, 'اسم المنتج لا يمكن أن يكون فارغاً');
      if (name.length > 150) throw createError(400, 'اسم المنتج طويل جداً');
      payload.name = name;
    }

    if (req.body.price !== undefined) {
      const price = parseNumber(req.body.price);
      if (price === null || price < 0) {
        throw createError(400, 'السعر يجب أن يكون رقماً أكبر من أو يساوي 0');
      }
      payload.price = price;
    }

    if (req.body.category !== undefined) {
      const category = getString(req.body.category);
      if (!Types.ObjectId.isValid(category)) {
        throw createError(400, 'معرّف الفئة غير صالح');
      }
      payload.category = category;
    }

    if (req.body.image !== undefined) {
      payload.image = getString(req.body.image);
    }

    if (req.body.description !== undefined) {
      payload.description = getString(req.body.description);
    }

    if (req.body.stock !== undefined) {
      const stock = parseNumber(req.body.stock);
      if (stock === null || stock < 0) {
        throw createError(400, 'المخزون يجب أن يكون رقماً أكبر من أو يساوي 0');
      }
      payload.stock = stock;
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
  validateProductId,
  validateCreateProduct,
  validateUpdateProduct
};
