const express = require("express");
const router = express.Router();
const Question = require("../model/question.model"); // Import Question model
const User = require("../model/user.model"); // Import User model
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateUser = require('../middleware/authenticateuser');
const validateId = require("../middleware/validateId");
// Helper function to get the user if logged in

const authenticate = (req) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) return null; // No user (anonymous)

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // Return user object
  } catch (error) {
    return null; // Invalid or no token (anonymous)
  }
};

const toggleLike = (likesArray, userId) => {
  const index = likesArray.indexOf(userId);
  if (index === -1) {
    likesArray.push(userId);
  } else {
    likesArray.splice(index, 1);
  }
};

/** ✅ Create a new question (Anonymous or Authenticated) */
router.post("/",async (req, res) => {
  try {
    const { text, category } = req.body;

    // Validate input
    if (!text?.trim()) {
      return res.status(400).json({ error: "Question text is required." });
    }
    if (!category?.trim()) {
      return res.status(400).json({ error: "Category is required." });
    }

    const user = authenticate(req)
    // Create new question
    const question = new Question({
      text,
      user: user?._id || null,
      isAnonymous: !user, 
      category,
    });

    await question.save();

    res.status(201).json({
      message: "Question created successfully!",
      question,
    });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ error: "Failed to create question." });
  }
});


/** Get all questions (with answers and usernames if available) */
router.get("/", async (req, res) => {

    try {
      const questions = await Question.find()
        .populate("user", "username") 
        .populate("answers.user", "username") 
        .sort({ likes: -1, createdAt: -1 });
  
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch questions." });
    }
  });
  
  router.get("/:id", validateId, async (req, res) => {
    try {
      const { id } = req.params;
  
      // Increment view count and fetch question
      const question = await Question.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } }, // Increment the view count
        { new: true }
      )
        .populate("user", "username email")
        .populate({
          path: "answers",
          populate: { path: "user", select: "username" },
        })
        .exec();
  
      if (!question) {
        return res.status(404).json({ error: "Question not found." });
      }
  
      res.status(200).json(question);
    } catch (error) {
      console.error("Error fetching question by ID:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
);
  
// Toggle like for a question
router.post("/question/:id/like", authenticateUser,validateId, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  console.log(userId)
  try {
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    toggleLike(question.likes, userId);
    await question.save();

    res.status(200).json({ message: "Like toggled", likes: question.likes.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}
);
  
/** Add an answer to a question (Anonymous or Authenticated) */
router.post("/:questionId/answer", validateId,async (req, res) => {
  try {
    const { text } = req.body;
    if (!text.trim()) return res.status(400).json({ error: "Answer text is required." });

    const question = await Question.findById(req.params.questionId);
    if (!question) return res.status(404).json({ error: "Question not found." });

    const userId = authenticateUser(req);
    const answer = {
      text,
      user: userId || null,
    };

    question.answers.push(answer);
    await question.save();

    res.json({ message: "Answer added successfully!", question });
  } catch (error) {
    res.status(500).json({ error: "Failed to add answer." });
  }
});

router.post('/:questionId/answer/:answerId/like', authenticateUser,validateId, async (req, res) => {
  const { questionId, answerId } = req.params;
  const userId = req.user.id;

  try {
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const answer = question.answers.id(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    toggleLike(answer.likes, userId);
    await question.save();

    res.status(200).json({ message: "Like toggled", likes: answer.likes.length });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error", error: err.message });
  }
}
);
module.exports = router;
