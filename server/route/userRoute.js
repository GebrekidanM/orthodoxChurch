require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../model/user.model')

// Register a new user
router.post("/register", async (req, res) => {
  try {
      const { username, password, email } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ error: "User already exists." });
      }

      // Determine if this is the first user
      const isFirstUser = (await User.countDocuments()) === 0;
      const role = isFirstUser ? "admin" : "user";

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create and save the new user
      const newUser = new User({ username, email, password: hashedPassword, role });
      await newUser.save();

      res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

//login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  try{
        const user = await User.findOne({ email });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid email or password!" });
        }
        
        const token = jwt.sign({ userId: user._id, email: user.email ,username: user.username, role: user.role}, process.env.JWT_SECRET, { expiresIn: "1h" });
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure only in production
            sameSite: "strict",
        });
    
        res.status(200).json({user: { username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: "Login failed!" });
      }
  });

router.post("/logout", (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "Strict" });
    res.status(200).json({ message: "Logout successful" });
});

  
// 🔹 Get Authenticated User
router.get("/me", (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ error: "Unauthorized" });
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.json({ userId: decoded.userId ,username: decoded.username, email: decoded.email, role: decoded.role});
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  });
  
module.exports = router;
