const mongo = require('mongoose');

const WishlistSchema = new mongo.Schema({
  user:{
    type: mongo.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  products:[
    {
      type: mongo.Schema.Types.ObjectId,
      ref:"Product"
    }
  ]
},{
  timestamps:true
});

const Wishlist = mongo.model("Wishlist", WishlistSchema);

module.exports = Wishlist;
