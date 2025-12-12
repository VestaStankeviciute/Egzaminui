const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const { rateEvent, getRating } = require("../controllers/ratingController");

// Įvertinti renginį
router.post("/", authenticateToken, rateEvent);

// Bendras reitingas
router.get("/:event_id", getRating);

module.exports = router;
