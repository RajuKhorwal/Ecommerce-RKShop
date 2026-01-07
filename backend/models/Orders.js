// backend/models/Orders.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "product" }, // keep ref
        quantity: { type: Number, required: true },

        // 🔑 Snapshot fields (so order survives even if product is deleted)
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String }, // store image path
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true } // ✅ adds createdAt and updatedAt automatically
);

module.exports = mongoose.model("order", OrderSchema);
