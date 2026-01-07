const express = require("express");
const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/upload");

const router = express.Router();

/**
 * CREATE POST
 */
router.post(
  "/create",
  upload.array("images", 5),
  async (req, res) => {
    try {
      const {
        types,
        title,
        description,
        tags,
        place,
        area,
        user,
      } = req.body;

      // Upload images to Cloudinary
      const imageUrls = [];
      for (const file of req.files || []) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "lost_found",
        });
        imageUrls.push(result.secure_url);
      }

      const post = new Post({
        types,
        title,
        description,
        tags: tags ? JSON.parse(tags) : [],
        images: imageUrls,
        location: {
          place,
          area,
        },
        user: JSON.parse(user),
      });

      await post.save();

      res.status(201).json({
        message: "Post created successfully",
        post,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create post" });
    }
  }
);

module.exports = router;
