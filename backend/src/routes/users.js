const express = require("express");
const router = express.Router();
const { authenticateToken, isAdmin } = require("../middleware/auth");
const { blockUser } = require("../controllers/usersController");

// Admin blokavimas
router.patch("/:id/block", authenticateToken, isAdmin, blockUser);

module.exports = router;
