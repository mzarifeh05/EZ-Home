const { Types } = require('mongoose');

const ORDER_STATUSES = ['pending', 'paid', 'shipped'];

const createError = (statusCode, message) => {
    const error = new Error(message);
    error.status = statusCode;
    error.statusCode = statusCode;
    return error;
};

const ensureObjectBody = (body) => body && typeof body === 'object' && !Array.isArray(body);

const getString = (value) => (typeof value === 'string' ? value.trim() : '');

const validateCreateOrder = (req, res, next) => {
    try {
        if (!ensureObjectBody(req.body)) {
            throw createError(400, 'Invalid request body');
        }

        const city = getString(req.body.city);
        if (!city) {
            throw createError(400, 'City is required');
        }

        if (city.length < 2 || city.length > 80) {
            throw createError(400, 'City must be between 2 and 80 characters');
        }

        req.body = { city };
        return next();
    } catch (error) {
        return next(error);
    }
};

const validateOrderIdParam = (paramName = 'orderId') => (req, res, next) => {
    try {
        if (!Types.ObjectId.isValid(req.params?.[paramName])) {
            throw createError(400, 'Invalid order id');
        }
        return next();
    } catch (error) {
        return next(error);
    }
};

const validateUpdateOrderStatus = (req, res, next) => {
    try {
        if (!ensureObjectBody(req.body)) {
            throw createError(400, 'Invalid request body');
        }

        const status = getString(req.body.status).toLowerCase();
        if (!status) {
            throw createError(400, 'Status is required');
        }

        if (!ORDER_STATUSES.includes(status)) {
            throw createError(400, 'Invalid status value');
        }

        req.body = { status };
        return next();
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    validateCreateOrder,
    validateOrderIdParam,
    validateUpdateOrderStatus
};
