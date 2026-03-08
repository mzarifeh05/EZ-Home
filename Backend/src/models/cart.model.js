const mongo = require('mongoose');
const CartItemSchema = new mongo.Schema({

     product: {
        type: mongo.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    qty: {
        type: Number,
        default: 1,
        min: 1,
        max: 100
    },
    price: {
        type: Number,
        required: true 
    }
},
    { _id: true });

    const CartSchema = new mongo.Schema({
    user: {
        type: mongo.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true 
    },
    items: [CartItemSchema],
    
    totalPrice: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

CartSchema.pre('save', function() {
    this.totalPrice = this.items.reduce((acc, item) => {
        return acc + (item.price * item.qty);
    }, 0);
});


const Cart = mongo.model("Cart", CartSchema);


module.exports = Cart;

