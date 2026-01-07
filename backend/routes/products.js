// backend/routes/products.js
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchUser");
const isAdmin = require("../middleware/isAdmin");
const Product = require("../models/Products");
const sharp = require("sharp");

const multer = require("multer"); // 9 to 27 is added
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Multer storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// Route: Add a product (Admin) -> POST /api/products/addproduct
router.post(
  "/addproduct",
  fetchUser,
  isAdmin,
  upload.single("image"),
  [
    body("name", "Product name is required").isLength({ min: 2 }),
    body("price", "Price must be a number").isNumeric(),
    body("stock", "Stock must be a number").isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { name, description, price, stock, category } = req.body;

      let image = null;
      if (req.file) {
        const uploadsDir = path.join(__dirname, "..", "uploads");

        // ensure uploads directory exists
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // original file path from multer
        const inputPath = req.file.path;

        // new optimized file path
        const outputFilename = `resized-${Date.now()}-${req.file.originalname}`;
        const outputPath = path.join(uploadsDir, outputFilename);

        // resize + compress
        await sharp(inputPath)
          .resize(300, 300, { fit: "cover" }) // 300x300, crops to square
          .jpeg({ quality: 80 })
          .toFile(outputPath);

        // remove original unoptimized file
        fs.unlinkSync(inputPath);

        image = `/uploads/${outputFilename}`;
      }

      const product = new Product({
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        image,
        addedBy: req.user.id,
      });

      const saved = await product.save();
      res.json(saved);
    } catch (err) {
      console.error("addproduct error:", err);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Get all products (public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ date: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Update product (Admin) -> PUT /api/products/:id
router.put(
  "/:id",
  fetchUser,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    // added isAdmin after fetchUser,
    try {
      const { name, description, price, stock, category } = req.body; // previously line 93 is before try block
      const newProduct = {};
      if (name) newProduct.name = name;
      if (description) newProduct.description = description;
      if (price !== undefined) newProduct.price = Number(price); // 97 and 98 are updated
      if (stock !== undefined) newProduct.stock = Number(stock);
      if (category) newProduct.category = category;
      if (req.file) newProduct.image = `/uploads/${req.file.filename}`; // 100 is added

      let product = await Product.findById(req.params.id);
      if (!product) return res.status(404).send("Product not found");

      product = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: newProduct },
        { new: true }
      );
      res.json(product);
    } catch (err) {
      console.error("update product error:", err);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Delete product (Admin)
router.delete("/:id", fetchUser, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");

    // optionally remove file from disk                                                                               //  119 to 123 is optional
    if (product.image && product.image.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "..", product.image);
      fs.unlink(filePath, (e) => {
        if (e) console.warn("unlink error:", e.message);
      });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: "Product has been deleted", product });
  } catch (err) {
    console.error("delete product error:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
