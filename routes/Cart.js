const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const router = express.Router();

// Add Product to Cart
router.post('/add', async (req, res) => {
  const { userId, productId } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If no cart exists, create a new one
      cart = new Cart({
        userId,
        products: [{ productId, quantity: 1 }],
      });
      await cart.save();
      return res.status(201).json(cart);
    }

    // If cart exists, add the product or update the quantity
    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    
    if (productIndex >= 0) {
      cart.products[productIndex].quantity += 1; // Increase quantity
    } else {
      cart.products.push({ productId, quantity: 1 }); // Add new product
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Cart Items
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('products.productId');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove Product from Cart
router.delete('/remove/:userId/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const productIndex = cart.products.findIndex(p => p.productId.toString() === req.params.productId);

    if (productIndex >= 0) {
      cart.products.splice(productIndex, 1);
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
