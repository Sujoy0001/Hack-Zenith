const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  place: { type: String, required: true },
  area: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  photoURL: String,
  phone: String,
  address: String,
});

const PostSchema = new mongoose.Schema({
  types: {
    type: String,
    enum: ["lost", "found"],
    required: true,
  },
  title: { type: String, required: true },
  user: { type: UserSchema, required: true },
  description: { type: String, required: true },
  images: { type: [String], default: [] },
  location: { type: LocationSchema, required: true },
  tags: { type: [String], default: [] },
  created_at: { type: Date, default: Date.now },
  is_solved: { type: Boolean, default: false },
});

module.exports = mongoose.model("Post", PostSchema);
