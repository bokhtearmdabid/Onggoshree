const express = require("express");
const router = express.Router();
const { createOrder, getOrderById, getMyOrders } = require("../controllers/orderController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/mine", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

module.exports = router;