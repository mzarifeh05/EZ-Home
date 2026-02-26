const resolveStatusCode = (err) => {
  const statusCode = Number(err?.statusCode ?? err?.status);

  if (Number.isInteger(statusCode) && statusCode >= 100 && statusCode <= 599) {
    return statusCode;
  }

  return 500;
};

const errorHandler = (err, req, res, next) => {
  console.error('خطأ:', err);
  const statusCode = resolveStatusCode(err);

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'توكن غير صالح'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'انتهت صلاحية التوكن'
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'خطأ في البيانات المدخلة',
      errors: err.errors
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'حدث خطأ في الخادم',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
