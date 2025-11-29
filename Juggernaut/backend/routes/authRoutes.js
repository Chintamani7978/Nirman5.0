const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// SECRET KEY (In production, put this in .env)
const JWT_SECRET = process.env.JWT_SECRET || "agri_sentry_secret_key_123";

// --- 1. REGISTER (Sign Up) ---
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // 1. Check if user already exists
    // We check both email and phone to prevent duplicates
    const existingUser = await User.findOne({
      $or: [
        { email: email || "placeholder_non_existent_email" }, 
        { phone: phone || "placeholder_non_existent_phone" }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ message: "User with this email or phone already exists." });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create new user
    const newUser = new User({
      name,
      email: email || undefined, // Store undefined if empty string
      phone: phone || undefined,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    // 4. Return success (excluding password)
    res.status(201).json({
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      phone: savedUser.phone,
      token: generateToken(savedUser._id)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error during Signup" });
  }
});

// --- 2. LOGIN (Sign In) ---
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email OR phone

    // 1. Find user by Email OR Phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // 3. Return User Info
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error during Login" });
  }
});

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

module.exports = router;