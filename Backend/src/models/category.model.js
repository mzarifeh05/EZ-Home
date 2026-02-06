const mongo = require('mongoose');
const CategorySchema = new mongo.Schema({
    name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
    image: {
    type: String
  }
}, {
    timestamps: true
});

const Category = mongo.model("Category", CategorySchema);

module.exports = Category;