const Wishlist = require('../models/wishlist.model.js');
const Product = require('../models/product.model.js');

function createError(status, message) {
  const err = new Error(message);
  err.status = status;
  err.statusCode = status;
  return err;
}

const wishlistPopulateConfig = {
  path: 'products',
  populate: {
    path: 'category',
    select: 'name'
  }
};

class WishlistService {
  async getWishlistByUserId(userId) {
    let wishlist = await Wishlist.findOne({ user: userId }).populate(wishlistPopulateConfig);

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
      await wishlist.populate(wishlistPopulateConfig);
    }

    return wishlist;
  }

  async addProduct(userId, payload) {
    const { productId } = payload;

    const product = await Product.findById(productId).lean();
    if (!product) {
      throw createError(404, 'Product not found');
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    const alreadyExists = wishlist.products.some(
      (id) => String(id) === String(product._id)
    );

    if (!alreadyExists) {
      wishlist.products.push(product._id);
      await wishlist.save();
    }

    await wishlist.populate(wishlistPopulateConfig);
    return wishlist;
  }

  async removeProduct(userId, productId) {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    wishlist.products = wishlist.products.filter(
      (id) => String(id) !== String(productId)
    );

    await wishlist.save();
    await wishlist.populate(wishlistPopulateConfig);
    return wishlist;
  }

  async clearWishlist(userId) {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    } else {
      wishlist.products = [];
      await wishlist.save();
    }

    await wishlist.populate(wishlistPopulateConfig);
    return wishlist;
  }
}

module.exports = new WishlistService();
