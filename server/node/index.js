require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const postRoutes = require("./routes/post.routes");

const app = express();

/* ---------- Database ---------- */
connectDB();

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ---------- Routes ---------- */
app.use("/api/posts", postRoutes);

/* ---------- Health Check ---------- */
app.get("/", (req, res) => {
  res.json({
    message: "Post API running",
    time: new Date(),
  });
});

/* ---------- Server ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
