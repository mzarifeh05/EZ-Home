const authService = require('../services/auth.service');


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
      return res.status(error.status).json({
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
      return res.status(error.status).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  async logout(req, res) {
    return res.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح'
    });
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

  async update(req, res) {
    try {
        const user = await authService.update(req.params.id, req.body);
    return res.json({
      success: true,
      data: user
    });
    }catch (error) {
        return res.status(error.status).json({
            success: false,
            message: error.message,
            error: error.message
          });
    }
  }

}

module.exports = new AuthController();
