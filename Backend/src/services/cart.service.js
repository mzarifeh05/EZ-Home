const Cart = require('../models/cart.model.js');
const Product = require('../models/product.model.js');

function createError(status, message) {
    const err = new Error(message);
    err.status = status;
    err.statusCode = status;
    return err;
}

class CartService {
    async getCartByUserId(userId) {
        let cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
            await cart.populate('items.product');
        }
        return cart;
    }

    async addItem(userId, payload) {
        const { productId, qty = 1 } = payload;

        const product = await Product.findById(productId).lean();
        if (!product) {
            throw createError(404, 'المنتج غير موجود');
        }

        if (product.stock !== undefined && qty > product.stock) {
            throw createError(400, 'الكمية المطلوبة أكبر من المخزون المتاح');
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }

        const existingItem = cart.items.find(
            (item) => String(item.product) === String(product._id)
        );

        if (existingItem) {
            const nextQty = existingItem.qty + qty;

            if (nextQty > 100) {
                throw createError(400, 'الحد الأقصى لكمية المنتج الواحد هو 100');
            }

            if (product.stock !== undefined && nextQty > product.stock) {
                throw createError(400, 'الكمية المطلوبة أكبر من المخزون المتاح');
            }

            existingItem.qty = nextQty;
            existingItem.price = product.price;
        } else {
            cart.items.push({
                product: product._id,
                qty,
                price: product.price
            });
        }

        await cart.save();
        await cart.populate('items.product');
        return cart;
    }

    async updateItemQty(userId, itemId, payload) {
        const { qty } = payload;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            throw createError(404, 'السلة غير موجودة');
        }

        const item = cart.items.id(itemId);
        if (!item) {
            throw createError(404, 'العنصر غير موجود في السلة');
        }

        const product = await Product.findById(item.product).lean();
        if (!product) {
            throw createError(404, 'المنتج غير موجود');
        }

        if (product.stock !== undefined && qty > product.stock) {
            throw createError(400, 'الكمية المطلوبة أكبر من المخزون المتاح');
        }

        item.qty = qty;
        item.price = product.price;

        await cart.save();
        await cart.populate('items.product');
        return cart;
    }

    async removeItem(userId, itemId) {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            throw createError(404, 'السلة غير موجودة');
        }

        const item = cart.items.id(itemId);
        if (!item) {
            throw createError(404, 'العنصر غير موجود في السلة');
        }

        item.deleteOne();
        await cart.save();
        await cart.populate('items.product');
        return cart;
    }

    async clearCart(userId) {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        } else {
            cart.items = [];
            await cart.save();
        }

        await cart.populate('items.product');
        return cart;
    }
}

module.exports = new CartService();
