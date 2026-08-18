const Order = require("../models/Order");
const Product = require("../models/Product");

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { items, customerName, phone, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cannot place an order with no items" });
    }

    // Re-fetch each product from the DB to confirm real prices and stock —
    // never trust prices sent directly from the client, they could be tampered with.
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        qty: item.qty,
      });
      subtotal += product.price * item.qty;

      // Reduce stock now that we've confirmed the order is valid
      product.stock -= item.qty;
      await product.save();
    }

    const deliveryFee = 60;
    const total = subtotal + deliveryFee;

    const order = await Order.create({
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      customerName,
      phone,
      address,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: "Failed to create order", error: error.message });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
};

module.exports = { createOrder, getOrderById };