const express = require("express");
const router = express.Router();
const Question = require("../model/question.model"); // Import Question model
const User = require("../model/user.model"); // Import User model
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Helper function to get the user if logged in
const getUserFromToken = (req) => {
  const token = req.cookies.token;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId; // Return user ID if authenticated
  } catch (error) {
    return null; // Invalid token
  }
};

/** ✅ Create a new question (Anonymous or Authenticated) */
router.post("/", async (req, res) => {
  try {
    const { text, isAnonymous } = req.body;
    if (!text.trim()) return res.status(400).json({ error: "Question text is required." });

    const userId = getUserFromToken(req);
    const question = new Question({
      text,
      user: isAnonymous || !userId ? null : userId, // Store user ID if logged in
      isAnonymous: isAnonymous || !userId,
    });

    await question.save();
    res.status(201).json({ message: "Question created successfully!", question });
  } catch (error) {
    res.status(500).json({ error: "Failed to create question." });
  }
});

/** ✅ Get all questions (with answers and usernames if available) */
router.get("/", async (req, res) => {
    try {
      const questions = await Question.find()
        .populate("user", "username") // Populate the username of the question owner
        .populate("answers.user", "username") // Populate usernames for answers
        .sort({ likes: -1, createdAt: -1 }); // Sort by likes and latest first
  
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch questions." });
    }
  });
  
// Toggle like for a question
router.post("/question/:id/like", async (req, res) => {
    try {
      const { userId } = req.body; // Get user ID from request
      const question = await Question.findById(req.params.id);
  
      if (!question) return res.status(404).json({ message: "Question not found" });
  
      // Check if user already liked the question
      const userLiked = question.likedUsers?.includes(userId);
  
      if (userLiked) {
        // Unlike: Remove user from likedUsers and decrement like count
        question.likes -= 1;
        question.likedUsers = question.likedUsers.filter((id) => id !== userId);
      } else {
        // Like: Add user to likedUsers and increment like count
        question.likes += 1;
        question.likedUsers.push(userId);
      }
  
      await question.save();
      res.json({ likes: question.likes });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
/** ✅ Add an answer to a question (Anonymous or Authenticated) */
router.post("/:questionId/answer", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text.trim()) return res.status(400).json({ error: "Answer text is required." });

    const question = await Question.findById(req.params.questionId);
    if (!question) return res.status(404).json({ error: "Question not found." });

    const userId = getUserFromToken(req);
    const answer = {
      text,
      user: userId || null, // Store user ID if logged in, otherwise null
    };

    question.answers.push(answer);
    await question.save();

    res.json({ message: "Answer added successfully!", question });
  } catch (error) {
    res.status(500).json({ error: "Failed to add answer." });
  }
});

module.exports = router;
