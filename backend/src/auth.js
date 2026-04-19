import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/user.js";

const router = express.Router();

const ensureDbConnected = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message:
        "Database is not connected. Please verify MONGODB_URI and Atlas credentials.",
    });
  }
  next();
};

// ============================================
// REGISTER ROUTE: Create a new user account
// ============================================
// POST /api/auth/register
// Body: { name, email, password }
router.post("/register", ensureDbConnected, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✓ VALIDATION 1: Check all required fields exist
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    // ✓ VALIDATION 2: Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Email already registered. Please login or use a different email.",
      });
    }

    // ✓ VALIDATION 3: Password strength (simple: 6+ characters)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // ✓ CREATE USER
    // New User instance (password will be hashed by pre-save middleware)
    const user = new User({
      name,
      email,
      password, // Not plaintext - middleware will hash it
    });

    // Save to MongoDB
    // Pre-save middleware automatically hashes password
    await user.save();

    // ✓ SUCCESS: Send response (don't send password)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
});

// ============================================
// LOGIN ROUTE: Authenticate user and return JWT
// ============================================
// POST /api/auth/login
// Body: { email, password }
router.post("/login", ensureDbConnected, async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✓ VALIDATION 1: Check both fields provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // ✓ VALIDATION 2: Find user by email
    // .select("+password") includes password (normally excluded)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ✓ VALIDATION 3: Verify password
    // comparePassword uses bcrypt.compare to check
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ✓ CREATE JWT TOKEN
    // Token contains user ID and expires in 24 hours
    const token = jwt.sign(
      { userId: user._id }, // Payload (what's inside the token)
      process.env.JWT_SECRET, // Secret key (from .env)
      { expiresIn: "24h" }, // Token expires after 24 hours
    );

    // ✓ SUCCESS: Send token and user data
    res.status(200).json({
      success: true,
      message: "Login successful",
      token, // Frontend stores this
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
});

export default router;
