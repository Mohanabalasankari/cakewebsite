const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // Add jwt for token generation


router.post('/signup', async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  // Validate required fields
  if (!name || !email || !password || !phone || !address) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,   // Save phone number
      address,       // Save address
      otp,           // Save OTP
      otpExpires,    // Save OTP expiration time
    });

    await newUser.save();

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It expires in 15 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Signup successful! Please check your email for OTP.' });
  } catch (error) {
    console.error('Signup error:', error); // Detailed logging
    res.status(500).json({ message: 'Signup failed. Please try again.' });
  }
});

// Route for verifying OTP
router.post('/verify', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    // Check if OTP is expired
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired.' });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = null; // Clear OTP after verification
    user.otpExpires = null; // Clear OTP expiration time
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully!' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    console.log('User found:', user);
    console.log('Password match:', isMatch);
    const payload = { id: user.id };


    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn : '365d'});
    console.log('JWT Secret:', process.env.JWT_SECRET);

    

    
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error); // Detailed logging
    res.status(500).json({ message: 'Internal server error.' });
  }
});

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

// Admin login route
router.post("/login1", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    return res.json({ success: true });
  } else {
    return res.json({ success: false });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Get all users
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password -otp -otpExpires"); // Exclude sensitive fields
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized" });
  }
});








module.exports = router;
