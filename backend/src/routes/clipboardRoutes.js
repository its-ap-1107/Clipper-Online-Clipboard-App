const express = require("express");
const clipboardController = require("../controllers/clipboardController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

// Middleware to parse auth token if it exists (but not strictly require it)
router.post("/", authenticateUser, clipboardController.createClip);
router.get("/:code", clipboardController.getClip);

module.exports = router;
