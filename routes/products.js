const express = require('express');
const multer = require('multer');
const Product = require('../models/Product'); // Assuming you have a Product model
const router = express.Router();
const path = require('path');

// Multer setup for image uploading
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // The folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Give the file a unique name
  },
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from MongoDB
    res.status(200).json(products); // Send products as JSON
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// POST route for adding a product
router.post('/api/products', upload.single('image'), async (req, res) => {
    const { name, description, price, category } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Save the file URL
  
    const product = new Product({
      name,
      description,
      price,
      category,
      image: imageUrl // Store image URL
    });
  
    try {
      await product.save();
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: 'Error adding product', error: err });
    }
  });

module.exports = router;
