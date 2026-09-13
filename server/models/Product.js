const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    store: {
      type: String,
      enum: ["clothing", "bike-parts", "mobile-store"],
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    retailPrice: {
      type: Number,
      required: true,
    },

    wholesalePrice: {
      type: Number,
      required: true,
    },

    resellerPrice: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    images: {
      type: [String],
      default: [],
    },

    sizes: {
      type: [String],
      default: [],
    },

    colors: {
      type: [String],
      default: [],
    },

    bikeBrand: {
      type: String,
      default: "",
    },

    compatible: {
      type: [String],
      default: [],
    },

    sku: {
      type: String,
      unique: true,
      required: true,
    },

    brand: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    badge: { type: String, default: null },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);