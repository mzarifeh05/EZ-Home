const mongo = require('mongoose');

const OrderSchema = new mongo.Schema({
    user: {
        type: mongo.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    customer: {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        }
    },
    items: [
        {
            product: {
                type: mongo.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            productName: {
                type: String,
                required: true,
                trim: true
            },
            qty: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true,
                min: 0
            },
            lineTotal: {
                type: Number,
                required: true,
                min: 0
            }
        }
    ],
    total: {
        type: Number,
        required: true,
        min: 0
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
