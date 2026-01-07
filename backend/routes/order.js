// backend/routes/order.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const Cart = require("../models/Carts");
const Product = require("../models/Products"); // ✅ Import Product model
const fetchUser = require("../middleware/fetchUser");

const fs = require("fs");
const path = require("path");

// Create an order from cart
router.post("/create", fetchUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    // ✅ Check stock before creating order
    for (const item of cart.items) {
      if (!item.product) continue;

      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          msg: `Not enough stock for "${item.product.name}". Available: ${item.product.stock}, Requested: ${item.quantity}`,
        });
      }
    }

    const orderItems = cart.items
      .filter((i) => i.product) // only valid products
      .map((item) => {
        let newImagePath = null;

        if (item.product.image) {
          if (item.product.image.startsWith("http")) {
            // external image (Unsplash, etc.)
            newImagePath = item.product.image;
          } else {
            // local image in uploads folder
            const fileName = path.basename(item.product.image);
            const sourcePath = path.join(__dirname, "..", "uploads", fileName);
            const destDir = path.join(__dirname, "..", "order_uploads");
            const destPath = path.join(destDir, fileName);

            if (!fs.existsSync(destDir))
              fs.mkdirSync(destDir, { recursive: true });
            if (fs.existsSync(sourcePath) && !fs.existsSync(destPath)) {
              fs.copyFileSync(sourcePath, destPath);
            }

            newImagePath = `${
              process.env.BASE_URL || "http://localhost:5000"
            }/order_uploads/${fileName}`;
          }
        }

        return {
          product: item.product._id,
          quantity: item.quantity,
          name: item.product.name,
          price: item.product.price,
          image: newImagePath,
        };
      });

    if (orderItems.length === 0) {
      return res.status(400).json({ msg: "No valid products in cart" });
    }

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new Order({
      user: req.user.id,
      items: orderItems,
      totalPrice,
    });

    await order.save();

    // ✅ Decrease stock for each product
    for (const item of cart.items) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    // ✅ Clear cart
    cart.items = [];
    await cart.save();

    res.json({ msg: "Order placed successfully", order });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Get all orders of a user
router.get("/myorders", fetchUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .select("items totalPrice createdAt status")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
