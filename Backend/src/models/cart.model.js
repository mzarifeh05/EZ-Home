const mongo = require('mongoose');
const CartSchema = new mongo.Schema({
    user: {
        type: mongo.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            product: {
                type: mongo.Schema.Types.ObjectId,
                ref: "Product"
            },

            qty: {
                type: Number,
                default: 1,
                min: 1
            }
        }
    ]
}, {
    timestamps: true
});

const Cart = mongo.model("Cart", CartSchema);


module.exports = Cart;

