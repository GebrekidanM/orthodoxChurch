const router = require('express').Router();
const About = require('../model/layoutModel');

// 📌 Save or Update "About" Content (POST)
router.post('/about', async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ error: "Content is required" });

        // Check if content already exists
        const existingAbout = await About.findOne();
        if (existingAbout) {
            const updatedAbout = await About.findOneAndUpdate({}, { content }, { new: true, upsert: true });
            return res.json({ message: "Content updated successfully", data: updatedAbout });
        }

        // If no existing content, create a new entry
        const newAbout = new About({ content });
        await newAbout.save();
        res.status(201).json({ message: "Content added successfully", data: newAbout });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// 📌 Get "About" Content (GET)
router.get('/about', async (req, res) => {
    try {
        const aboutContent = await About.findOne();
        if (!aboutContent) {
            return res.status(404).json({ error: "No content found" });
        }
        res.json(aboutContent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
