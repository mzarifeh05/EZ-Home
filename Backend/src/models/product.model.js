const mongo = require('mongoose');

const ProductSchema = new mongo.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    category: {
        type: mongo.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

const Product = mongo.model("Product", ProductSchema);

module.exports = Product;