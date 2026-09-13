const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

// Your existing 3 products
const products = [
  {
    name: "Classic Cotton Shirt",
    description: "Comfortable cotton shirt for everyday wear.",
    brand: "VC Fashion",
    rating: 4.5,
    reviews: 120,
    badge: "Best Seller",
    store: "clothing",
    category: "Shirts",
    retailPrice: 999,
    wholesalePrice: 799,
    resellerPrice: 699,
    stock: 50,
    images: [],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Blue"],
    sku: "VC-CLO-001",
  },

  {
    name: "Bike Brake Pad",
    description: "High-quality replacement brake pad.",
    brand: "VC Auto",
    rating: 4.5,
    reviews: 120,
    badge: "Best Seller",
    store: "bike-parts",
    category: "Brake Parts",
    retailPrice: 450,
    wholesalePrice: 350,
    resellerPrice: 300,
    stock: 100,
    images: [],
    sizes: [],
    colors: [],
    bikeBrand: "Honda",
    compatible: ["Activa", "Shine"],
    sku: "VC-BIKE-001",
  },

  {
    name: "Smartphone Pro",
    description: "Latest smartphone with powerful performance.",
    brand: "VC Mobile",
    rating: 4.5,
    reviews: 120,
    badge: "Best Seller",
    store: "mobile-store",
    category: "Smartphones",
    retailPrice: 19999,
    wholesalePrice: 18500,
    resellerPrice: 17800,
    stock: 25,
    images: [],
    sizes: [],
    colors: ["Black", "Blue"],
    sku: "VC-MOB-001",
  },
];

// Generate dummy products
const dummyProducts = [];

for (let i = 1; i <= 60; i++) {
  const storeNumber = i % 3;

  let store;
  let category;
  let brand;
  let name;
  let sku;

  if (storeNumber === 0) {
    store = "clothing";
    category = i % 2 === 0 ? "Shirts" : "T-Shirts";
    brand = "VC Fashion";
    name = `Test Clothing Product ${i}`;
    sku = `TEST-CLO-${String(i).padStart(3, "0")}`;
  } else if (storeNumber === 1) {
    store = "bike-parts";
    category = i % 2 === 0 ? "Brake Parts" : "Engine Parts";
    brand = "VC Auto";
    name = `Test Bike Part ${i}`;
    sku = `TEST-BIKE-${String(i).padStart(3, "0")}`;
  } else {
    store = "mobile-store";
    category = i % 2 === 0 ? "Smartphones" : "Accessories";
    brand = "VC Mobile";
    name = `Test Mobile Product ${i}`;
    sku = `TEST-MOB-${String(i).padStart(3, "0")}`;
  }

  dummyProducts.push({
    name,
    description: `This is a dummy product created for pagination testing - Product ${i}.`,
    brand,
    rating: Number((3.5 + (i % 15) / 10).toFixed(1)),
    reviews: 10 + i * 3,
    badge: i % 5 === 0 ? "Popular" : null,

    store,
    category,

    retailPrice: 500 + i * 150,
    wholesalePrice: 400 + i * 120,
    resellerPrice: 350 + i * 100,

    stock: 20 + i,

    images: [],
    sizes: store === "clothing" ? ["S", "M", "L", "XL"] : [],
    colors: store === "clothing" ? ["Black", "White", "Blue"] : [],

    bikeBrand: store === "bike-parts" ? "Honda" : "",
    compatible:
      store === "bike-parts" ? ["Activa", "Shine", "Splendor"] : [],

    sku,
    isActive: true,
  });
}

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected for seeding ✅");

    // IMPORTANT:
    // We are NOT deleting existing products.
    // Only insert dummy products that don't already exist.

    const existingSkus = await Product.find(
      {
        sku: {
          $in: dummyProducts.map((p) => p.sku),
        },
      },
      { sku: 1 }
    );

    const existingSkuSet = new Set(
      existingSkus.map((product) => product.sku)
    );

    const productsToInsert = dummyProducts.filter(
      (product) => !existingSkuSet.has(product.sku)
    );

    if (productsToInsert.length > 0) {
      await Product.insertMany(productsToInsert);
    }

    console.log(
      `${productsToInsert.length} dummy products inserted successfully ✅`
    );

    const totalProducts = await Product.countDocuments();

    console.log(`Total products in database: ${totalProducts} 📦`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed ❌");
    console.error(error.message);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedProducts();