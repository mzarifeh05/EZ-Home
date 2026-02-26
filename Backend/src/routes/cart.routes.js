const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller.js');
const { authMiddleware } = require('../middlewares/auth.js');
const {validateItemIdParam, validateAddItem, validateUpdateItemQty} = require('../validation/cart.valedation.js');

router.use(authMiddleware);

router.get('/', cartController.getMyCart);
router.post('/items', validateAddItem, cartController.addItem);
router.patch('/items/:itemId', validateItemIdParam('itemId'), validateUpdateItemQty, cartController.updateItemQty);
router.delete('/items/:itemId', validateItemIdParam('itemId'), cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;
