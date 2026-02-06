const mongo = require('mongoose');

const OrderSchema = new mongo.Schema({
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

            qty: Number,

            price: Number
        }
    ],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "paid", "shipped"],
        default: "pending"
    }

}, {
    timestamps: true
});

const Order = mongo.model("Order", OrderSchema);

module.exports = Order;