const express = require("express");
const router = express.Router();
const Comment = require("../model/commentModel"); // Import the Comment model
const Post = require('../model/postModel')
const authenticateUser = require('../middleware/authenticateuser')

// Get total number of comments
router.get("/count", async (req, res) => {
    try {
        const count = await Comment.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
});

//like a comment
router.put("/:id/like", authenticateUser, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ error: "Comment not found" });

        const userId = req.user.id;

        if (comment.likes.includes(userId)) {
            // Unlike comment
            comment.likes = comment.likes.filter((id) => id.toString() !== userId.toString());
            await comment.save();
            return res.status(200).json({ message: "Comment unliked", likes: comment.likes });
        } else {
            // Like comment
            comment.likes.push(userId);
            await comment.save();
            return res.status(200).json({ message: "Comment liked", likes: comment.likes });
        }
    } catch (error) {
        console.error("Error liking comment:", error);
        res.status(500).json({ error: "Failed to like/unlike comment" });
    }
});
// Get all comments across all posts, including replies and post title
router.get("/all", async (req, res) => {
    try {
        const comments = await Comment.find({})
            .populate("user", "username")
            .populate("post", "title")
            .populate({
                path: "replies",
                populate: { path: "user", select: "username" },
            })
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Add a new comment
router.post("/", authenticateUser, async (req, res) => {
    try {
        const { postId, content } = req.body;
        const userId = req.user.id;

        if (!postId || !content.trim()) {
            return res.status(400).json({ error: "Post ID and content are required." });
        }

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found." });
        }

        // Create and save the comment
        const comment = new Comment({
            post: postId,
            user: userId,
            content,
        });
        await comment.save();

        // Populate user details for response
        await comment.populate("user", "username");

        res.status(201).json(comment);
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});


// Reply to a comment
router.post("/reply", authenticateUser, async (req, res) => {
    try {
        const { postId, content, parentComment } = req.body;
        const userId = req.user.id; // Extracted from token

        if (!postId || !content.trim() || !parentComment) {
            return res.status(400).json({ error: "Post ID, content, and parent comment ID are required." });
        }

        // Check if the parent comment exists
        const parent = await Comment.findById(parentComment);
        if (!parent) {
            return res.status(404).json({ error: "Parent comment not found." });
        }

        // Create the reply
        const reply = new Comment({
            post: postId,
            user: userId,
            content,
            parentComment,
        });

        await reply.save();

        // Add the reply to the parent comment's replies array
        parent.replies.push(reply._id);
        await parent.save();

        // Populate user details in response
        await reply.populate("user", "username");

        res.status(201).json(reply);
    } catch (error) {
        console.error("Error adding reply:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});


// Get all comments for a post
router.get("/:postId", async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId, parentComment: null })
            .populate("user", "username")
            .populate({
                path: "replies",
                populate: { path: "user", select: "username" },
            })
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
