const express = require("express");
const router = express.Router();
const { getMyWishlist, toggleWishlist } = require("../controllers/wishlistController");
const protect = require("../middleware/authMiddleware");

router.get("/mine", protect, getMyWishlist);
router.post("/toggle", protect, toggleWishlist);

module.exports = router;