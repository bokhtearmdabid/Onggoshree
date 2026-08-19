const express = require("express");
const router = express.Router();
const { redeemDiscount } = require("../controllers/rewardController");
const protect = require("../middleware/authMiddleware");

router.post("/redeem-discount", protect, redeemDiscount);

module.exports = router;