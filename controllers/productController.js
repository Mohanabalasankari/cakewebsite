const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// Fetch all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  const { name, description, price } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const newProduct = new Product({ name, description, price, image: imagePath });
    await newProduct.save();
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
};

// Remove a product
exports.removeProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findByIdAndDelete(productId);
    if (product && product.image) {
      fs.unlinkSync(path.join(__dirname, '../' + product.image)); // Delete the image file
    }
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
