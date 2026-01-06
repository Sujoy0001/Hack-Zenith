const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const Post = require("../models/Post");

/* ---------- Create Post ---------- */
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const { user, type, title, description, location, tags } = req.body;

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "posts" }
        );
        imageUrls.push(result.secure_url);
      }
    }

    const post = await Post.create({
      user: user ? JSON.parse(user) : null,
      type,
      title,
      description,
      location: location ? JSON.parse(location) : null,
      tags: tags ? JSON.parse(tags) : [],
      images: imageUrls,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ---------- Get All Posts ---------- */
router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ created_at: -1 });
  res.json(posts);
});

/* ---------- Get Single Post ---------- */
router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

module.exports = router;
