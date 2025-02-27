const express = require("express");
const upload = require("../middleware/upload");
const Post = require("../model/postModel");
const router = express.Router();

const {isAdmin} = require('../middleware/AdminAuth');
const authenticateUser = require("../middleware/authenticateuser");

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
        const posts = await Post.find().populate("author", "username").sort({ createdAt: -1 });
        if(posts){
          res.status(200).json(posts);
        }else{
          return res.status(404).json({error:"No posts for now"})
        }
        
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

//only 5 recent posts
router.get("/posts/recent", async (req, res) => {
  try {
      const posts = await Post.find()
          .populate("author", "username")
          .sort({ createdAt: -1 }) // Sort by newest first
          .limit(5); // Limit to 5 posts

      if (posts.length > 0) {
          res.status(200).json(posts);
      } else {
          return res.status(404).json({ error: "No posts for now" });
      }
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
  }
});
//10 posts
router.get("/posts/ten", async (req, res) => {
  try {
      const posts = await Post.find()
          .populate("author", "username")
          .sort({ createdAt: -1 }) // Sort by newest first
          .limit(10); // Limit to 5 posts

      if (posts.length > 0) {
          res.status(200).json(posts);
      } else {
          return res.status(404).json({ error: "No posts for now" });
      }
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
  }
});

//search

router.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Search query is required" });

  try {
      const posts = await Post.find({
          title: { $regex: query, $options: "i" } // Case-insensitive search
      }).populate("author", "username");

      res.status(200).json(posts);
  } catch (error) {
      res.status(500).json({ error: "Failed to search posts." });
  }
});


//popular posts
router.get("/popular", async (req, res) => {
  try {
      const popularPosts = await Post.find()
          .sort({ likes: -1, commentsCount: -1 }) // Sort by likes & comments
          .limit(10) 
          .populate("author", "username");

      res.status(200).json(popularPosts);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch popular posts." });
  }
});
//only 3 recent posts
router.get("/threeposts", async (req, res) => {
  try {
      const posts = await Post.find()
          .populate("author", "username")
          .sort({ createdAt: -1 }) // Sort by newest first
          .limit(3); 

      if (posts.length > 0) {
          res.status(200).json(posts);
      } else {
          return res.status(404).json({ error: "No posts for now" });
      }
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.get("/count/all", async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments({});
    res.status(200).json({ totalPosts });
  } catch (error) {
    res.status(500).json({ error: "Failed to count posts", details: error.message });
  }
});


// Get total number of likes across all posts
router.get("/total-likes", async (req, res) => {
  try {
    const totalLikes = await Post.aggregate([
      { $project: { likeCount: { $size: "$likes" } } }, // Count likes per post
      { $group: { _id: null, total: { $sum: "$likeCount" } } }, // Sum all likes
    ]);

    res.status(200).json({ totalLikes: totalLikes.length ? totalLikes[0].total : 0 });
  } catch (error) {
    console.error("Error counting total likes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/views/count", async (req, res) => {
  try {
    const totalViews = await Post.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    res.json({ totalViews: totalViews[0]?.totalViews || 0 });
  } catch (error) {
    res.status(500).json({ error: "Failed to count total views." });
  }
});

// Increment view count when a post is viewed
router.get("/:id/view", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }, // Increment view count
      { new: true }
    );
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.status(200).json({ views: post.views });
  } catch (error) {
    console.error("Error incrementing views:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id/like", authenticateUser, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.user.id;

    if (post.likes.includes(userId)) {
      // If user already liked, remove like (Unlike)
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      await post.save();
      return res.status(200).json({ error: "Post unliked", likes: post.likes.length });
    } else {
      // Add like
      post.likes.push(userId);
      await post.save();
      return res.status(200).json({ error: "Post liked", likes: post.likes.length });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to like/unlike post" });
  }
});

/// Get a single post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username");

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.status(200).json({ 
      ...post.toObject(), 
      likes: post.likes || [] // Ensure likes is always an array
    });
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
// Update an existing post
router.put("/update/:id", authenticateUser,isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, content, summary } = req.body;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update fields
    post.title = title || post.title;
    post.content = content || post.content;
    post.summary = summary || post.summary;

    // Check if there's a new image
    if (req.file) {
      post.image = req.file.filename;
    }

    // Save updated post
    await post.save();
    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
});

// Delete a post
router.delete("/delete/:id", authenticateUser, isAdmin, async (req, res) => {
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