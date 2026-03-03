const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller.js');
const { authMiddleware, authorize } = require('../middlewares/auth.middlewares.js');
const {
    validateCreateOrder,
    validateOrderIdParam,
    validateUpdateOrderStatus
} = require('../validation/order.validation.js');

router.use(authMiddleware);

router.post('/', validateCreateOrder, orderController.createOrder);
router.get('/my', orderController.getMyOrders);
router.get('/admin/all', authorize(['admin']), orderController.getAllOrdersForAdmin);
router.patch(
    '/admin/:orderId/status',
    authorize(['admin']),
    validateOrderIdParam('orderId'),
    validateUpdateOrderStatus,
    orderController.updateOrderStatus
);

module.exports = router;
