const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, default: null },
    email: { type: String, default: null },
    photo: { type: String, default: null },
  },
  { _id: false }
);

const LocationSchema = new mongoose.Schema(
  {
    area: { type: String, default: null },
    place: { type: String, default: null },
  },
  { _id: false }
);

const PostSchema = new mongoose.Schema({
  user: { type: UserSchema, default: null },
  type: { type: String, default: null },
  title: { type: String, default: null },
  description: { type: String, default: null },
  location: { type: LocationSchema, default: null },
  tags: { type: [String], default: [] },
  images: { type: [String], default: [] },
  upvotes: { type: Number, default: 0 },
  is_solved: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
