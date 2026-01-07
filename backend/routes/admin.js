// backend/routes/admin.js
const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const isAdmin = require("../middleware/isAdmin");
const Product = require("../models/Products");
const Order = require("../models/Orders");
const User = require("../models/Users");

// Get all users (only admin)
router.get("/users", fetchUser, isAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// Get all orders
router.get("/orders", fetchUser, isAdmin, async (req, res) => {
  const orders = await Order.find().populate("user", "name email");
  res.json(orders);
});

// Manage products
router.get("/products", fetchUser, isAdmin, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Backend route (add to your admin routes)
router.put('/orders/:orderId/status', fetchUser, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;
