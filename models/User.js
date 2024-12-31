const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,  // Ensure email is unique
    lowercase: true,  // Automatically convert email to lowercase
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'], // Regex for email validation
  },
  phone: {
    type: String,
    required: true,
    unique: true, // Ensure phone number is unique
    match: [/^\d{10}$/, 'Please use a valid 10-digit phone number'], // Basic validation for 10-digit phone number
  },
  address: {
    type: String,
    required: true,  // If you want to make address mandatory
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String, // Store OTP as a string
  },
  otpExpires: {
    type: Date, // Store OTP expiration time
  },
  points: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
