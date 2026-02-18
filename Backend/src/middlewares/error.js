const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

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

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'حدث خطأ في الخادم',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;