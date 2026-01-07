// backend/routes/cart,js
const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Cart = require("../models/Carts");
const Product = require("../models/Products");

// Route 1: Add item to cart => POST "/api/cart/add" | Login required
router.post("/add", fetchUser, async (req, res) => {
  try {
    const { items } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        user: req.user.id,
        items
      });
    } else {
      // Update existing cart
      items.forEach(newItem => {
        const index = cart.items.findIndex(
          item => item.product.toString() === newItem.product
        );
        if (index > -1) {
          cart.items[index].quantity += newItem.quantity;
        } else {
          cart.items.push(newItem);
        }
      });
    }

    const savedCart = await cart.save();
    res.json(savedCart);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 2: Get logged-in user's cart => GET "/api/cart" | Login required
router.get("/", fetchUser, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
      "name price image"
    );

    if (cart) {
      // 🔑 Remove items where product was deleted
      cart.items = cart.items.filter((i) => i.product !== null);
      await cart.save();
    }

    res.json(cart || { items: [] });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// Route 3: Update quantity => PUT "/api/cart/update/:productId" | Login required
router.put("/update/:productId", fetchUser, async (req, res) => {
  try {
    const { quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).send("Cart not found");

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === req.params.productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      return res.status(404).send("Product not in cart");
    }

    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 4: Remove item => DELETE "/api/cart/remove/:productId" | Login required
router.delete("/remove/:productId", fetchUser, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // check if product exists in cart
    const productIndex = cart.items.findIndex(
      (item) => item.product.toString() === req.params.productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // remove the product
    cart.items.splice(productIndex, 1);

    const updatedCart = await cart.save();

    // if cart becomes empty
    if (updatedCart.items.length === 0) {
      return res.json({
        message: "Item removed. Cart is now empty",
        cart: updatedCart
      });
    }

    return res.json({
      message: "Item removed from cart",
      cart: updatedCart
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
