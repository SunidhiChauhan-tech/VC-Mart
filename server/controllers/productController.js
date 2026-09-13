const Product = require("../models/Product");

// GET ALL PRODUCTS WITH PAGINATION
// GET ALL PRODUCTS WITH PAGINATION + FILTERING
const getProducts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 12, 1),
      100
    );

    const skip = (page - 1) * limit;

    const filter = {
      isActive: true,
    };

    // Store filter
    if (req.query.store) {
      filter.store = req.query.store;
    }

    // Category filter
    if (req.query.category && req.query.category !== "all") {
      filter.category = req.query.category;
    }

    // Brand filter
    if (req.query.brand && req.query.brand !== "all") {
      filter.brand = req.query.brand;
    }

    // Bike brand filter
    if (
      req.query.bikeBrand &&
      req.query.bikeBrand !== "all"
    ) {
      filter.bikeBrand = req.query.bikeBrand;
    }

    // Stock filter
    if (req.query.inStockOnly === "true") {
      filter.stock = { $gt: 0 };
    }

    // Maximum price filter
    if (req.query.priceMax) {
      filter.retailPrice = {
        $lte: Number(req.query.priceMax),
      };
    }

    // Search filter
    if (req.query.searchTerm) {
      const searchRegex = new RegExp(
        req.query.searchTerm,
        "i"
      );

      filter.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { bikeBrand: searchRegex },
        { sku: searchRegex },
      ];
    }

    // Sorting
    let sort = { createdAt: -1 };

    if (req.query.sort === "priceLow") {
      sort = { retailPrice: 1 };
    }

    if (req.query.sort === "priceHigh") {
      sort = { retailPrice: -1 };
    }

    if (req.query.sort === "rating") {
      sort = { rating: -1 };
    }

    if (req.query.sort === "popular") {
      sort = { reviews: -1 };
    }

    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit),

      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        productsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// GET SINGLE PRODUCT
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};