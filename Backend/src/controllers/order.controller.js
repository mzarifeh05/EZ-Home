const orderService = require('../services/order.service.js');

const getStatusCode = (error) => {
    const statusCode = Number(error?.statusCode ?? error?.status);
    return Number.isInteger(statusCode) && statusCode >= 100 && statusCode <= 599
        ? statusCode
        : 500;
};

class OrderController {
    async createOrder(req, res) {
        try {
            const order = await orderService.createOrderFromCart(req.user._id, req.body);
            return res.status(201).json({
                success: true,
                message: 'Order placed successfully',
                data: order
            });
        } catch (error) {
            return res.status(getStatusCode(error)).json({
                success: false,
                message: error.message,
                error: error.message
            });
        }
    }

    async getMyOrders(req, res) {
        try {
            const orders = await orderService.getMyOrders(req.user._id);
            return res.json({
                success: true,
                message: 'Orders fetched successfully',
                data: orders
            });
        } catch (error) {
            return res.status(getStatusCode(error)).json({
                success: false,
                message: error.message,
                error: error.message
            });
        }
    }

    async getAllOrdersForAdmin(req, res) {
        try {
            const orders = await orderService.getAllOrders();
            return res.json({
                success: true,
                message: 'All orders fetched successfully',
                data: orders
            });
        } catch (error) {
            return res.status(getStatusCode(error)).json({
                success: false,
                message: error.message,
                error: error.message
            });
        }
    }

    async updateOrderStatus(req, res) {
        try {
            const order = await orderService.updateOrderStatus(req.params.orderId, req.body.status);
            return res.json({
                success: true,
                message: 'Order status updated successfully',
                data: order
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

module.exports = new OrderController();
