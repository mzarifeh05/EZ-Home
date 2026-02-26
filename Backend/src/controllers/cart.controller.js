const cartService = require('../services/cart.service.js');

const getStatusCode = (error) => {
  const statusCode = Number(error?.statusCode ?? error?.status);
  return Number.isInteger(statusCode) && statusCode >= 100 && statusCode <= 599
    ? statusCode
    : 500;
};

class CartController {
  async getMyCart(req, res) {
    try {
      const cart = await cartService.getCartByUserId(req.user._id);
      return res.json({
        success: true,
        message: 'تم جلب السلة بنجاح',
        data: cart
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  async addItem(req, res) {
    try {
      const cart = await cartService.addItem(req.user._id, req.body);
      return res.status(201).json({
        success: true,
        message: 'تمت إضافة المنتج إلى السلة بنجاح',
        data: cart
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  async updateItemQty(req, res) {
    try {
      const cart = await cartService.updateItemQty(
        req.user._id,
        req.params.itemId,
        req.body
      );
      return res.json({
        success: true,
        message: 'تم تحديث كمية المنتج في السلة بنجاح',
        data: cart
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  async removeItem(req, res) {
    try {
      const cart = await cartService.removeItem(req.user._id, req.params.itemId);
      return res.json({
        success: true,
        message: 'تم حذف المنتج من السلة بنجاح',
        data: cart
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  async clearCart(req, res) {
    try {
      const cart = await cartService.clearCart(req.user._id);
      return res.json({
        success: true,
        message: 'تم تفريغ السلة بنجاح',
        data: cart
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

module.exports = new CartController();
