const authService = require('../services/auth.service');

const getStatusCode = (error) => {
  const statusCode = Number(error?.statusCode ?? error?.status);
  return Number.isInteger(statusCode) && statusCode >= 100 && statusCode <= 599
    ? statusCode
    : 500;
};

class AuthController {
  async login(req, res) {
    try {
      const data = await authService.login(req.body);

      return res.json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        data
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  async register(req, res) {
    try {
      const data = await authService.register(req.body);

      return res.json({
        success: true,
        message: 'تم التسجيل بنجاح',
        data
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  async logout(req, res) {
    try {
      return res.json({
        success: true,
        message: 'تم تسجيل الخروج بنجاح'
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  async getMe(req, res) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح'
      });
    }

    return res.json({
      success: true,
      data: req.user
    });
  }

  async updateMe(req, res) {
    try {
      const user = await authService.update(req.user._id, req.body);
      return res.json({
        success: true,
        data: user
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const user = await authService.update(req.params.id, req.body);
      return res.json({
        success: true,
        data: user
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }
}

module.exports = new AuthController();
