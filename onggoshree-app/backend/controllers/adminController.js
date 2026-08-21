const Order = require("../models/Order");

const VALID_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

// GET /api/admin/orders
const getAllOrders = async (req, res) => {
  try {
    // populate("user", "name email") replaces the raw user ObjectId with
    // the actual name and email from the User collection — without this,
    // an admin would only see a meaningless ID string per order.
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// PATCH /api/admin/orders/:id
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: "Failed to update order", error: error.message });
  }
};

// DELETE /api/admin/orders/:id
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error: error.message });
  }
};

module.exports = { getAllOrders, updateOrderStatus, deleteOrder };