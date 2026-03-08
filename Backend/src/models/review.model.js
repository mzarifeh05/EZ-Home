const mongo = require('mongoose');

const reviewSchema = new mongo.Schema({
    user:{
    type: mongo.Schema.Types.ObjectId,
    ref:"User"
  },
  product:{
    type: mongo.Schema.Types.ObjectId,
    ref:"Product"
  },
  rating:{
    type:Number,
    min:1,
    max:5
  },
  comment:String
}, {
    timestamps:true
});

const review = mongo.model("review", reviewSchema);

module.exports = review;