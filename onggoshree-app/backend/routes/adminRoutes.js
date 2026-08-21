const express = require("express");
const router = express.Router();
const { getAllOrders, updateOrderStatus, deleteOrder } = require("../controllers/adminController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

router.get("/orders", protect, adminOnly, getAllOrders);
router.patch("/orders/:id", protect, adminOnly, updateOrderStatus);
router.delete("/orders/:id", protect, adminOnly, deleteOrder);

module.exports = router;