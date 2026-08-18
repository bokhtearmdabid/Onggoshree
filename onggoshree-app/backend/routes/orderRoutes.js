const express = require("express");
const router = express.Router();
const { createOrder, getOrderById } = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/:id", getOrderById);

module.exports = router;