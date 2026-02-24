const ProductService = require('../services/product.service.js');

const getStatusCode = (error) => {
    const statusCode = Number(error?.statusCode ?? error?.status);
    return Number.isInteger(statusCode) && statusCode >= 100 && statusCode <= 599
        ? statusCode
        : 500;
};

class ProductController {
    async createProduct(req, res) {
        try {
            const product = await ProductService.createProduct(req.body);
            res.status(201).json({
                success: true,
                message: 'تم إنشاء المنتج بنجاح',
                data: product
            });
        } catch (error) {
            return res.status(getStatusCode(error)).json({
                success: false,
                message: error.message,
                error: error.message
            });
        }
    }

    async getAllProducts(req, res) {
        try {
            const products = await ProductService.getAllProducts();
            res.json({
                success: true,
                message: 'تم جلب المنتجات بنجاح',
                data: products
            });
        } catch (error) {
            return res.status(getStatusCode(error)).json({
                success: false,
                message: error.message,
                error: error.message
            });
        }
    }

    async getProductById(req, res) {
        try {
            const product = await ProductService.getProductById(req.params.id);
            res.json({
                success: true,
                message: 'تم جلب المنتج بنجاح',
                data: product
            });
        } catch (error) {
            return res.status(getStatusCode(error)).json({
                success: false,
                message: error.message,
                error: error.message
            });
        }
    }

    async updateProduct(req, res) {
        try {
            const product = await ProductService.updateProduct(req.params.id, req.body);
            res.json({
                success: true,
                message: 'تم تحديث المنتج بنجاح',
                data: product
            });
        } catch (error) {
            return res.status(getStatusCode(error)).json({
                success: false,
                message: error.message,
                error: error.message
            });
        }

    }

    async deleteProduct(req, res) {
        try {
            await ProductService.deleteProduct(req.params.id);
            res.json({
                success: true,
                message: 'تم حذف المنتج بنجاح'
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

module.exports = new ProductController();