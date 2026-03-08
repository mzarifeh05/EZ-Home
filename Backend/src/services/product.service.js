const Product = require('../models/product.model.js');

function createError(status, message) {
    const err = new Error(message);
    err.status = status;
    err.statusCode = status;
    return err;
}

class ProductService {
    async createProduct(data) {
        const product = new Product({
            name: data.name.trim(),
            price: data.price,
            category: data.category,
            image: data.image || '',
            description: data.description || '',
            stock: data.stock || 0
        });
        await product.save();
        return product;

    }

    async getAllProducts() {
        return await Product.find().populate('category', 'name');
    }

    async getProductById(id) {
        const product = await Product.findById(id).populate('category', 'name');
        if (!product) {
            throw createError(404, 'المنتج غير موجود');
        }
        return product;
    }

    async updateProduct(id, data) {
        const product = await Product.findById(id);
        if (!product) {
            throw createError(404, 'المنتج غير موجود');
        }
        if (data.name !== undefined) {
            product.name = data.name.trim();
        }
        if (data.price !== undefined) {
            product.price = data.price;
        }
        if (data.category !== undefined) {
            product.category = data.category;
        }
        if (data.image !== undefined) {
            product.image = data.image;
        }
        if (data.description !== undefined) {
            product.description = data.description;
        }
        if (data.stock !== undefined) {
            product.stock = data.stock;
        }
        await product.save();
        return product;
    }

    async deleteProduct(id) {
        const product = await Product.findById(id);
        if (!product) {
            throw createError(404, 'المنتج غير موجود');
        }
        await Product.findByIdAndDelete(id);
        return { deleted: true };
    }
}

module.exports = new ProductService();
