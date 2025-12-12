const express = require("express");
const router = express.Router();
const { authenticateToken, isAdmin } = require("../middleware/auth");
const { createEvent, getEvents, updateEvent, deleteEvent, approveEvent } = require("../controllers/eventController");

// CRUD
router.post("/", authenticateToken, createEvent);
router.get("/", getEvents);
router.patch("/:id", authenticateToken, updateEvent);
router.delete("/:id", authenticateToken, deleteEvent);

// Admin
router.patch("/:id/approve", authenticateToken, isAdmin, approveEvent);

module.exports = router;
