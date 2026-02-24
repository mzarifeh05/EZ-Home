const Product = require('../models/product.model.js');

function createError(status, message) {
    const err = new Error(message);
    err.status = status;
    err.statusCode = status;
    return err;
}

class ProductService {
    async createProduct(data) {
        if (!data.name || !data.name.trim()) {
            throw createError(400, 'اسم المنتج مطلوب');
        }
        if (!data.price || isNaN(data.price) || data.price < 0) {
            throw createError(400, 'السعر غير صالح');
        }
        if (!data.category) {
            throw createError(400, 'الفئة مطلوبة');
        }
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
            if (!data.name.trim()) {
                throw createError(400, 'اسم المنتج لا يمكن أن يكون فارغ');
            }
            product.name = data.name.trim();
        }
        if (data.price !== undefined) {
            if (isNaN(data.price) || data.price < 0) {
                throw createError(400, 'السعر غير صالح');
            }
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
            if (isNaN(data.stock) || data.stock < 0) {
                throw createError(400, 'المخزون غير صالح');
            }
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