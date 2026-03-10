const express = require("express");
const clipboardController = require("../controllers/clipboardController");

const router = express.Router();

router.get("/", clipboardController.listEntries);
router.post("/", clipboardController.createEntry);
router.delete("/:id", clipboardController.deleteEntry);

module.exports = router;
