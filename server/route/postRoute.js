const express = require("express");
const multer = require("multer");
const Post = require("../model/postModel");
const router = express.Router();

const {isAdmin} = require('../middleware/AdminAuth');
const authenticateUser = require("../middleware/authenticateuser");

// Multer Setup for Image Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store images in 'uploads/' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Create New Post
router.post("/posts",authenticateUser,isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, summary, content, author } = req.body;
    const image = req.file ? req.file.filename : null;

    // Validation
    if (!title || !summary || !content || !author) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Save to DB
    const newPost = new Post({
      title,
      summary,
      content,
      author,
      image,
    });
    if(newPost){
        await newPost.save();
        res.status(201).json({ message: "Post created successfully!", post: newPost });
    }else{
        res.status(400).json({error:"Posting is failed, Try again."})
    }
    
  } catch (error) {
    res.status(500).json({ error: "Failed to create post." });
  }
});

// Get all posts
router.get("/posts", async (req, res) => {
    try {
        const posts = await Post.find().populate("author", "username");
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

/// Get a single post by ID
router.get("/:id", async (req, res) => {
  try {
      const post = await Post.findById(req.params.id).populate("author", "username");
      if (!post) return res.status(404).json({ error: "Post not found" });

      res.status(200).json(post);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch post" });
  }
});

// Update a post
router.put("/:id", authenticateUser,isAdmin, upload.single("image"), async (req, res) => {
  try {
      const { title, content, summary } = req.body;
      const post = await Post.findById(req.params.id);

      if (!post) return res.status(404).json({ error: "Post not found" });

      if (post.author.toString() !== req.user.id) {
          return res.status(403).json({ error: "Unauthorized to update this post" });
      }

      post.title = title;
      post.content = content;
      post.summary = summary;
      if (req.file) post.image = req.file.buffer.toString("base64");

      await post.save();
      res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
      res.status(500).json({ error: "Failed to update post" });
  }
});

// Delete a post
router.delete("/:id", authenticateUser, isAdmin, async (req, res) => {
  try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      if (post.author.toString() !== req.user.id) {
          return res.status(403).json({ error: "Unauthorized to delete this post" });
      }

      await post.deleteOne();
      res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
      res.status(500).json({ error: "Failed to delete post" });
  }
});

module.exports = router;