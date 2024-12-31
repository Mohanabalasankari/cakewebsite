const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String, // Path to the uploaded image
});

module.exports = mongoose.model('Product', productSchema);
