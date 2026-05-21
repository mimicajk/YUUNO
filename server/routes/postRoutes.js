const express = require("express");
const router = express.Router();

const {
    createPost,
    getPosts,
    toggleLike,
} = require("../controllers/postController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createPost);
router.get("/", protect, getPosts);
router.put("/:id/like", protect, toggleLike);

module.exports = router;