const wishlistService = require('../services/wishlist.service.js');

const getStatusCode = (error) => {
  const statusCode = Number(error?.statusCode ?? error?.status);
  return Number.isInteger(statusCode) && statusCode >= 100 && statusCode <= 599
    ? statusCode
    : 500;
};

class WishlistController {
  async getMyWishlist(req, res) {
    try {
      const wishlist = await wishlistService.getWishlistByUserId(req.user._id);
      return res.json({
        success: true,
        message: 'Wishlist fetched successfully',
        data: wishlist
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  async addProduct(req, res) {
    try {
      const wishlist = await wishlistService.addProduct(req.user._id, req.body);
      return res.status(201).json({
        success: true,
        message: 'Product added to wishlist successfully',
        data: wishlist
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  async removeProduct(req, res) {
    try {
      const wishlist = await wishlistService.removeProduct(req.user._id, req.params.productId);
      return res.json({
        success: true,
        message: 'Product removed from wishlist successfully',
        data: wishlist
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  async clearWishlist(req, res) {
    try {
      const wishlist = await wishlistService.clearWishlist(req.user._id);
      return res.json({
        success: true,
        message: 'Wishlist cleared successfully',
        data: wishlist
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

module.exports = new WishlistController();
