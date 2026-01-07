// backend/models/Products.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  category: { type: String, default: "" },
  stock: { type: Number, required: true, default: 0 },
  image: { type: String, default: null }, // store path like /uploads/filename.jpg
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('product', ProductSchema);
