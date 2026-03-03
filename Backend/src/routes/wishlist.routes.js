const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller.js');
const { authMiddleware } = require('../middlewares/auth.middlewares.js');
const {
  validateWishlistProductBody,
  validateWishlistProductParam
} = require('../validation/wishlist.validation.js');

router.use(authMiddleware);

router.get('/', wishlistController.getMyWishlist);
router.post('/items', validateWishlistProductBody, wishlistController.addProduct);
router.delete('/items/:productId', validateWishlistProductParam, wishlistController.removeProduct);
router.delete('/', wishlistController.clearWishlist);

module.exports = router;
