import React, { useState,useMemo,useCallback,useEffect,useRef
} from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  registerUser,
  loginUser,
  getCurrentUser,
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getUserStats
} from "./services/api";
import {
  Search, ShoppingCart, Heart, User, Menu, X, Star, ChevronRight, ChevronLeft,
  ChevronDown, Plus, Minus, Truck, ShieldCheck, RotateCcw, TrendingUp,
  LayoutDashboard, Package, Users, ClipboardList, Boxes, Settings, LogOut,
  ArrowRight, Filter, Check, MapPin, Phone, Mail, Globe, Camera, MessageCircle,
  Trash2, AlertCircle, Sparkles, ShieldQuestion
} from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;


/* =========================================================================
   CONFIG LAYER  — src/config/siteConfig.js (would live here in real project)
   ========================================================================= */
const siteConfig = {
  siteName: "VC Mart",
  tagline: "Everything you need. One store.",

  contacts: [
    {
      businessName: "Vinayak Collection",
      phones: ["8684933759", "9625747346"],
    },
    {
      businessName: "Khushi Communication",
      phones: ["8396831521"],
    },
    {
      businessName: "Kinushk Spare Parts",
      phones: ["8259403529"],
    },
  ],

  address:
    "Street No. 12E, Agarshain Sewa Sadan, Gandhi Nagar, Charkhi Dadri, 127306",

  currency: "₹",
};

/* =========================================================================
   HERO OFFER SLIDES — replace / add entries here any time.
   Each slide can use an "image" (shows the photo with a dark overlay + text)
   or omit "image" to show a plain gradient card (like the current 4 defaults).
   ========================================================================= */
const heroOfferSlides = [
  {
    id: "offer-1",
    tag: "Limited time",
    title: "Flat 25% off on Ethnic Wear",
    subtitle: "Shop the festive collection",
    image: "/images/clothing_img.png", // set to null/"" for a plain gradient slide
  },
  {
    id: "offer-2",
    tag: "New arrival",
    title: "Genuine Bike Spare Parts",
    subtitle: "Fast dispatch, trusted brands",
    image: "/images/bike_img.png",
  },
  {
    id: "offer-3",
    tag: "Top deal",
    title: "Latest Smartphones",
    subtitle: "Starting at attractive prices, EMI available",
    image: "/images/mobile_img (2).png",
  },
  {
    id: "offer-4",
    tag: "Free delivery",
    title: "On orders above ₹999",
    subtitle: "Across Charkhi Dadri and nearby areas",
    image: "/images/vcmart_img.png",
  },
];

// Client logo embedded here so this App.jsx can work without requiring a separate logo import.
const BRAND_LOGO = "/images/nlogo.jpeg";
const stores = [
  {
    id: "clothing",
    name: "Clothing",
    businessName: "Vinayak Collection",
    slug: "clothing",
    tagline: "Everyday & festive wear",
    accent: "indigo",
  },
  {
    id: "bike-parts",
    name: "Bike Spare Parts",
    businessName: "Kinushk Spare Parts",
    slug: "bike-parts",
    tagline: "Genuine & compatible parts",
    accent: "teal",
  },
  {
    id: "mobile-store",
    name: "Mobile Store",
    businessName: "Khushi Communications",
    slug: "mobile store",
    tagline: "Latest smartphones & accessories",
    accent: "amber",
  },
];

const roles = [
  { id: "retail", label: "Retail" },
  
];

/* =========================================================================
   MOCK DATA LAYER  — src/data/products.js (swapped for API later)
   ========================================================================= */
const img = (seed, n = 700) => `https://picsum.photos/seed/${seed}/${n}/${n}`;

const clothingProducts = [
  { id: "cl-01", name: "Men's Slim Fit Oxford Shirt", brand: "Threadwork", category: "Shirts", sub: "Formal", sizes: ["S","M","L","XL","XXL"], colors: ["White","Sky Blue","Black"], rating: 4.4, reviews: 212, retailPrice: 1299, wholesalePrice: 890, resellerPrice: 799, discount: 20, stock: 42, sku: "TW-SH-001" },
  { id: "cl-02", name: "Women's Anarkali Kurta Set", brand: "Meraki Ethnic", category: "Ethnic Wear", sub: "Kurta Sets", sizes: ["S","M","L","XL"], colors: ["Maroon","Mustard","Teal"], rating: 4.6, reviews: 389, retailPrice: 2199, wholesalePrice: 1450, resellerPrice: 1290, discount: 25, stock: 18, sku: "MK-KS-014" },
  { id: "cl-03", name: "Unisex Oversized Hoodie", brand: "Streetline Co.", category: "Winterwear", sub: "Hoodies", sizes: ["S","M","L","XL"], colors: ["Charcoal","Olive","Beige"], rating: 4.3, reviews: 156, retailPrice: 1699, wholesalePrice: 1150, resellerPrice: 1020, discount: 15, stock: 65, sku: "SL-HD-007" },
  { id: "cl-04", name: "Men's Straight Fit Denim Jeans", brand: "DenimCraft", category: "Bottoms", sub: "Jeans", sizes: ["28","30","32","34","36"], colors: ["Indigo Blue","Black"], rating: 4.2, reviews: 298, retailPrice: 1599, wholesalePrice: 1080, resellerPrice: 960, discount: 18, stock: 51, sku: "DC-JN-022" },
  { id: "cl-05", name: "Women's Floral Wrap Dress", brand: "Aaranya", category: "Dresses", sub: "Casual", sizes: ["XS","S","M","L"], colors: ["Rose Print","Navy Print"], rating: 4.5, reviews: 174, retailPrice: 1899, wholesalePrice: 1290, resellerPrice: 1150, discount: 22, stock: 29, sku: "AR-DR-011" },
  { id: "cl-06", name: "Men's Cotton Kurta", brand: "Meraki Ethnic", category: "Ethnic Wear", sub: "Kurtas", sizes: ["M","L","XL","XXL"], colors: ["White","Beige","Rust"], rating: 4.1, reviews: 88, retailPrice: 999, wholesalePrice: 680, resellerPrice: 600, discount: 10, stock: 73, sku: "MK-KU-030" },
  { id: "cl-07", name: "Kids Printed T-Shirt (Pack of 3)", brand: "TinyTrail", category: "Kidswear", sub: "T-Shirts", sizes: ["2-3Y","4-5Y","6-7Y","8-9Y"], colors: ["Assorted"], rating: 4.7, reviews: 421, retailPrice: 899, wholesalePrice: 610, resellerPrice: 540, discount: 30, stock: 96, sku: "TT-KT-003" },
  { id: "cl-08", name: "Women's High-Waist Joggers", brand: "Streetline Co.", category: "Activewear", sub: "Joggers", sizes: ["XS","S","M","L","XL"], colors: ["Black","Grey Melange"], rating: 4.4, reviews: 133, retailPrice: 1099, wholesalePrice: 740, resellerPrice: 660, discount: 12, stock: 58, sku: "SL-JG-019" },
  { id: "cl-09", name: "Men's Nehru Jacket", brand: "Meraki Ethnic", category: "Ethnic Wear", sub: "Jackets", sizes: ["M","L","XL","XXL"], colors: ["Maroon","Navy","Black"], rating: 4.5, reviews: 67, retailPrice: 1799, wholesalePrice: 1220, resellerPrice: 1080, discount: 15, stock: 24, sku: "MK-NJ-041" },
  { id: "cl-10", name: "Women's Denim Jacket", brand: "DenimCraft", category: "Winterwear", sub: "Jackets", sizes: ["S","M","L","XL"], colors: ["Light Blue","Black"], rating: 4.3, reviews: 145, retailPrice: 2099, wholesalePrice: 1420, resellerPrice: 1260, discount: 20, stock: 33, sku: "DC-JK-016" },
  { id: "cl-11", name: "Men's Formal Trousers", brand: "Threadwork", category: "Bottoms", sub: "Formal", sizes: ["30","32","34","36","38"], colors: ["Black","Navy","Grey"], rating: 4.0, reviews: 91, retailPrice: 1399, wholesalePrice: 950, resellerPrice: 840, discount: 10, stock: 47, sku: "TW-TR-009" },
  { id: "cl-12", name: "Women's Chiffon Saree", brand: "Aaranya", category: "Ethnic Wear", sub: "Sarees", sizes: ["Free Size"], colors: ["Pink","Green","Sky Blue"], rating: 4.6, reviews: 256, retailPrice: 1599, wholesalePrice: 1080, resellerPrice: 960, discount: 25, stock: 40, sku: "AR-SR-005" },
  { id: "cl-13", name: "Men's Polo T-Shirt", brand: "Streetline Co.", category: "T-Shirts", sub: "Polo", sizes: ["S","M","L","XL","XXL"], colors: ["Navy","White","Maroon","Olive"], rating: 4.2, reviews: 312, retailPrice: 799, wholesalePrice: 540, resellerPrice: 480, discount: 15, stock: 110, sku: "SL-PT-025" },
  { id: "cl-14", name: "Women's Palazzo Set", brand: "Meraki Ethnic", category: "Ethnic Wear", sub: "Sets", sizes: ["S","M","L","XL"], colors: ["Mustard","Teal","Wine"], rating: 4.4, reviews: 198, retailPrice: 1499, wholesalePrice: 1010, resellerPrice: 900, discount: 18, stock: 36, sku: "MK-PL-018" },
  { id: "cl-15", name: "Men's Bomber Jacket", brand: "DenimCraft", category: "Winterwear", sub: "Jackets", sizes: ["M","L","XL"], colors: ["Black","Olive"], rating: 4.3, reviews: 76, retailPrice: 2399, wholesalePrice: 1620, resellerPrice: 1440, discount: 20, stock: 21, sku: "DC-BM-028" },
  { id: "cl-16", name: "Women's Casual Co-ord Set", brand: "Aaranya", category: "Sets", sub: "Co-ords", sizes: ["XS","S","M","L"], colors: ["Beige","Sage Green"], rating: 4.5, reviews: 143, retailPrice: 1799, wholesalePrice: 1220, resellerPrice: 1080, discount: 15, stock: 27, sku: "AR-CO-012" },
  { id: "cl-17", name: "Men's Track Suit", brand: "Streetline Co.", category: "Activewear", sub: "Track Suits", sizes: ["M","L","XL","XXL"], colors: ["Black/Red","Navy/White"], rating: 4.1, reviews: 89, retailPrice: 1699, wholesalePrice: 1150, resellerPrice: 1020, discount: 10, stock: 44, sku: "SL-TS-033" },
  { id: "cl-18", name: "Women's Formal Blazer", brand: "Threadwork", category: "Formal Wear", sub: "Blazers", sizes: ["S","M","L","XL"], colors: ["Black","Grey"], rating: 4.4, reviews: 61, retailPrice: 2299, wholesalePrice: 1560, resellerPrice: 1380, discount: 12, stock: 19, sku: "TW-BL-045" },
  { id: "cl-19", name: "Kids Denim Dungaree", brand: "TinyTrail", category: "Kidswear", sub: "Dungarees", sizes: ["1-2Y","3-4Y","5-6Y"], colors: ["Blue"], rating: 4.6, reviews: 102, retailPrice: 1099, wholesalePrice: 740, resellerPrice: 660, discount: 20, stock: 38, sku: "TT-DG-008" },
  { id: "cl-20", name: "Men's Linen Shirt", brand: "Threadwork", category: "Shirts", sub: "Casual", sizes: ["S","M","L","XL"], colors: ["Beige","White","Light Blue"], rating: 4.3, reviews: 118, retailPrice: 1499, wholesalePrice: 1010, resellerPrice: 900, discount: 15, stock: 55, sku: "TW-LS-052" },
].map(p => ({ ...p, store: "clothing", images: [img(p.sku + "a"), img(p.sku + "b"), img(p.sku + "c")], description: `The ${p.name} from ${p.brand} is crafted for everyday comfort without compromising on style. Made with breathable, durable fabric, tailored to hold shape wash after wash.`, badge: p.discount >= 20 ? "Best Seller" : null }));

const bikeCompatOptions = ["Honda Shine","Honda SP 125","Honda Unicorn","Honda Activa","Hero Splendor Plus","Hero HF Deluxe","Bajaj Pulsar 150","Bajaj Platina","TVS Apache RTR","TVS Jupiter","Yamaha FZ-S","Royal Enfield Classic 350"];

const bikeParts = [
  { id: "bp-01", name: "Front Disc Brake Pad Set", brand: "Bosch Auto", partType: "Brakes", bikeBrand: "Honda", compatible: ["Honda Shine","Honda SP 125","Honda Unicorn"], rating: 4.5, reviews: 342, retailPrice: 549, wholesalePrice: 380, resellerPrice: 340, discount: 15, stock: 120, sku: "BA-BR-101" },
  { id: "bp-02", name: "Chain Sprocket Kit (3-Piece)", brand: "Rolon", partType: "Drive Chain", bikeBrand: "Hero", compatible: ["Hero Splendor Plus","Hero HF Deluxe"], rating: 4.6, reviews: 512, retailPrice: 899, wholesalePrice: 620, resellerPrice: 550, discount: 20, stock: 84, sku: "RL-CH-014" },
  { id: "bp-03", name: "LED Headlight Assembly", brand: "Luminex", partType: "Electricals", bikeBrand: "Bajaj", compatible: ["Bajaj Pulsar 150","Bajaj Platina"], rating: 4.3, reviews: 187, retailPrice: 1299, wholesalePrice: 900, resellerPrice: 800, discount: 10, stock: 46, sku: "LX-HL-022" },
  { id: "bp-04", name: "Air Filter Element", brand: "K&N Compatible", partType: "Engine", bikeBrand: "TVS", compatible: ["TVS Apache RTR","TVS Jupiter"], rating: 4.2, reviews: 265, retailPrice: 399, wholesalePrice: 270, resellerPrice: 240, discount: 12, stock: 210, sku: "KN-AF-005" },
  { id: "bp-05", name: "Rear Shock Absorber (Pair)", brand: "Gabriel", partType: "Suspension", bikeBrand: "Yamaha", compatible: ["Yamaha FZ-S"], rating: 4.4, reviews: 98, retailPrice: 2199, wholesalePrice: 1520, resellerPrice: 1350, discount: 8, stock: 32, sku: "GB-SA-031" },
  { id: "bp-06", name: "Clutch Plate Set", brand: "Sunfast", partType: "Engine", bikeBrand: "Royal Enfield", compatible: ["Royal Enfield Classic 350"], rating: 4.5, reviews: 156, retailPrice: 1599, wholesalePrice: 1100, resellerPrice: 980, discount: 15, stock: 41, sku: "SF-CP-018" },
  { id: "bp-07", name: "Digital Speedometer Console", brand: "Luminex", partType: "Electricals", bikeBrand: "Honda", compatible: ["Honda Unicorn","Honda Shine"], rating: 4.1, reviews: 73, retailPrice: 1899, wholesalePrice: 1310, resellerPrice: 1160, discount: 10, stock: 27, sku: "LX-SP-009" },
  { id: "bp-08", name: "Fuel Tank Cap with Lock", brand: "Rolon", partType: "Body Parts", bikeBrand: "Hero", compatible: ["Hero Splendor Plus"], rating: 4.0, reviews: 44, retailPrice: 449, wholesalePrice: 310, resellerPrice: 275, discount: 5, stock: 68, sku: "RL-FC-027" },
  { id: "bp-09", name: "Engine Oil Filter", brand: "Bosch Auto", partType: "Engine", bikeBrand: "Bajaj", compatible: ["Bajaj Pulsar 150"], rating: 4.6, reviews: 289, retailPrice: 199, wholesalePrice: 135, resellerPrice: 120, discount: 10, stock: 340, sku: "BA-OF-041" },
  { id: "bp-10", name: "Alloy Wheel Set (Front + Rear)", brand: "Gabriel", partType: "Wheels", bikeBrand: "TVS", compatible: ["TVS Apache RTR"], rating: 4.4, reviews: 61, retailPrice: 4599, wholesalePrice: 3200, resellerPrice: 2850, discount: 12, stock: 14, sku: "GB-AW-052" },
  { id: "bp-11", name: "Side Mirror Set (Pair)", brand: "Sunfast", partType: "Body Parts", bikeBrand: "Yamaha", compatible: ["Yamaha FZ-S"], rating: 4.2, reviews: 133, retailPrice: 549, wholesalePrice: 380, resellerPrice: 340, discount: 18, stock: 92, sku: "SF-MR-035" },
  { id: "bp-12", name: "Battery (12V 5Ah, Sealed)", brand: "Exide Compatible", partType: "Electricals", bikeBrand: "Honda", compatible: ["Honda Activa","Honda Shine"], rating: 4.5, reviews: 401, retailPrice: 1699, wholesalePrice: 1180, resellerPrice: 1050, discount: 10, stock: 58, sku: "EX-BT-006" },
  { id: "bp-13", name: "Rear Brake Shoe Set", brand: "Bosch Auto", partType: "Brakes", bikeBrand: "Hero", compatible: ["Hero HF Deluxe","Hero Splendor Plus"], rating: 4.3, reviews: 178, retailPrice: 299, wholesalePrice: 205, resellerPrice: 182, discount: 8, stock: 156, sku: "BA-BS-048" },
  { id: "bp-14", name: "Handle Grip Set (Rubber)", brand: "Rolon", partType: "Accessories", bikeBrand: "Bajaj", compatible: ["Bajaj Platina","Bajaj Pulsar 150"], rating: 4.1, reviews: 92, retailPrice: 249, wholesalePrice: 170, resellerPrice: 150, discount: 15, stock: 220, sku: "RL-HG-053" },
  { id: "bp-15", name: "Carburetor Assembly", brand: "Sunfast", partType: "Engine", bikeBrand: "Royal Enfield", compatible: ["Royal Enfield Classic 350"], rating: 4.4, reviews: 54, retailPrice: 2899, wholesalePrice: 2010, resellerPrice: 1780, discount: 10, stock: 16, sku: "SF-CB-061" },
  { id: "bp-16", name: "Silencer / Exhaust Pipe", brand: "Luminex", partType: "Exhaust", bikeBrand: "TVS", compatible: ["TVS Jupiter","TVS Apache RTR"], rating: 4.2, reviews: 87, retailPrice: 1999, wholesalePrice: 1390, resellerPrice: 1230, discount: 12, stock: 23, sku: "LX-EX-017" },
  { id: "bp-17", name: "Self Start Motor", brand: "Bosch Auto", partType: "Electricals", bikeBrand: "Honda", compatible: ["Honda Activa","Honda Unicorn"], rating: 4.3, reviews: 65, retailPrice: 1399, wholesalePrice: 970, resellerPrice: 860, discount: 8, stock: 30, sku: "BA-SM-072" },
  { id: "bp-18", name: "Fork Oil Seal Kit", brand: "Gabriel", partType: "Suspension", bikeBrand: "Yamaha", compatible: ["Yamaha FZ-S"], rating: 4.0, reviews: 39, retailPrice: 349, wholesalePrice: 240, resellerPrice: 210, discount: 5, stock: 78, sku: "GB-FS-083" },
  { id: "bp-19", name: "Number Plate Frame (Set)", brand: "Rolon", partType: "Accessories", bikeBrand: "Hero", compatible: ["Hero Splendor Plus","Hero HF Deluxe"], rating: 3.9, reviews: 28, retailPrice: 199, wholesalePrice: 135, resellerPrice: 120, discount: 5, stock: 190, sku: "RL-NP-091" },
  { id: "bp-20", name: "Complete Wiring Harness", brand: "Luminex", partType: "Electricals", bikeBrand: "Bajaj", compatible: ["Bajaj Pulsar 150","Bajaj Platina"], rating: 4.1, reviews: 47, retailPrice: 999, wholesalePrice: 690, resellerPrice: 610, discount: 10, stock: 34, sku: "LX-WH-104" },
].map(p => ({ ...p, store: "bike-parts", category: p.partType, sizes: [], colors: [], images: [img(p.sku + "a"), img(p.sku + "b"), img(p.sku + "c")], description: `Precision-engineered ${p.name.toLowerCase()} by ${p.brand}, built to OEM tolerances for a direct fit and long service life. Backed by our standard replacement warranty.`, badge: p.discount >= 15 ? "Best Seller" : null }));

const otherProducts = [
  { id: "ot-01", name: "Non-Stick Cookware Set (5 Pcs)", brand: "HomeCraft", category: "Kitchen", rating: 4.5, reviews: 234, retailPrice: 1899, wholesalePrice: 1290, resellerPrice: 1150, discount: 20, stock: 55, sku: "HC-CK-201" },
  { id: "ot-02", name: "LED Desk Lamp with USB Port", brand: "Brightly", category: "Lighting", rating: 4.3, reviews: 178, retailPrice: 899, wholesalePrice: 610, resellerPrice: 540, discount: 15, stock: 88, sku: "BR-LM-014" },
  { id: "ot-03", name: "Memory Foam Pillow (Set of 2)", brand: "SleepWell Home", category: "Bedding", rating: 4.6, reviews: 412, retailPrice: 1299, wholesalePrice: 890, resellerPrice: 790, discount: 25, stock: 63, sku: "SW-PL-009" },
  { id: "ot-04", name: "Stainless Steel Water Bottle 1L", brand: "HydroLife", category: "Kitchen", rating: 4.4, reviews: 356, retailPrice: 499, wholesalePrice: 340, resellerPrice: 300, discount: 10, stock: 190, sku: "HL-WB-033" },
  { id: "ot-05", name: "Wall Clock Minimalist", brand: "Brightly", category: "Decor", rating: 4.1, reviews: 71, retailPrice: 799, wholesalePrice: 540, resellerPrice: 480, discount: 12, stock: 47, sku: "BR-WC-021" },
  { id: "ot-06", name: "Cotton Bedsheet Set (King)", brand: "SleepWell Home", category: "Bedding", rating: 4.5, reviews: 289, retailPrice: 1599, wholesalePrice: 1080, resellerPrice: 960, discount: 18, stock: 39, sku: "SW-BS-042" },
  { id: "ot-07", name: "Electric Kettle 1.5L", brand: "HomeCraft", category: "Kitchen", rating: 4.2, reviews: 198, retailPrice: 799, wholesalePrice: 540, resellerPrice: 480, discount: 15, stock: 74, sku: "HC-EK-055" },
  { id: "ot-08", name: "Storage Organizer Boxes (Set of 3)", brand: "TidyHome", category: "Storage", rating: 4.3, reviews: 145, retailPrice: 699, wholesalePrice: 470, resellerPrice: 420, discount: 10, stock: 102, sku: "TH-SB-016" },
  { id: "ot-09", name: "Aromatic Scented Candles (Pack of 4)", brand: "TidyHome", category: "Decor", rating: 4.6, reviews: 267, retailPrice: 599, wholesalePrice: 405, resellerPrice: 360, discount: 20, stock: 130, sku: "TH-SC-062" },
  { id: "ot-10", name: "Door Mat Set (Set of 2)", brand: "HomeCraft", category: "Decor", rating: 4.0, reviews: 58, retailPrice: 449, wholesalePrice: 305, resellerPrice: 270, discount: 8, stock: 85, sku: "HC-DM-078" },
].map(p => ({ ...p, store: "other", sizes: [], colors: [], images: [img(p.sku + "a"), img(p.sku + "b"), img(p.sku + "c")], description: `The ${p.name} by ${p.brand} blends everyday function with a clean, modern look built to fit any home.`, badge: p.discount >= 18 ? "Best Seller" : null }));

const allProducts = [...clothingProducts, ...bikeParts, ...otherProducts];

const testimonials = [
  { name: "Rohit Malhotra", role: "Retail customer, Delhi", quote: "Ordered a kurta set for Diwali and it arrived two days early, fit was perfect and the fabric feels genuinely premium." },
  { name: "Sana Enterprises", role: "Wholesale partner, Ludhiana", quote: "We restock our shop from VC Mart every month. Bulk pricing is transparent and dispatch has never been late." },
  { name: "Vikram Auto Spares", role: "Reseller, Pune", quote: "Bike part compatibility listings save us so much back-and-forth with customers. Exactly what we needed." },
];

/* =========================================================================
   SERVICE / UTILITY LAYER
   src/services/productService.js -> getProducts(), getProductsByStore(), getProductById()
   src/utils/pricing.js -> getProductPrice(product, role)
   ========================================================================= */
function getProductPrice(product, role) {
  if (role === "wholesale") return product.wholesalePrice;
  if (role === "reseller") return product.resellerPrice;
  return product.retailPrice;
}
function formatPrice(n) {
  return siteConfig.currency + Math.round(n).toLocaleString("en-IN");
}
function storeOf(id) { return stores.find(s => s.id === id); }
function productById(id) { return allProducts.find(p => p.id === id); }
function productsByStore(id) { return allProducts.filter(p => p.store === id); }

/* =========================================================================
   DESIGN SYSTEM (would be global CSS in real project)
   ========================================================================= */
const GlobalStyle = () => (
<style>{`
  .uh-root {
    --ink: #3B2618;
    --ink-soft: #705A47;
    --muted: #9A8773;

    --bg: #FDF8F0;
    --surface: #FFFFFF;
    --border: #E9DCC9;

    --primary: #70452A;
    --primary-dark: #55321E;

    --accent: #B98A45;
    --accent-dark: #956B2F;
    --accent-tint: #F5E8D2;

    --teal: #A67D42;
    --teal-tint: #F5E8D2;

    --green: #65734A;
    --red: #A6533E;

    font-family: 'Inter', -apple-system, sans-serif;
    color: var(--ink);
    background: var(--bg);
    line-height: 1.5;
    width: 100%;
  }

  .uh-root * {
    box-sizing: border-box;
  }

  .uh-root h1,
  .uh-root h2,
  .uh-root h3,
  .uh-root h4 {
    font-family: 'Space Grotesk', 'Inter', sans-serif;
    margin: 0;
    letter-spacing: -0.01em;
    color: var(--ink);
  }

  .uh-root p {
    margin: 0;
  }

  .uh-root button {
    font-family: inherit;
    cursor: pointer;
  }

  .uh-root a {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }

  .uh-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 22px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14.5px;
    border: 1.5px solid transparent;
    transition: all .15s ease;
    white-space: nowrap;
  }

  .uh-btn-primary {
    background: var(--accent);
    color: #fff;
  }

  .uh-btn-primary:hover {
    background: var(--accent-dark);
  }

  .uh-btn-dark {
    background: var(--primary);
    color: #fff;
  }

  .uh-btn-dark:hover {
    background: var(--primary-dark);
  }

  .uh-btn-outline {
    background: transparent;
    border-color: var(--primary);
    color: var(--primary);
  }

  .uh-btn-outline:hover {
    background: var(--primary);
    color: #fff;
  }

  .uh-btn-outline-light {
    background: transparent;
    border-color: rgba(255,255,255,.55);
    color: #fff;
  }

  .uh-btn-outline-light:hover {
    background: rgba(255,255,255,.15);
  }

  .uh-btn:disabled {
    opacity: .45;
    cursor: not-allowed;
  }

  .uh-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
  }

  .uh-input {
    width: 100%;
    padding: 11px 14px;
    border-radius: 8px;
    border: 1.5px solid var(--border);
    font-size: 14.5px;
    background: #fff;
    color: var(--ink);
    font-family: inherit;
  }

  .uh-input:focus {
    outline: none;
    border-color: var(--accent);
  }

  .uh-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink-soft);
    margin-bottom: 6px;
    display: block;
  }

  .uh-container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .uh-section {
    padding: 56px 0;
  }

  .uh-eyebrow {
    font-size: 13px;
    font-weight: 600;
    color: var(--accent-dark);
  }

  .uh-grid {
    display: grid;
    gap: 20px;
  }

  .uh-scroll::-webkit-scrollbar {
    display: none;
  }

  .uh-scroll {
    scrollbar-width: none;
  }

  .uh-fade-in {
    animation: uhFadeIn .35s ease both;
  }

  @keyframes uhFadeIn {
    from {
      opacity: 0;
      transform: translateY(6px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }



  /* ============================================================
     VC MART RESPONSIVE SAFETY + LAYOUT
     Responsive-only overrides. Existing components/features preserved.
     ============================================================ */

  html,
  body,
  #root {
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 0;
  }

  html {
    overflow-x: clip;
  }

  body {
    overflow-x: clip;
  }

  .uh-root {
    min-width: 0;
    max-width: 100%;
    overflow-x: clip;
  }

  .uh-root img,
  .uh-root video,
  .uh-root svg {
    max-width: 100%;
  }

  .uh-root input,
  .uh-root textarea,
  .uh-root select,
  .uh-root button {
    max-width: 100%;
  }

  .uh-container,
  .uh-grid,
  .uh-card {
    min-width: 0;
  }

  .uh-grid > * {
    min-width: 0;
  }

 .uh-mobile-toggle {
  display: flex !important;
  flex-shrink: 0;
}

  .uh-navbar-inner {
    min-width: 0;
  }

  .uh-navbar-actions {
    min-width: 0;
  }

  .uh-mobile-menu {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  #uh-hero-grid > *,
  #uh-pdp-grid > *,
  #uh-cart-grid > *,
  #uh-checkout-grid > *,
  #uh-admin-grid > *,
  #uh-listing-grid > * {
    min-width: 0;
  }

  #uh-pdp-grid img,
  #uh-related-grid img,
  #uh-product-results-grid img,
  #uh-wishlist-grid img {
    max-width: 100%;
  }

  /* Keep long text/content from creating viewport overflow. */
  .uh-root p,
  .uh-root h1,
  .uh-root h2,
  .uh-root h3,
  .uh-root h4,
  .uh-root a,
  .uh-root span,
  .uh-root td,
  .uh-root th {
    overflow-wrap: anywhere;
  }

  /* Tablet */
  @media (max-width: 1100px) {
    .uh-navbar-inner {
      gap: 14px !important;
    }

    #uh-store-grid,
    #uh-tier-grid,
    #uh-testi-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }

    #uh-why-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }

    #uh-related-grid,
    #uh-wishlist-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }

    #uh-product-results-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
  }

  /* Main mobile breakpoint */
  @media (max-width: 980px) {
    .uh-navbar-inner {
      width: 100%;
      max-width: 100%;
      padding: 12px 16px !important;
      gap: 8px 10px !important;
      flex-wrap: wrap !important;
    }

    .uh-mobile-toggle {
      display: flex !important;
      order: 1;
    }

    .uh-navbar-inner > a {
      order: 2;
      min-width: 0;
    }

    .uh-navbar-actions {
      order: 3;
      margin-left: auto !important;
      gap: 2px !important;
      max-width: calc(100% - 150px);
    }

    .uh-navbar-actions .uh-role-switch {
      display: none !important;
    }

    .uh-navbar-actions button {
      padding: 7px !important;
    }

    .uh-desktop-nav {
      display: none !important;
    }

    .uh-searchbar {
      display: flex !important;
      order: 4;
      flex: 1 1 100% !important;
      width: 100% !important;
      max-width: none !important;
      min-width: 0 !important;
    }

    .uh-searchbar input {
      min-width: 0 !important;
    }

    .uh-mobile-menu {
      padding-left: 16px !important;
      padding-right: 16px !important;
    }

    #uh-listing-grid {
      grid-template-columns: 1fr !important;
    }

    #uh-filters-desktop {
      display: none !important;
    }

    #uh-filters-mobile-btn {
      display: inline-flex !important;
    }

    #uh-product-results-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }

    #uh-pdp-grid,
    #uh-cart-grid,
    #uh-checkout-grid {
      grid-template-columns: 1fr !important;
      gap: 24px !important;
    }

    #uh-related-grid,
    #uh-wishlist-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }

    #uh-admin-grid {
      grid-template-columns: 1fr !important;
    }

    #uh-admin-grid > aside {
      position: relative !important;
      width: 100% !important;
      min-width: 0 !important;
    }

    #uh-admin-stats,
    #uh-admin-lower {
      grid-template-columns: 1fr !important;
    }

    #uh-footer-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 24px !important;
    }
  }

  /* Phone */
  @media (max-width: 640px) {
    .uh-container {
      padding-left: 14px !important;
      padding-right: 14px !important;
    }

    .uh-section {
      padding-top: 32px !important;
      padding-bottom: 32px !important;
    }

    .uh-navbar-inner {
      padding-left: 12px !important;
      padding-right: 12px !important;
    }

    .uh-navbar-inner > a span {
      font-size: 18px !important;
    }

    .uh-navbar-inner > a > div {
      width: 38px !important;
      height: 38px !important;
    }

    .uh-navbar-actions {
      max-width: none;
    }

    .uh-navbar-actions button {
      padding: 6px !important;
    }

    .uh-navbar-actions svg {
      width: 19px;
      height: 19px;
    }

    #uh-store-grid,
    #uh-why-grid,
    #uh-tier-grid,
    #uh-testi-grid,
    #uh-related-grid,
    #uh-wishlist-grid {
      grid-template-columns: 1fr !important;
    }

    #uh-product-results-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 12px !important;
    }

    #uh-hero-grid {
      gap: 24px !important;
    }

    #uh-hero-grid > div:first-child {
      min-width: 0;
    }

    #uh-hero-grid h1 {
      font-size: clamp(28px, 8vw, 38px) !important;
      line-height: 1.08 !important;
    }

    #uh-hero-grid p {
      max-width: 100% !important;
    }

    #uh-hero-grid > div:first-child > div:last-child {
      gap: 18px !important;
      flex-wrap: wrap !important;
    }

    #uh-footer-grid {
      grid-template-columns: 1fr !important;
      padding: 36px 14px 20px !important;
    }

    #uh-footer-grid > div {
      min-width: 0 !important;
    }

    /* Stack inline action/form rows where space is tight. */
    .uh-root form {
      max-width: 100%;
    }

    #uh-checkout-grid input,
    #uh-checkout-grid textarea,
    #uh-checkout-grid select {
      min-width: 0 !important;
    }

    /* Product/admin controls stay inside the viewport. */
    #uh-admin-grid .uh-card,
    #uh-admin-grid form {
      min-width: 0 !important;
      max-width: 100% !important;
    }

    /* Keep intentionally wide admin tables scrollable inside their card. */
    #uh-admin-grid table {
      max-width: none !important;
    }
  }

  /* Very small phones */
  @media (max-width: 380px) {
    .uh-container {
      padding-left: 10px !important;
      padding-right: 10px !important;
    }

    .uh-navbar-inner > a span {
      font-size: 17px !important;
    }

    #uh-product-results-grid {
      grid-template-columns: 1fr !important;
    }

    .uh-btn {
      white-space: normal !important;
      text-align: center;
    }
  }

  /* Admin product form / action rows become safe on narrow screens. */
  @media (max-width: 700px) {
    #uh-admin-grid [style*="justify-content: flex-end"] {
      flex-wrap: wrap !important;
    }

    #uh-admin-grid [style*="grid-template-columns"] {
      min-width: 0 !important;
    }

    #uh-admin-grid table {
      font-size: 12px !important;
    }

    #uh-admin-grid td,
    #uh-admin-grid th {
      white-space: nowrap;
    }
  }

  /* Mobile filter drawer must never exceed viewport width. */
  @media (max-width: 480px) {
    #uh-filters-mobile-btn {
      max-width: 48%;
    }

    .uh-root [style*="width: 300px"] {
      width: min(300px, 88vw) !important;
      max-width: 88vw !important;
    }
  }

  @media (max-width: 900px) {
    .uh-section {
      padding: 36px 0;
    }

    .uh-container {
      padding: 0 16px;
    }
  }

  /* Search bar interaction */
.uh-searchbar {
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.uh-searchbar:hover {
  border-color: var(--accent) !important;
}

.uh-searchbar:focus-within {
  border-color: var(--accent) !important;
  box-shadow: 0 0 0 3px var(--accent-tint);
}

.uh-searchbar input::placeholder {
  color: var(--muted);
}
`}</style>
);

/* =========================================================================
   SHARED UI PARTS
   ========================================================================= */
function Stars({ rating, size = 13 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size} fill={i <= Math.round(rating) ? "#B87816" : "none"} color={i <= Math.round(rating) ? "#B87816" : "#D8C4A8"} />
      ))}
    </span>
  );
}
function PriceBlock({ product, role, size = "md" }) {
  const price = getProductPrice(product, role);
  const discount = Number(product.discount) || 0;

  const original =
    role === "retail" && discount > 0 && Number(price) > 0
      ? Math.round(Number(price) / (1 - discount / 100))
      : null;

  const big = size === "lg" ? 22 : 16;

  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
      <span
        style={{
          fontWeight: 700,
          fontSize: big,
          fontFamily: "'Space Grotesk', sans-serif"
        }}
      >
        {formatPrice(price)}
      </span>

      {original && original > price && (
        <>
          <span
            style={{
              fontSize: big - 4,
              color: "var(--muted)",
              textDecoration: "line-through"
            }}
          >
            {formatPrice(original)}
          </span>

          <span
            style={{
              fontSize: 12.5,
              color: "var(--green)",
              fontWeight: 700
            }}
          >
            {discount}% off
          </span>
        </>
      )}
    </div>
  );
}

function RoleBadge({ role }) {
  const label = roles.find(r => r.id === role)?.label || "Retail";
  return (
    <span style={{ fontSize: 11.5, fontWeight: 700, padding: "3px 9px", borderRadius: 6, background: "var(--accent-tint)", color: "var(--accent-dark)" }}>
      {label} pricing
    </span>
  );
}

function ProductCard({ product, role, onOpen, onAddToCart, onToggleWishlist, wished }) {
  const productId = product.id || product._id;
  const store = storeOf(product.store) || stores[0];
  const accentColor = store.accent === "teal" ? "var(--teal)" : store.accent === "amber" ? "var(--accent-dark)" : "var(--primary)";
  return (
    <div
      className="uh-card uh-fade-in"
      style={{ overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer", transition: "box-shadow .15s, transform .15s" }}
      onClick={() => onOpen(productId)}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 20px rgba(20,23,31,.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ position: "relative", aspectRatio: "1/1", background: "#F4EBDD" }}>
        <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
        {product.badge && (
          <span style={{ position: "absolute", top: 10, left: 10, fontSize: 11, fontWeight: 700, padding: "4px 9px", borderRadius: 6, background: accentColor, color: "#fff" }}>
            {product.badge}
          </span>
        )}
        <button
          onClick={e => { e.stopPropagation(); onToggleWishlist(productId); }}
          aria-label="Toggle wishlist"
          style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "50%", border: "none", background: "rgba(255,255,255,.92)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Heart size={16} fill={wished ? "#A6402A" : "none"} color={wished ? "#A6402A" : "var(--ink-soft)"} />
        </button>
        {product.stock < 20 && (
          <span style={{ position: "absolute", bottom: 10, left: 10, fontSize: 10.5, fontWeight: 700, padding: "3px 8px", borderRadius: 5, background: "rgba(20,23,31,.85)", color: "#fff" }}>
            Only {product.stock} left
          </span>
        )}
      </div>
      <div style={{ padding: "13px 14px 15px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: accentColor, textTransform: "uppercase", letterSpacing: ".03em" }}>{product.brand}</span>
        <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35, minHeight: 38 }}>{product.name}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Stars rating={product.rating} />
          <span style={{ fontSize: 12, color: "var(--muted)" }}>({product.reviews})</span>
        </div>
        <PriceBlock product={product} role={role} />
        <button
          className="uh-btn uh-btn-dark"
          style={{ marginTop: 6, padding: "9px 14px", fontSize: 13 }}
          onClick={e => { e.stopPropagation(); onAddToCart(productId, 1); }}
        >
          <ShoppingCart size={15} /> Add to cart
        </button>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, body, actionLabel, onAction }) {
  return (
    <div style={{ textAlign: "center", padding: "70px 20px" }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--accent-tint)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
        <Icon size={26} color="var(--accent-dark)" />
      </div>
      <h3 style={{ fontSize: 19, marginBottom: 6 }}>{title}</h3>
      <p style={{ color: "var(--ink-soft)", fontSize: 14.5, maxWidth: 380, margin: "0 auto 20px" }}>{body}</p>
      {actionLabel && <button className="uh-btn uh-btn-dark" onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}

function Breadcrumb({ items, onNavigate }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-soft)", flexWrap: "wrap" }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight size={13} />}
          {it.page ? (
            <a onClick={() => onNavigate(it.page, it.params)} style={{ color: i === items.length - 1 ? "var(--ink)" : "var(--ink-soft)", fontWeight: i === items.length - 1 ? 600 : 400 }}>{it.label}</a>
          ) : (
            <span style={{ fontWeight: 600, color: "var(--ink)" }}>{it.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* =========================================================================
   NAVBAR / FOOTER
   ========================================================================= */
function TopBar() {
  const message = (
    <span style={{ display: "inline-flex", alignItems: "center" }}>
      Free shipping on orders above {formatPrice(999)}
      <span style={{ margin: "0 28px", opacity: 0.5 }}>•</span>
      Wholesale &amp; reseller accounts get special pricing
      <span style={{ margin: "0 28px", opacity: 0.5 }}>•</span>
    </span>
  );
 
  return (
    <div style={{ background: "var(--primary)", color: "#fff", fontSize: 12.5, padding: "7px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
      <div id="uh-topbar-track" style={{ display: "inline-flex", width: "max-content" }}>
        {message}
        {message}
      </div>
      <style>{`
        #uh-topbar-track {
          animation: uh-marquee 4s linear infinite;
        }
        @keyframes uh-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        
      `}</style>
    </div>
  );
}

function Navbar({nav, cartCount, wishlistCount, role, setRole, isLoggedIn, user, mobileOpen, setMobileOpen, searchTerm, setSearchTerm, onSearchSubmit  }) {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 40, background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
      <div className="uh-container uh-navbar-inner" style={{ display: "flex", alignItems: "center", gap: 20, padding: "14px 24px" }}>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ border: "none", background: "transparent", padding: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)" }} className="uh-mobile-toggle" aria-label="Menu">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <a onClick={() => nav("home")} style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, overflow: "hidden", background: "var(--accent-tint)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
            <img src={BRAND_LOGO} alt="Vinayak Collection" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20 }}>{siteConfig.siteName}</span>
        </a>

        <nav style={{ display: "flex", gap: 20 }} className="uh-desktop-nav">
          {stores.map(s => (
            <a key={s.id} onClick={() => nav("store", { storeId: s.id })} style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink-soft)" }}>{s.name}</a>
          ))}
        </nav>

        <form
          onSubmit={e => { e.preventDefault(); onSearchSubmit(); }}
          style={{ flex: 1, maxWidth: 420, display: "flex", alignItems: "center", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "0 12px" }}
          className="uh-searchbar"
        >
          <Search size={16} color="var(--muted)" />
          <input
  value={searchTerm}
  onChange={e => setSearchTerm(e.target.value)}
  placeholder="Search products, brands and more"
  style={{
    border: "none",
    background: "transparent",
    padding: "9px 10px",
    fontSize: 13.5,
    width: "100%",
    outline: "none",
    color: "var(--ink)",
    caretColor: "var(--ink)",
  }}
/>
        </form>

        <div className="uh-navbar-actions" style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", flexShrink: 0 }}>
          <div style={{ position: "relative" }} className="uh-role-switch">
            <button onClick={() => setRoleMenuOpen(!roleMenuOpen)} className="uh-btn uh-btn-outline" style={{ padding: "8px 12px", fontSize: 12.5 }}>
              {roles.find(r => r.id === role)?.label} <ChevronDown size={14} />
            </button>
            {roleMenuOpen && (
              <div className="uh-card uh-fade-in" style={{ position: "absolute", right: 0, top: "110%", width: 190, padding: 6, zIndex: 50, boxShadow: "0 10px 26px rgba(20,23,31,.14)" }}>
                <p style={{ fontSize: 11, color: "var(--muted)", padding: "6px 8px" }}>Demo: view pricing as</p>
                {roles.map(r => (
                  <a key={r.id} onClick={() => { setRole(r.id); setRoleMenuOpen(false); }} style={{ display: "flex", justifyContent: "space-between", padding: "8px 8px", borderRadius: 6, fontSize: 13.5, fontWeight: 600, background: role === r.id ? "var(--accent-tint)" : "transparent" }}>
                    {r.label} {role === r.id && <Check size={14} color="var(--accent-dark)" />}
                  </a>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => nav(isLoggedIn ? "profile" : "auth")} title="Account" style={{ border: "none", background: "transparent", padding: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)" }}><User size={20} strokeWidth={2} /></button>
          <button onClick={() => nav("wishlist")} title="Wishlist" style={{ border: "none", background: "transparent", padding: 8, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)" }}>
            <Heart size={20} strokeWidth={2} />
            {wishlistCount > 0 && <CountBubble count={wishlistCount} />}
          </button>
          <button onClick={() => nav("cart")} title="Cart" style={{ border: "none", background: "transparent", padding: 8, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)" }}>
            <ShoppingCart size={20} strokeWidth={2} />
            {cartCount > 0 && <CountBubble count={cartCount} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="uh-fade-in uh-mobile-menu" style={{ borderTop: "1px solid var(--border)", padding: "10px 20px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
          {stores.map(s => (
            <a key={s.id} onClick={() => { nav("store", { storeId: s.id }); setMobileOpen(false); }} style={{ padding: "10px 4px", fontWeight: 600, fontSize: 15 }}>{s.name}</a>
          ))}
          {user?.role === "admin" && (
  <a
    onClick={() => {
      nav("admin");
      setMobileOpen(false);
    }}
    style={{
      padding: "10px 4px",
      fontWeight: 600,
      fontSize: 15,
      color: "var(--ink-soft)"
    }}
  >
    Admin Dashboard
  </a>
)}
        </div>
      )}
      <style>{`
        @media (max-width: 980px) {
          .uh-desktop-nav, .uh-searchbar { display: none !important; }
          .uh-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

function CountBubble({ count }) {
  return (
    <span style={{ position: "absolute", top: -2, right: -2, background: "var(--accent)", color: "#fff", fontSize: 10, fontWeight: 700, minWidth: 16, height: 16, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>
      {count}
    </span>
  );
}

function Footer({ nav }) {
  return (
    <footer style={{ background: "var(--primary)", color: "rgba(255,255,255,.82)", marginTop: 40 }}>
      <div className="uh-container" style={{ padding: "48px 24px 24px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr", gap: 32 }} id="uh-footer-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", background: "var(--accent-tint)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
              <img src={BRAND_LOGO} alt="Vinayak Collection" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <span style={{ color: "#fff", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18 }}>{siteConfig.siteName}</span>
          </div>
          <p style={{ fontSize: 13.5, maxWidth: 260, lineHeight: 1.6 }}>{siteConfig.tagline} Serving retail, wholesale and reseller customers across India.</p>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            {[Globe, Camera, MessageCircle].map((Icon, i) => (
              <span key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={15} /></span>
            ))}
          </div>
        </div>
        <div>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 13.5, marginBottom: 14 }}>Shop</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13.5 }}>
            {stores.map(s => <a key={s.id} onClick={() => nav("store", { storeId: s.id })}>{s.name}</a>)}
            <a onClick={() => nav("wishlist")}>Wishlist</a>
          </div>
        </div>
        <div>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 13.5, marginBottom: 14 }}>Company</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13.5 }}>
            <a onClick={() => nav("about")}>About us</a>
            <a onClick={() => nav("contact")}>Contact us</a>
            <a onClick={() => nav("policy", { type: "shipping" })}>Shipping policy</a>
            <a onClick={() => nav("policy", { type: "returns" })}>Returns & refunds</a>
            <a onClick={() => nav("policy", { type: "terms" })}>Terms & conditions</a>
            <a onClick={() => nav("policy", { type: "privacy" })}>Privacy policy</a>
          </div>
        </div>
        <div>
       <p style={{ color: "#fff", fontWeight: 700, fontSize: 13.5, marginBottom: 14 }}>Get in touch</p>
<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: 12,
    alignItems: "center",
    textAlign: "center",
  }}
>
  {siteConfig.contacts.map((contact) => (
    <div key={contact.businessName}>
      <div
        style={{
          fontSize: 13.5,
          fontWeight: 600,
          marginBottom: 4,
        }}
      >
        {contact.businessName}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          fontSize: 13.5,
        }}
      >
        <Phone size={14} />
        <span>{contact.phones.join(" / ")}</span>
      </div>
    </div>
  ))}

  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      gap: 7,
      fontSize: 13.5,
      lineHeight: 1.5,
      maxWidth: 290,
      textAlign: "center",
    }}
  >
    <MapPin
      size={15}
      style={{
        marginTop: 3,
        flexShrink: 0,
      }}
    />

    <span>{siteConfig.address}</span>
  </div>
</div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.12)", padding: "18px 24px", textAlign: "center", fontSize: 12.5 }}>
        \u00A9 {new Date().getFullYear()} {siteConfig.siteName}. All rights reserved. &nbsp;\&nbsp; Built for retail, wholesale & reseller commerce.
      </div>
      <style>{`@media (max-width: 900px) { #uh-footer-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>
    </footer>
  );
}

/* =========================================================================
   HOME PAGE
   ========================================================================= */
function HeroOfferSlider({ slides }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 3200);
    return () => clearInterval(timerRef.current);
  }, [slides]);

  const goTo = useCallback((i) => {
    setActive(i);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  if (!slides || slides.length === 0) return null;

  return (
    <div style={{ position: "relative", width: "100%", height: 420, borderRadius: 16, overflow: "hidden" }}>
      {slides.map((s, i) => (
        <div
          key={s.id || i}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === active ? 1 : 0,
            transition: "opacity 900ms ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 24,
            background: s.image
              ? `linear-gradient(180deg, rgba(85,50,30,.35), rgba(85,50,30,.75)), url(${s.image}) center/cover no-repeat`
              : "linear-gradient(135deg, var(--primary), var(--primary-dark))",
          }}
        >
          {s.tag && (
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.4, color: "#fff", background: "rgba(255,255,255,.18)", padding: "5px 14px", borderRadius: 20, marginBottom: 12 }}>
              {s.tag}
            </span>
          )}
          {s.title && (
            <h3 style={{ fontSize: 26, lineHeight: 1.2, color: "#fff", margin: 0, maxWidth: 340 }}>{s.title}</h3>
          )}
          {s.subtitle && (
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.85)", marginTop: 10, maxWidth: 320 }}>{s.subtitle}</p>
          )}
        </div>
      ))}
      <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 7 }}>
        {slides.map((s, i) => (
          <button
            key={s.id || i}
            aria-label={`Show offer ${i + 1}`}
            onClick={() => goTo(i)}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              border: "none",
              padding: 0,
              cursor: "pointer",
              background: "#fff",
              opacity: i === active ? 1 : 0.4,
              transition: "opacity 300ms ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Hero({ nav }) {
  return (
    <section style={{ background: "var(--primary)", color: "#fff", position: "relative", overflow: "hidden" }}>
      <div className="uh-container" style={{ padding: "64px 24px 56px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 40, alignItems: "center" }} id="uh-hero-grid">
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", background: "rgba(232,135,30,.15)", padding: "6px 12px", borderRadius: 20, display: "inline-block" }}>Retail \ Wholesale \ Reseller, one platform</span>
          <h1 style={{ fontSize: 46, lineHeight: 1.08, margin: "20px 0 16px", maxWidth: 540 }}>Everything you need.<br />One store.</h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.78)", maxWidth: 460, lineHeight: 1.6 }}>Shop clothing, bike spare parts and home essentials — with pricing that adapts whether you're buying one piece or stocking a shop.</p>
          <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
            <button className="uh-btn uh-btn-primary" onClick={() => nav("store", { storeId: "clothing" })}>Shop now <ArrowRight size={16} /></button>
            <button className="uh-btn uh-btn-outline-light" onClick={() => document.getElementById("uh-shop-by-store")?.scrollIntoView({ behavior: "smooth" })}>Explore stores</button>
          </div>
          <div style={{ display: "flex", gap: 28, marginTop: 38 }}>
            <div><p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700 }}>50+</p><p style={{ fontSize: 12.5, color: "rgba(255,255,255,.65)" }}>Products live</p></div>
            <div><p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700 }}>3</p><p style={{ fontSize: 12.5, color: "rgba(255,255,255,.65)" }}>Stores, one cart</p></div>
            <div><p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700 }}>24hr</p><p style={{ fontSize: 12.5, color: "rgba(255,255,255,.65)" }}>Dispatch time</p></div>
          </div>
        </div>
        <HeroOfferSlider slides={heroOfferSlides} />
      </div>
      <style>{`@media (max-width: 900px) { #uh-hero-grid { grid-template-columns: 1fr !important; } #uh-hero-grid > div:last-child { display: none !important; } }`}</style>
    </section>
  );
}

function ShopByStore({ nav }) {
  return (
    <section className="uh-section" id="uh-shop-by-store">
      <div className="uh-container">
        <h2 style={{ fontSize: 27, marginBottom: 4 }}>Shop by store</h2>
        <p style={{ color: "var(--ink-soft)", marginBottom: 26, fontSize: 14.5 }}>Three specialised stores, one checkout.</p>
        <div className="uh-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }} id="uh-store-grid">
          {stores.map(s => {
            const color = s.accent === "teal" ? "var(--teal)" : s.accent === "amber" ? "var(--accent-dark)" : "var(--primary)";
            const bg = s.accent === "teal" ? "var(--teal-tint)" : s.accent === "amber" ? "var(--accent-tint)" : "#F2E6D3";
            return (
              <div key={s.id} className="uh-card" style={{ overflow: "hidden", cursor: "pointer" }} onClick={() => nav("store", { storeId: s.id })}>
                <div style={{ height: 150, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img
  src={
    s.id === "clothing"
      ? "/images/clothes_img.png"
      : s.id === "bike-parts"
        ? "/images/bike_spare_img.png"
      : s.id === "mobile-store"
        ? "/images/mobile_img.png"
        : img("tile-" + s.id)
  }
  alt={s.name}
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover"
  }}
/>
                </div>
                <div style={{ padding: "18px 18px 20px" }}>
                  <h3 style={{ fontSize: 18, marginBottom: 4 }}>{s.name}</h3>

<p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
  {s.businessName}
</p>

<p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 12 }}>
  {s.tagline}
</p>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color, display: "flex", alignItems: "center", gap: 4 }}>Browse store <ChevronRight size={15} /></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`@media (max-width: 900px) { #uh-store-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

function ProductRail({ title, subtitle, products, role, wishlist, ...handlers }) {
  return (
    <section className="uh-section" style={{ paddingBottom: 0 }}>
      <div className="uh-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 22 }}>
          <div>
            <h2 style={{ fontSize: 24 }}>{title}</h2>
            {subtitle && <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 4 }}>{subtitle}</p>}
          </div>
        </div>
        <div className="uh-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }} id={`rail-${title.replace(/\s/g,"")}`}>
          {products.map(p => <ProductCard key={p.id} product={p} role={role} wished={wishlist.includes(p.id)} {...handlers} />)}
        </div>
      </div>
      <style>{`
        @media (max-width: 980px) { #rail-${title.replace(/\s/g,"")} { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </section>
  );
}

function WhyChooseUs() {
  const items = [
    { icon: ShieldCheck, title: "Genuine products", body: "Every item sourced and verified before it goes live." },
    { icon: Truck, title: "Fast dispatch", body: "Orders leave our warehouse within 24 hours." },
    { icon: TrendingUp, title: "Tiered pricing", body: "Better rates automatically for wholesale and reseller accounts." },
    { icon: RotateCcw, title: "Easy returns", body: "7-day return window on eligible products." },
  ];
  return (
    <section className="uh-section">
      <div className="uh-container">
        <h2 style={{ fontSize: 24, marginBottom: 26 }}>Why choose {siteConfig.siteName}</h2>
        <div className="uh-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }} id="uh-why-grid">
          {items.map((it, i) => (
            <div key={i} style={{ padding: "22px 18px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14 }}>
              <it.icon size={22} color="var(--accent-dark)" />
              <h4 style={{ fontSize: 15.5, margin: "12px 0 6px" }}>{it.title}</h4>
              <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.55 }}>{it.body}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 900px) { #uh-why-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>
    </section>
  );
}

function BusinessTiers({ role, setRole }) {
  const tiers = [
    { id: "retail", title: "Retail", body: "Standard pricing for individual buyers, no minimum order." },
    { id: "wholesale", title: "Wholesale", body: "Bulk pricing on 50+ units with dedicated account support." },
    { id: "reseller", title: "Reseller", body: "Sharpest margins for shops reselling under their own brand." },
  ];
  return (
    <section className="uh-section" style={{ background: "var(--primary)" }}>
      <div className="uh-container">
        <h2 style={{ fontSize: 24, color: "#fff", marginBottom: 4 }}>Built for how you buy</h2>
        <p style={{ color: "rgba(255,255,255,.65)", fontSize: 14.5, marginBottom: 26 }}>Retail pricing is currently available. Wholesale and reseller options will be enabled soon.</p>
        <div className="uh-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }} id="uh-tier-grid">
          {tiers.map(t => (
            <div key={t.id} onClick={() => {
  if (t.id === "retail") {
    setRole("retail");
  }
}} style={{ cursor: "pointer", padding: "22px 20px", borderRadius: 14, background: role === t.id ? "var(--accent)" : "rgba(255,255,255,.06)", border: role === t.id ? "1px solid var(--accent)" : "1px solid rgba(255,255,255,.12)" }}>
              <h4 style={{ fontSize: 17, color: "#fff", marginBottom: 6 }}>{t.title}</h4>
              <p style={{ fontSize: 13.5, color: role === t.id ? "rgba(20,23,31,.75)" : "rgba(255,255,255,.65)" }}>{t.body}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 900px) { #uh-tier-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="uh-section">
      <div className="uh-container">
        <h2 style={{ fontSize: 24, marginBottom: 26 }}>What our customers say</h2>
        <div className="uh-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }} id="uh-testi-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="uh-card" style={{ padding: 22 }}>
              <Stars rating={5} size={14} />
              <p style={{ fontSize: 14, lineHeight: 1.6, margin: "12px 0 16px", color: "var(--ink-soft)" }}>{t.quote}</p>
              <p style={{ fontSize: 13.5, fontWeight: 700 }}>{t.name}</p>
              <p style={{ fontSize: 12.5, color: "var(--muted)" }}>{t.role}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 900px) { #uh-testi-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section className="uh-section">
      <div className="uh-container">
        <div style={{ background: "var(--accent-tint)", borderRadius: 18, padding: "40px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ fontSize: 21, marginBottom: 6 }}>Get offers before anyone else</h3>
            <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>New arrivals, bulk deals and seasonal offers straight to your inbox.</p>
          </div>
         {done ? (
  <span
    style={{
      fontWeight: 700,
      color: "var(--green)",
      display: "flex",
      alignItems: "center",
      gap: 6,
    }}
  >
    <Check size={18} /> Subscribed
  </span>
) : (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      if (email.includes("@")) setDone(true);
    }}
    style={{
      display: "flex",
      gap: 10,
      width: "100%",
      maxWidth: 1000,
      flexWrap: "wrap",
    }}
  >
    <input
      required
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="you@email.com"
      className="uh-input"
      style={{
        width: "230px",
        maxWidth: "100%",
        flex: "1 1 230px",
        background: "#fff",
      }}
    />

    <button
      type="submit"
      className="uh-btn uh-btn-dark"
      style={{
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      Subscribe
    </button>
  </form>
)}
        </div>
      </div>
    </section>
  );
}

function HomePage({ nav, role, setRole, wishlist,products, ...handlers }) {
  const featured = products.filter(p => p.badge === "Best Seller").slice(0, 8);
  const trending = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 4);
  return (
    <div>
      <Hero nav={nav} />
      <ShopByStore nav={nav} />
      <ProductRail title="Featured products" subtitle="Hand-picked across all three stores" products={featured.slice(0,4)} role={role} wishlist={wishlist} onOpen={id => nav("product", { id })} {...handlers} />
      <ProductRail title="Trending now" subtitle="Most reviewed this month" products={trending} role={role} wishlist={wishlist} onOpen={id => nav("product", { id })} {...handlers} />
      <BusinessTiers role={role} setRole={setRole} />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </div>
  );
}


function SearchResultsPage({
  searchTerm,
  nav,
  role,
  wishlist,
  products,
  ...handlers
}) {
  const query = (searchTerm || "").trim().toLowerCase();

  const results = products.filter((p) => {
    if (!query) return false;

    const store = storeOf(p.store);

    const searchableText = [
      p.name,
      p.brand,
      p.category,
      p.bikeBrand,
      p.sku,
      store?.name,
      store?.businessName,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });

  return (
    <div style={{ padding: "32px 20px 60px" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 12,
              color: "var(--muted)",
              marginBottom: 6,
            }}
          >
            SEARCH RESULTS
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              color: "var(--ink)",
            }}
          >
            Results for "{searchTerm}"
          </h1>

          <div
            style={{
              marginTop: 8,
              color: "var(--muted)",
              fontSize: 14,
            }}
          >
            {results.length} product{results.length !== 1 ? "s" : ""} found
          </div>
        </div>

        {results.length === 0 ? (
          <div
            className="uh-card"
            style={{
              padding: 40,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              No products found
            </div>

            <div
              style={{
                color: "var(--muted)",
                fontSize: 14,
              }}
            >
              Try searching with a different product name, brand or category.
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 18,
            }}
          >
            {results.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                role={role}
                wished={wishlist.includes(product.id)}
                onOpen={(id) =>
                  nav("product", { id })
                }
                {...handlers}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   STORE LISTING PAGE
   ========================================================================= */
function StoreListingPage({ storeId, nav, role, searchTerm, wishlist,products, ...handlers }) {
  const store = storeOf(storeId) || stores[0];
  const [sort, setSort] = useState("popular");
  const [priceMax, setPriceMax] = useState(15000);
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [bikeBrand, setBikeBrand] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [storeProducts, setStoreProducts] = useState([]);
const [storeCurrentPage, setStoreCurrentPage] = useState(1);
const [storeTotalPages, setStoreTotalPages] = useState(1);
const [storeLoading, setStoreLoading] = useState(false);

const fetchStoreProducts = useCallback(
  async (page = 1) => {
    try {
      setStoreLoading(true);

      const response = await getProducts(page, 12, store.id, {
        category,
        brand,
        bikeBrand,
        inStockOnly,
        priceMax,
        searchTerm,
        sort,
      });

      const productList = Array.isArray(response)
        ? response
        : response.products || [];

      setStoreProducts(productList);

      if (!Array.isArray(response) && response.pagination) {
        setStoreCurrentPage(response.pagination.currentPage);
        setStoreTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to load store products:", error);
    } finally {
      setStoreLoading(false);
    }
  },
  [
    store.id,
    category,
    brand,
    bikeBrand,
    inStockOnly,
    priceMax,
    searchTerm,
    sort,
  ]
);
useEffect(() => {
  fetchStoreProducts(1);
}, [fetchStoreProducts]);

  const base = storeProducts;
  const categories = useMemo(() => ["all", ...new Set(base.map(p => p.category))], [store.id]);
  const brands = useMemo(() => ["all", ...new Set(base.map(p => p.brand))], [store.id]);
  const bikeBrands = useMemo(() => store.id === "bike-parts" ? ["all", ...new Set(base.map(p => p.bikeBrand))] : [], [store.id]);

 const list = base;

  const FiltersPanel = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div>
        <p style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Max price: {formatPrice(priceMax)}</p>
        <input type="range" min="100" max="5000" step="50" value={priceMax} onChange={e => setPriceMax(Number(e.target.value))} style={{ width: "100%" }} />
      </div>
      <div>
        <p style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Category</p>
        <select className="uh-input" value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(c => <option key={c} value={c}>{c === "all" ? "All categories" : c}</option>)}
        </select>
      </div>
      <div>
        <p style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Brand</p>
        <select className="uh-input" value={brand} onChange={e => setBrand(e.target.value)}>
          {brands.map(c => <option key={c} value={c}>{c === "all" ? "All brands" : c}</option>)}
        </select>
      </div>
      {store.id === "bike-parts" && (
        <div>
          <p style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Bike brand</p>
          <select className="uh-input" value={bikeBrand} onChange={e => setBikeBrand(e.target.value)}>
            {bikeBrands.map(c => <option key={c} value={c}>{c === "all" ? "All bike brands" : c}</option>)}
          </select>
        </div>
      )}
      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600 }}>
        <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} /> In stock only
      </label>
      <button className="uh-btn uh-btn-outline" onClick={() => { setPriceMax(5000); setCategory("all"); setBrand("all"); setBikeBrand("all"); setInStockOnly(false); }}>Clear filters</button>
    </div>
  );

  return (
    <div>
      <div style={{ background: "var(--primary)", padding: "34px 0" }}>
        <div className="uh-container">
          <Breadcrumb items={[{ label: "Home", page: "home" }, { label: store.name }]} onNavigate={nav} />
          <h1 style={{ color: "#fff", fontSize: 30, marginTop: 10 }}>{store.name}</h1>
          <p style={{ color: "rgba(255,255,255,.7)", fontSize: 14, marginTop: 4 }}>{store.tagline}  {base.length} products</p>
        </div>
      </div>
      <div className="uh-container" style={{ padding: "28px 24px 60px", display: "grid", gridTemplateColumns: "240px 1fr", gap: 30 }} id="uh-listing-grid">
        <aside style={{ display: "block" }} id="uh-filters-desktop">
          <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><Filter size={16} /> Filters</p>
          <FiltersPanel />
        </aside>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
            <button className="uh-btn uh-btn-outline" id="uh-filters-mobile-btn" style={{ display: "none" }} onClick={() => setMobileFiltersOpen(true)}><Filter size={15} /> Filters</button>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>{list.length} results</p>
            <select className="uh-input" style={{ width: 190 }} value={sort} onChange={e => setSort(e.target.value)}>
              <option value="popular">Sort: Popular</option>
              <option value="priceLow">Price: Low to high</option>
              <option value="priceHigh">Price: High to low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          {list.length === 0 ? (
            <EmptyState icon={Package} title="No products found" body="Try adjusting your filters or search term to see more results." actionLabel="Clear filters" onAction={() => { setPriceMax(5000); setCategory("all"); setBrand("all"); setBikeBrand("all"); setInStockOnly(false); }} />
          ) : (
            <div className="uh-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }} id="uh-product-results-grid">
{list.map(p => <ProductCard key={p.id || p._id} product={p} role={role} onOpen={id => nav("product", { id: p.id || p._id })} wished={wishlist.includes(p.id || p._id)} {...handlers} />)}            </div>
             )}
             {storeTotalPages > 1 && (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      marginTop: 32,
      flexWrap: "wrap",
    }}
  >
    <button
      className="uh-btn uh-btn-outline"
      disabled={storeCurrentPage === 1 || storeLoading}
      onClick={() => fetchStoreProducts(storeCurrentPage - 1)}
      style={{
        opacity: storeCurrentPage === 1 ? 0.5 : 1,
        cursor: storeCurrentPage === 1 ? "not-allowed" : "pointer",
      }}
    >
      Previous
    </button>

    {Array.from({ length: storeTotalPages }, (_, index) => index + 1).map(
      (page) => (
        <button
          key={page}
          className="uh-btn"
          onClick={() => fetchStoreProducts(page)}
          disabled={storeLoading}
          style={{
            minWidth: 38,
            background:
              page === storeCurrentPage
                ? "var(--primary)"
                : "var(--surface)",
            color:
              page === storeCurrentPage
                ? "#fff"
                : "var(--ink)",
            border:
              page === storeCurrentPage
                ? "1px solid var(--primary)"
                : "1px solid var(--border)",
          }}
        >
          {page}
        </button>
      )
    )}

    <button
      className="uh-btn uh-btn-outline"
      disabled={
        storeCurrentPage === storeTotalPages || storeLoading
      }
      onClick={() => fetchStoreProducts(storeCurrentPage + 1)}
      style={{
        opacity:
          storeCurrentPage === storeTotalPages ? 0.5 : 1,
        cursor:
          storeCurrentPage === storeTotalPages
            ? "not-allowed"
            : "pointer",
      }}
    >
      Next
    </button>
  </div>
)}
        </div>
      </div>
      {mobileFiltersOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(20,23,31,.5)", zIndex: 60, display: "flex", justifyContent: "flex-end" }} onClick={() => setMobileFiltersOpen(false)}>
          <div className="uh-card" style={{ width: 300, height: "100%", borderRadius: 0, padding: 20, overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
              <p style={{ fontWeight: 700, fontSize: 16 }}>Filters</p>
              <X size={20} onClick={() => setMobileFiltersOpen(false)} />
            </div>
            <FiltersPanel />
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 900px) {
          #uh-listing-grid { grid-template-columns: 1fr !important; }
          #uh-filters-desktop { display: none !important; }
          #uh-filters-mobile-btn { display: inline-flex !important; }
          #uh-product-results-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  );
}

/* =========================================================================
   PRODUCT DETAILS PAGE
   ========================================================================= */
function ProductDetailsPage({ productId, nav, role, onAddToCart, onToggleWishlist, wished, wishlist = [],products }) {
  const product = products.find((p) => (p.id || p._id) === productId);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState("description");
  const [size, setSize] = useState(product?.sizes?.[0] || null);
  const [color, setColor] = useState(product?.colors?.[0] || null);

  if (!product) {
    return <EmptyState icon={AlertCircle} title="Product not found" body="This product may have been removed or the link is incorrect." actionLabel="Back to home" onAction={() => nav("home")} />;
  }
  const store = storeOf(product.store);
  const related = products
  .filter((p) => p.store === product.store && (p.id || p._id) !== product.id)
  .slice(0, 4);
  const price = getProductPrice(product, role);

  return (
    <div className="uh-container" style={{ padding: "24px 24px 60px" }}>
      <Breadcrumb items={[{ label: "Home", page: "home" }, { label: store.name, page: "store", params: { storeId: store.id } }, { label: product.name }]} onNavigate={nav} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44, marginTop: 22 }} id="uh-pdp-grid">
        <div>
          <div style={{ aspectRatio: "1/1", borderRadius: 14, overflow: "hidden", background: "#F4EBDD", marginBottom: 10 }}>
            <img src={product.images[activeImg]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {product.images.map((im, i) => (
              <button key={i} onClick={() => setActiveImg(i)} style={{ width: 68, height: 68, borderRadius: 8, overflow: "hidden", border: activeImg === i ? "2px solid var(--primary)" : "1px solid var(--border)", padding: 0 }}>
                <img src={im} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--accent-dark)", textTransform: "uppercase" }}>{product.brand}</span>
          <h1 style={{ fontSize: 25, margin: "6px 0 10px" }}>{product.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Stars rating={product.rating} size={15} />
            <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{product.rating}  {product.reviews} reviews</span>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>SKU: {product.sku}</span>
          </div>
          <RoleBadge role={role} />
          <div style={{ marginTop: 10 }}><PriceBlock product={product} role={role} size="lg" /></div>
          <p style={{ fontSize: 13, marginTop: 8, color: product.stock > 0 ? "var(--green)" : "var(--red)", fontWeight: 700 }}>
            {product.stock > 0 ? `In stock \u2014 ${product.stock} units available` : "Out of stock"}
          </p>

          {product.sizes && product.sizes.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <p className="uh-label">Size</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSize(s)} style={{ padding: "8px 14px", borderRadius: 7, border: size === s ? "2px solid var(--primary)" : "1px solid var(--border)", color: "var(--ink)", background: "#fff", fontWeight: 600, fontSize: 13 }}>{s}</button>
                ))}
              </div>
            </div>
          )}
          {product.colors && product.colors.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <p className="uh-label">Colour</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {product.colors.map(c => (
                  <button key={c} onClick={() => setColor(c)} style={{ padding: "8px 14px", borderRadius: 7, border: color === c ? "2px solid var(--primary)" : "1px solid var(--border)", color: "var(--ink)", background: "#fff", fontWeight: 600, fontSize: 13 }}>{c}</button>
                ))}
              </div>
            </div>
          )}
          {product.compatible && (
            <div style={{ marginTop: 18, background: "var(--teal-tint)", borderRadius: 10, padding: 14 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--teal)", marginBottom: 8 }}>Compatible with</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {product.compatible.map(m => (
                  <span key={m} style={{ fontSize: 12, fontWeight: 600, background: "#fff", padding: "5px 10px", borderRadius: 6, color: "var(--teal)" }}>{m}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 24 }}>
            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid var(--border)", borderRadius: 8 }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ border: "none", background: "none", padding: "9px 12px" }}><Minus size={15} /></button>
              <span style={{ width: 30, textAlign: "center", fontWeight: 700 }}>{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={{ border: "none", background: "none", padding: "9px 12px" }}><Plus size={15} /></button>
            </div>
            <button className="uh-btn uh-btn-dark" disabled={product.stock === 0} style={{ flex: 1 }} onClick={() => onAddToCart(productId, qty)}><ShoppingCart size={16} /> Add to cart</button>
            <button className="uh-btn uh-btn-primary" disabled={product.stock === 0} style={{ flex: 1 }} onClick={() => { onAddToCart(productId, qty); nav("checkout"); }}>Buy now</button>
            <button onClick={() => onToggleWishlist(product.id)} style={{ border: "1.5px solid var(--border)", borderRadius: 8, padding: 10, background: "#fff" }} aria-label="Wishlist">
              <Heart size={18} fill={wished ? "#A6402A" : "none"} color={wished ? "#A6402A" : "var(--ink-soft)"} />
            </button>
          </div>

          <div style={{ display: "flex", gap: 20, marginTop: 24, borderTop: "1px solid var(--border)", paddingTop: 18 }}>
            <span style={{ fontSize: 12.5, display: "flex", gap: 6, alignItems: "center", color: "var(--ink-soft)" }}><Truck size={15} /> 3 -7 day delivery</span>
            <span style={{ fontSize: 12.5, display: "flex", gap: 6, alignItems: "center", color: "var(--ink-soft)" }}><RotateCcw size={15} /> 7-day returns</span>
            <span style={{ fontSize: 12.5, display: "flex", gap: 6, alignItems: "center", color: "var(--ink-soft)" }}><ShieldCheck size={15} /> Genuine product</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 44 }}>
        <div style={{ display: "flex", gap: 26, borderBottom: "1px solid var(--border)" }}>
          {["description","specifications","shipping","returns"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ border: "none", background: "none", padding: "12px 2px", fontWeight: 700, fontSize: 14, textTransform: "capitalize", color: tab === t ? "var(--ink)" : "var(--muted)", borderBottom: tab === t ? "2px solid var(--primary)" : "2px solid transparent" }}>{t}</button>
          ))}
        </div>
        <div style={{ padding: "20px 0", fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.7, maxWidth: 720 }}>
          {tab === "description" && <p>{product.description}</p>}
          {tab === "specifications" && (
            <table style={{ width: "100%", fontSize: 13.5 }}>
              <tbody>
                <tr><td style={{ padding: "8px 0", color: "var(--muted)" }}>Brand</td><td style={{ fontWeight: 600 }}>{product.brand}</td></tr>
                <tr><td style={{ padding: "8px 0", color: "var(--muted)" }}>Category</td><td style={{ fontWeight: 600 }}>{product.category}</td></tr>
                <tr><td style={{ padding: "8px 0", color: "var(--muted)" }}>SKU</td><td style={{ fontWeight: 600 }}>{product.sku}</td></tr>
                <tr><td style={{ padding: "8px 0", color: "var(--muted)" }}>Stock</td><td style={{ fontWeight: 600 }}>{product.stock} units</td></tr>
              </tbody>
            </table>
          )}
         {tab === "shipping" && (
  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <div>
      <strong>Order processing</strong>
      <p style={{ marginTop: 4 }}>
        Orders are generally processed and dispatched within 1–3 business days
        after order confirmation and payment verification.
      </p>
    </div>

    <div>
      <strong>Delivery time</strong>
      <p style={{ marginTop: 4 }}>
        Standard delivery usually takes 3–7 business days after dispatch.
        Delivery times may vary depending on location, product availability
        and courier service. Remote areas may take longer.
      </p>
    </div>

    <div>
      <strong>Shipping charges</strong>
      <p style={{ marginTop: 4 }}>
        Shipping charges, if applicable, are shown at checkout before placing
        the order. Additional charges may apply for Cash on Delivery where
        applicable.
      </p>
    </div>

    <div>
      <strong>Separate deliveries</strong>
      <p style={{ marginTop: 4 }}>
        Products from different stores or locations may be delivered separately.
      </p>
    </div>

    <div>
      <strong>Tracking & delays</strong>
      <p style={{ marginTop: 4 }}>
        Tracking details may be shared through SMS, WhatsApp or email.
        Delivery may be delayed due to courier issues, weather, natural events,
        strikes, government restrictions or incorrect/incomplete address details.
      </p>
    </div>
  </div>
)}

{tab === "returns" && (
  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <div>
      <strong>General return policy</strong>
      <p style={{ marginTop: 4 }}>
        Eligible products may generally be returned within 7 days of delivery
        unless a different period is mentioned on the product page. Products
        must be unused, undamaged and in their original condition with
        applicable packaging, tags and accessories.
      </p>
    </div>

    <div>
      <strong>Damaged, defective or wrong product</strong>
      <p style={{ marginTop: 4 }}>
        If you receive a damaged, defective or wrong product, or a missing
        item/accessory, contact VC Mart customer support as soon as possible
        with your order details and supporting photos/videos. After verification,
        a replacement, exchange or refund may be provided.
      </p>
    </div>

    <div>
      <strong>Clothing & fashion</strong>
      <p style={{ marginTop: 4 }}>
        Clothing must be unused and unwashed with original tags attached where
        applicable. Products showing signs of washing, alteration, use, perfume,
        stains or damage may not be eligible. Size exchanges/returns are
        subject to the product page terms.
      </p>
    </div>

    <div>
      <strong>Mobile & electronics</strong>
      <p style={{ marginTop: 4 }}>
        Mobile and electronic products may be subject to manufacturer warranty
        terms. Serial number or IMEI verification may be required. Products
        damaged due to misuse, physical or liquid damage, unauthorized repair
        or improper handling may not qualify for return or refund.
      </p>
    </div>

    <div>
      <strong>Bike spare parts & accessories</strong>
      <p style={{ marginTop: 4 }}>
        Customers are responsible for checking vehicle compatibility, model,
        variant and specifications before ordering. Installed, fitted, modified,
        used or damaged parts may not be eligible for return. Product-specific
        and manufacturer policies may apply.
      </p>
    </div>

    <div>
      <strong>Non-returnable products</strong>
      <p style={{ marginTop: 4 }}>
        Certain products may not be eligible for return due to their nature,
        hygiene, customization, installation or other restrictions. Such
        products will be marked on the product page wherever applicable.
      </p>
    </div>

    <div>
      <strong>Refund process</strong>
      <p style={{ marginTop: 4 }}>
        Returned products are inspected before a refund is approved. Approved
        refunds are generally processed through the original payment method or
        another suitable method depending on the payment type. Processing time
        may vary by the payment provider or bank.
      </p>
    </div>

    <div>
      <strong>Cancellation</strong>
      <p style={{ marginTop: 4 }}>
        Orders may be cancelled before dispatch, subject to order status and
        product-specific conditions. Once shipped, cancellation may not be
        possible and the applicable return process may apply.
      </p>
    </div>

    <div>
      <strong>Important note</strong>
      <p style={{ marginTop: 4 }}>
        Product-specific return, warranty and replacement conditions mentioned
        on the product page will take precedence wherever applicable.
      </p>
    </div>
  </div>
)}
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3 style={{ fontSize: 20, marginBottom: 18 }}>You may also like</h3>
          <div className="uh-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }} id="uh-related-grid">
            {related.map(p => <ProductCard key={p.id} product={p} role={role} onOpen={id => nav("product", { id })} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} wished={wishlist.includes(p.id)} />)}
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 900px) {
          #uh-pdp-grid { grid-template-columns: 1fr !important; }
          #uh-related-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  );
}

/* =========================================================================
   CART PAGE
   ========================================================================= */
function CartPage({ cart, updateQty, removeItem, role, nav, products }) {
  const items = cart
    .map(c => ({
      ...c,
      product: products.find(p => (p.id || p._id) === c.id),
    }))
    .filter(c => c.product);

  const subtotal = items.reduce(
    (sum, c) => sum + getProductPrice(c.product, role) * c.qty,
    0
  );

  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 79;
  const discount =
  role === "wholesale" || role === "reseller"
    ? Math.round(subtotal * 0.02)
    : 0;
  const total = subtotal + shipping - discount;

  if (items.length === 0) {
    return (
      <div className="uh-container" style={{ padding: "60px 24px" }}>
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          body="Looks like you haven't added anything yet. Browse our stores to find something you'll love."
          actionLabel="Start shopping"
          onAction={() => nav("home")}
        />
      </div>
    );
  }

  return (
    <div className="uh-container" style={{ padding: "28px 24px 60px" }}>
      <h1 style={{ fontSize: 25, marginBottom: 22 }}>
        Your cart{" "}
        <span
          style={{
            color: "var(--muted)",
            fontWeight: 400,
            fontSize: 16,
          }}
        >
          ({items.length} item{items.length > 1 ? "s" : ""})
        </span>
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 30,
        }}
        id="uh-cart-grid"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map(c => (
            <div
              key={c.id}
              className="uh-card"
              style={{
                display: "flex",
                gap: 14,
                padding: 14,
              }}
            >
              <img
                src={c.product.images?.[0]}
                alt={c.product.name}
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />

              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 14.5 }}>
                  {c.product.name}
                </p>

                <p
                  style={{
                    fontSize: 12.5,
                    color: "var(--muted)",
                    margin: "3px 0 8px",
                  }}
                >
                  {c.product.brand}
                </p>

                <PriceBlock product={c.product} role={role} />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                }}
              >
                <button
                  onClick={() => removeItem(c.id)}
                  aria-label="Remove"
                  style={{
                    border: "none",
                    background: "none",
                    color: "var(--muted)",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={17} />
                </button>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1.5px solid var(--border)",
                    borderRadius: 7,
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() =>
                      updateQty(c.id, Math.max(1, c.qty - 1))
                    }
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "var(--ink)",
                      padding: "6px 10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Minus size={15} strokeWidth={2.5} />
                  </button>

                  <span
                    style={{
                      width: 28,
                      textAlign: "center",
                      fontSize: 13.5,
                      fontWeight: 700,
                    }}
                  >
                    {c.qty}
                  </span>

                  <button
                    onClick={() =>
                      updateQty(c.id, c.qty + 1)
                    }
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "var(--ink)",
                      padding: "6px 10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Plus size={15} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="uh-card"
          style={{ padding: 20, height: "fit-content" }}
        >
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>
            Order summary
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              fontSize: 13.5,
            }}
          >
            <Row label="Subtotal" value={formatPrice(subtotal)} />

            <Row
              label="Shipping"
              value={shipping === 0 ? "Free" : formatPrice(shipping)}
            />

            {discount > 0 && (
              <Row
               label={`${roles.find(r => r.id === role)?.label || role} discount`}
                value={"−" + formatPrice(discount)}
                valueColor="var(--green)"
              />
            )}

            <div
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: 10,
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <button
            className="uh-btn uh-btn-dark"
            style={{ width: "100%", marginTop: 18 }}
            onClick={() => nav("checkout")}
          >
            Proceed to checkout <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #uh-cart-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
function Row({ label, value, valueColor }) {
  return <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--ink-soft)" }}>{label}</span><span style={{ fontWeight: 600, color: valueColor }}>{value}</span></div>;
}

/* =========================================================================
   CHECKOUT PAGE
   ========================================================================= */
function CheckoutPage({ cart, role, nav, clearCart ,products}) {
  const items = cart.map(c => ({ ...c, product: products.find(p => (p.id || p._id) === c.id)})).filter(c => c.product);
  const subtotal = items.reduce((sum, c) => sum + getProductPrice(c.product, role) * c.qty, 0);
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 79;
  const total = subtotal + shipping;
  const [payment, setPayment] = useState("cod");
  const [placed, setPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", pin: "" });

  useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;

  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}, []);

  const canPlace = form.name && form.phone.length >= 10 && form.address && form.city && form.pin.length === 6;
const handlePlaceOrder = async () => {
  try {
    setPlacingOrder(true);
    setOrderError("");

    const orderData = {
      items: items.map((c) => ({
        product: c.product._id || c.product.id,
        name: c.product.name,
        price: getProductPrice(c.product, role),
        quantity: c.qty,
        image: c.product.images?.[0] || "",
      })),

      totalAmount: total,

      paymentMethod: payment === "cod" ? "cod" : "razorpay",

      shippingAddress: {
        name: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: "",
        pincode: form.pin,
      },
    };

    // =========================
    // CASH ON DELIVERY
    // =========================
    if (payment === "cod") {
      await createOrder(orderData);

        clearCart();
        setPlaced(true);
         return;
    }

    // =========================
    // RAZORPAY PAYMENT
    // =========================

    if (!window.Razorpay) {
      throw new Error(
        "Razorpay is still loading. Please try again."
      );
    }

    // Create Razorpay order from backend
    const razorpayOrder = await createRazorpayOrder(
  orderData.items
);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,

      amount: razorpayOrder.order.amount,

      currency: razorpayOrder.order.currency,

      name: "VC Mart",

      description: "VC Mart Order Payment",

      order_id: razorpayOrder.order.id,

     prefill: {
  name: form.name,
  contact: form.phone,
},



      notes: {
        city: form.city,
        pincode: form.pin,
      },

      theme: {
        color: "#B98A45",
      },
handler: async function (response) {
  try {
    setPlacingOrder(true);

    console.log("Razorpay Payment Successful:", response);

    // 1️⃣ Verify payment on backend
    await verifyRazorpayPayment({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    });

    console.log("Razorpay Payment Verified Successfully ✅");

    // 2️⃣ Create order only after successful verification
    await createOrder({
      ...orderData,
      paymentMethod: "razorpay",
      paymentStatus: "paid",
      razorpayPaymentId: response.razorpay_payment_id,
      razorpayOrderId: response.razorpay_order_id,
      razorpaySignature: response.razorpay_signature,
    });

    // 3️⃣ Show existing confirmation page
    clearCart();
    setPlaced(true);
  } catch (error) {
    console.error("Payment verification/order creation failed:", error);

    setOrderError(
      error.message ||
        "Payment verification failed. Please contact support."
    );
  } finally {
    setPlacingOrder(false);
  }
},

      modal: {
        ondismiss: function () {
          setPlacingOrder(false);
          setOrderError("Payment cancelled.");
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", function (response) {
      console.log(
  "RAZORPAY ERROR:",
  JSON.stringify(response.error, null, 2)
);

      setOrderError(
        response.error?.description ||
          "Payment failed. Please try again."
      );

      setPlacingOrder(false);
    });

    razorpay.open();
  } catch (error) {
    console.error("Order creation failed:", error);

    setOrderError(
      error.message || "Failed to place order"
    );

    setPlacingOrder(false);
  }
};

  if (items.length === 0 && !placed) {
    return <div className="uh-container" style={{ padding: 60 }}><EmptyState icon={ShoppingCart} title="Nothing to checkout" body="Add items to your cart before proceeding to checkout." actionLabel="Browse products" onAction={() => nav("home")} /></div>;
  }

  if (placed) {
    return (
      <div className="uh-container" style={{ padding: "70px 24px", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#E5F3EA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Check size={30} color="var(--green)" />
        </div>
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>Order placed (demo)</h2>
        <p style={{ color: "var(--ink-soft)", maxWidth: 420, margin: "0 auto 22px" }}>This is a mock checkout for the Phase 1 frontend demo \u2014 no real payment was processed. Order confirmation and tracking will connect once the backend is live.</p>
        <button
        className="uh-btn uh-btn-dark"
        onClick={() => {
          clearCart();
          nav("home");
        }}
      >
        Continue shopping
      </button>

{orderError && (
  <p style={{ fontSize: 12, color: "#C62828", marginTop: 8 }}>
    {orderError}
  </p>
)}
      </div>
    );
  }

 

  return (
    <div className="uh-container" style={{ padding: "28px 24px 60px" }}>
      <Breadcrumb items={[{ label: "Cart", page: "cart" }, { label: "Checkout" }]} onNavigate={nav} />
      <h1 style={{ fontSize: 25, margin: "14px 0 22px" }}>Checkout</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 30 }} id="uh-checkout-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="uh-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 15.5, marginBottom: 14 }}>Delivery address</h3>
            <div className="uh-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label className="uh-label">Full name</label><input className="uh-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" /></div>
              <div><label className="uh-label">Phone number</label><input className="uh-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value.replace(/\D/g,"")})} placeholder="10-digit mobile" maxLength={10} /></div>
              <div style={{ gridColumn: "1/3" }}><label className="uh-label">Address</label><input className="uh-input" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="House no, street, area" /></div>
              <div><label className="uh-label">City</label><input className="uh-input" value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="City" /></div>
              <div><label className="uh-label">PIN code</label><input className="uh-input" value={form.pin} onChange={e => setForm({...form, pin: e.target.value.replace(/\D/g,"")})} placeholder="6-digit PIN" maxLength={6} /></div>
            </div>
          </div>
          <div className="uh-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 15.5, marginBottom: 14 }}>Payment method</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[{ id: "upi", label: "UPI" }, { id: "card", label: "Credit / Debit card" }, { id: "netbanking", label: "Net banking" }, { id: "cod", label: "Cash on delivery" }].map(m => (
                <label key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, border: "1.5px solid " + (payment === m.id ? "var(--primary)" : "var(--border)"), borderRadius: 8, padding: "11px 14px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  <input type="radio" name="pay" checked={payment === m.id} onChange={() => setPayment(m.id)} /> {m.label}
                </label>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12, display: "flex", gap: 6, alignItems: "flex-start" }}><ShieldQuestion size={14} style={{ flexShrink: 0, marginTop: 1 }} /> Payment gateway is mocked for this demo; Razorpay integration is planned for the connected backend.</p>
          </div>
        </div>
        <div className="uh-card" style={{ padding: 20, height: "fit-content" }}>
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>Order summary</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14, maxHeight: 200, overflowY: "auto" }}>
            {items.map(c => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--ink-soft)" }}>{c.product.name} x{c.qty}</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(getProductPrice(c.product, role) * c.qty)}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13.5, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16 }}><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
          <button className="uh-btn uh-btn-dark" style={{ width: "100%", marginTop: 16 }} disabled={!canPlace} onClick={handlePlaceOrder}>{placingOrder ? "Placing order..." : "Place order"}</button>
          {orderError && (
  <p style={{ fontSize: 12, color: "#C62828", marginTop: 8 }}>
    {orderError}
  </p>
)}
          {!canPlace && <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>Fill delivery details to continue.</p>}
        </div>
      </div>
      <style>{`@media (max-width: 900px) { #uh-checkout-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

function ResetPasswordPage({ nav, token, email }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
       `${API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            token,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to reset password."
        );
      }

      setSuccess(true);
      setMessage("Your password has been reset successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(error.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="uh-container"
      style={{
        padding: "50px 24px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="uh-card"
        style={{
          width: 400,
          padding: 30,
        }}
      >
        {!success ? (
          <>
            <h2
              style={{
                margin: "0 0 8px",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Reset Password
            </h2>

            <p
              style={{
                fontSize: 13,
                color: "var(--muted)",
                lineHeight: 1.6,
                marginBottom: 22,
              }}
            >
              Create a new password for your VC Mart account.
            </p>

            <form
              onSubmit={submit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div>
                <label className="uh-label">
                  New password
                </label>

                <input
                  type="password"
                  className="uh-input"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label className="uh-label">
                  Confirm password
                </label>

                <input
                  type="password"
                  className="uh-input"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm new password"
                  required
                />
              </div>

              {error && (
                <p
                  style={{
                    fontSize: 12.5,
                    color: "var(--red)",
                    margin: 0,
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="uh-btn uh-btn-dark"
                style={{ marginTop: 6 }}
                disabled={loading}
              >
                {loading ? "Updating..." : "Reset password"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2
              style={{
                margin: "0 0 8px",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Password Updated
            </h2>

            <p
              style={{
                fontSize: 13,
                color: "var(--muted)",
                lineHeight: 1.6,
                marginBottom: 22,
              }}
            >
              {message}
            </p>

            <button
              type="button"
              className="uh-btn uh-btn-dark"
             onClick={() => {
  window.history.replaceState({}, "", "/");
  nav("auth");
}}
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function VerifyEmailPage({ nav }) {
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  const verificationStarted = useRef(false);

  useEffect(() => {
    if (verificationStarted.current) return;

  verificationStarted.current = true;
    const verifyEmail = async () => {
      try {
        const params = new URLSearchParams(window.location.search);

        const token = params.get("token");
        const email = params.get("email");

        if (!token || !email) {
          setStatus("error");
          setMessage("Invalid email verification link.");
          return;
        }

        const response = await fetch(
          `${API_URL}/auth/verify-email?token=${encodeURIComponent(
            token
          )}&email=${encodeURIComponent(email)}`
        );

        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          setMessage(
            data.message || "Unable to verify your email."
          );
          return;
        }

        setStatus("success");
        setMessage(
          data.message || "Email verified successfully. You can now login."
        );
      } catch (error) {
        console.error("EMAIL VERIFICATION ERROR:", error);

        setStatus("error");
        setMessage("Something went wrong while verifying your email.");
      }
    };

    verifyEmail();
  }, []);

  return (
    <div
      className="uh-container"
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        className="uh-card"
        style={{
          width: "100%",
          maxWidth: 500,
          padding: 30,
          textAlign: "center",
        }}
      >
        {status === "verifying" && (
          <>
            <h2 style={{ marginBottom: 10 }}>
              Verifying your email...
            </h2>

            <p
              style={{
                color: "var(--muted)",
                fontSize: 14,
              }}
            >
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 style={{ marginBottom: 10 }}>
              Email Verified ✓
            </h2>

            <p
              style={{
                color: "var(--ink-soft)",
                fontSize: 14,
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              {message}
            </p>

            <button
  type="button"
  className="uh-btn uh-btn-dark"
  onClick={() => {
    window.history.replaceState({}, "", "/");
    nav("auth");
  }}
>
  Go to Login
</button>
          </>
        )}

        {status === "error" && (
          <>
            <h2 style={{ marginBottom: 10 }}>
              Verification Failed
            </h2>

            <p
              style={{
                color: "var(--red)",
                fontSize: 14,
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              {message}
            </p>

            <button
              type="button"
              className="uh-btn uh-btn-dark"
              onClick={() => nav("auth")}
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   AUTH / PROFILE / ORDERS / WISHLIST PAGES
   ========================================================================= */
function AuthPage({ nav, login }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
  e.preventDefault();

  if (!form.email.includes("@") || form.password.length < 6) {
    setError(
      "Enter a valid email and a password with at least 6 characters."
    );
    return;
  }

  if (mode === "register" && !form.name.trim()) {
    setError("Please enter your name.");
    return;
  }

  try {
    setLoading(true);
    setError("");
    setSuccess("");

    // =========================
    // REGISTER
    // =========================
    if (mode === "register") {
      await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      // Registration successful
      // Auto login nahi hoga
      setSuccess(
  "Registration successful! Please check your email and click the verification link to activate your account."
);
      setMode("login");

      setForm({
        name: "",
        email: form.email,
        password: "",
      });

      return;
    }

    // =========================
    // LOGIN
    // =========================
    const data = await loginUser({
      email: form.email.trim(),
      password: form.password,
    });

    // Token sirf login ke baad save hoga
    localStorage.setItem("vc_token", data.token);
    localStorage.setItem("vc_user", JSON.stringify(data.user));

    login({
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
    });

    nav("home");

  } catch (error) {
    setError(error.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

const forgotPasswordSubmit = async (e) => {
  e.preventDefault();

  if (!form.email.includes("@")) {
    setError("Please enter a valid email address.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const response = await fetch(
      `${API_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to send reset link."
      );
    }

    alert(
      "If an account exists with this email, a password reset link has been sent."
    );

    setMode("login");
    setForm({
      name: "",
      email: form.email,
      password: "",
    });
  } catch (error) {
    setError(
      error.message || "Unable to process password reset request."
    );
  } finally {
    setLoading(false);
  }
};
if (mode === "forgot") {
  return (
    <div
      className="uh-container"
      style={{
        padding: "50px 24px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="uh-card"
        style={{
          width: 400,
          padding: 30,
        }}
      >
        <h2
          style={{
            margin: "0 0 8px",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Forgot Password?
        </h2>

        <p
          style={{
            fontSize: 13,
            color: "var(--muted)",
            lineHeight: 1.6,
            marginBottom: 22,
          }}
        >
          Enter your registered email address and we'll send you a
          secure password reset link.
        </p>

        <form
          onSubmit={forgotPasswordSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div>
            <label className="uh-label">Email</label>

            <input
              type="email"
              className="uh-input"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              placeholder="you@email.com"
              required
            />
          </div>

          {error && (
            <p
              style={{
                fontSize: 12.5,
                color: "var(--red)",
                margin: 0,
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="uh-btn uh-btn-dark"
            style={{ marginTop: 6 }}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>

          <button
            type="button"
            className="uh-btn"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            style={{
              background: "var(--bg)",
              color: "var(--ink)",
            }}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}
  return (
    <div className="uh-container" style={{ padding: "50px 24px", display: "flex", justifyContent: "center" }}>
      <div className="uh-card" style={{ width: 400, padding: 30 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          <button onClick={() => setMode("login")} className="uh-btn" style={{ flex: 1, background: mode === "login" ? "var(--primary)" : "var(--bg)", color: mode === "login" ? "#fff" : "var(--ink)" }}>Login</button>
          <button onClick={() => setMode("register")} className="uh-btn" style={{ flex: 1, background: mode === "register" ? "var(--primary)" : "var(--bg)", color: mode === "register" ? "#fff" : "var(--ink)" }}>Register</button>
        </div>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "register" && (<div><label className="uh-label">Full name</label><input className="uh-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" /></div>)}
          <div><label className="uh-label">Email</label><input type="email" className="uh-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@email.com" /></div>
          <div><label className="uh-label">Password</label><input type="password" className="uh-input" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Create a password" /></div>
          {mode === "login" && (
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      setMode("forgot");
      setError("");
    }}
    style={{
      fontSize: 12.5,
      color: "var(--primary)",
      fontWeight: 600,
      alignSelf: "flex-end",
      cursor: "pointer",
    }}
  >
    Forgot password?
  </a>
)}
{success && (
  <p
    style={{
      fontSize: 12.5,
      color: "var(--green)",
      lineHeight: 1.5,
      margin: 0,
    }}
  >
    {success}
  </p>
)}
          {error && <p style={{ fontSize: 12.5, color: "var(--red)" }}>{error}</p>}
          <button className="uh-btn uh-btn-dark" style={{ marginTop: 6 }}>{mode === "login" ? "Login" : "Create account"}</button>
        </form>
        <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 16, textAlign: "center" }}>Demo authentication only \u2014 connects to real JWT auth once backend is live.</p>
      </div>
    </div>
  );
}

function ProfilePage({ user, role, setRole, nav, logout }) {
  if (!user) return <div className="uh-container" style={{ padding: 60 }}><EmptyState icon={User} title="You're not logged in" body="Log in to view your profile, orders and saved details." actionLabel="Login" onAction={() => nav("auth")} /></div>;
  return (
    <div className="uh-container" style={{ padding: "28px 24px 60px", maxWidth: 640 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>My profile</h1>
      <div className="uh-card" style={{ padding: 22, display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20, fontFamily: "'Space Grotesk', sans-serif" }}>{user.name[0].toUpperCase()}</div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 16 }}>{user.name}</p>
          <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>{user.email}</p>
        </div>
      </div>
      <div className="uh-card" style={{ padding: 22, marginBottom: 20 }}>
        <p style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 12 }}>Account type</p>
        <div style={{ display: "flex", gap: 10 }}>
          {roles.map(r => (
            <button key={r.id} onClick={() => setRole(r.id)} className="uh-btn" style={{ background: role === r.id ? "var(--accent)" : "var(--bg)", color: role === r.id ? "#fff" : "var(--ink)", flex: 1 }}>{r.label}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <a onClick={() => nav("orders")} className="uh-card" style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><span style={{ fontWeight: 600, fontSize: 14 }}>My orders</span><ChevronRight size={16} /></a>
        <a onClick={() => nav("wishlist")} className="uh-card" style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><span style={{ fontWeight: 600, fontSize: 14 }}>Wishlist</span><ChevronRight size={16} /></a>
        <button onClick={() => { logout(); nav("home"); }} className="uh-btn uh-btn-outline" style={{ justifyContent: "flex-start", marginTop: 6 }}><LogOut size={15} /> Logout</button>
      </div>
    </div>
  );
}

function OrdersPage({ nav }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyOrders();
        setOrders(data || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setError(error.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div
        className="uh-container"
        style={{ padding: 60, textAlign: "center" }}
      >
        <p style={{ color: "var(--muted)" }}>
          Loading your orders...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="uh-container"
        style={{ padding: 60, textAlign: "center" }}
      >
        <p style={{ color: "#C62828" }}>{error}</p>

        <button
          className="uh-btn uh-btn-dark"
          onClick={() => nav("home")}
        >
          Back to shopping
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div
        className="uh-container"
        style={{ padding: 60 }}
      >
        <EmptyState
          icon={ClipboardList}
          title="No orders yet"
          body="Orders you place will show up here."
          actionLabel="Start shopping"
          onAction={() => nav("home")}
        />
      </div>
    );
  }

  return (
    <div
      className="uh-container"
      style={{ padding: "28px 24px 60px" }}
    >
      <h1 style={{ fontSize: 25, marginBottom: 22 }}>
        My Orders
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {orders.map((order) => (
          <div
            key={order._id}
            className="uh-card"
            style={{ padding: 20 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    marginBottom: 4,
                  }}
                >
                  Order #{order._id.slice(-8)}
                </p>

                <p
                  style={{
                    fontSize: 12,
                    color: "var(--muted)",
                    margin: 0,
                  }}
                >
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

  <span
  style={{
    padding: "7px 10px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--ink)",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "capitalize",
  }}
>
  {order.status}
</span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                borderTop: "1px solid var(--border)",
                paddingTop: 12,
              }}
            >
              {order.items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "var(--ink-soft)" }}>
                    {item.name} × {item.quantity}
                  </span>

                  <span style={{ fontWeight: 600 }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                borderTop: "1px solid var(--border)",
                marginTop: 14,
                paddingTop: 12,
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
              }}
            >
              <span>Total</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WishlistPage({ wishlist, nav, role, onAddToCart, onToggleWishlist,products}) {
  const items = wishlist.map(id => products.find(p => (p.id || p._id) === id)).filter(Boolean);
  if (items.length === 0) return <div className="uh-container" style={{ padding: 60 }}><EmptyState icon={Heart} title="Your wishlist is empty" body="Save products you love and find them here anytime." actionLabel="Browse products" onAction={() => nav("home")} /></div>;
  return (
    <div className="uh-container" style={{ padding: "28px 24px 60px" }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Wishlist <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 15 }}>({items.length})</span></h1>
      <div className="uh-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }} id="uh-wishlist-grid">
        {items.map(p => <ProductCard key={p.id} product={p} role={role} onOpen={id => nav("product", { id })} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} wished={wishlist.includes(p.id)} />)}
      </div>
      <style>{`@media (max-width: 900px) { #uh-wishlist-grid { grid-template-columns: repeat(2,1fr) !important; } }`}</style>
    </div>
  );
}

/* =========================================================================
   ABOUT / CONTACT / POLICY / 404
   ========================================================================= */
function SimplePage({ title, children }) {
  return (
    <div className="uh-container" style={{ padding: "40px 24px 70px", maxWidth: 780 }}>
      <h1 style={{ fontSize: 27, marginBottom: 18 }}>{title}</h1>
      <div style={{ color: "var(--ink-soft)", fontSize: 14.5, lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
    </div>
  );
}

function AboutPage() {
  return (
    <SimplePage title="About VC Mart">
      <p>
        VC Mart is a multi-category shopping platform bringing
        Clothing & Fashion, Mobile & Electronics, and Bike Spare Parts
        together in one place.
      </p>

      <p>
        Our goal is to provide customers with a simple, convenient and
        reliable shopping experience, with products and services from
        trusted local businesses.
      </p>

      <p>
        VC Mart currently features three stores:
        <strong> Vinayak Collection</strong>,
        <strong> Khushi Communication</strong>, and
        <strong> Kinushk Spare Parts</strong>.
      </p>

      <p>
        We are committed to providing genuine products, clear pricing
        and helpful customer support.
      </p>
    </SimplePage>
  );
}
function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <SimplePage title="Contact us">
      <p>Have a question about an order, bulk pricing, or becoming a reseller partner? Reach out and our team will get back within one business day.</p>
      <div className="uh-grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 6 }}>
  <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
    <Phone size={16} /> Vinayak Collection: 8684933759 / 9625747346
  </span>

  <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
    <Phone size={16} /> Khushi Communication: 8396831521
  </span>

  <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
    <Phone size={16} /> Kinushk Spare Parts: 8259403529
  </span>

  <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
    <MapPin size={16} />
    {siteConfig.address}
  </span>
</div>
      {sent ? (
        <p style={{ color: "var(--green)", fontWeight: 700, display: "flex", gap: 6, alignItems: "center" }}><Check size={16} /> Message sent \u2014 we'll be in touch shortly.</p>
      ) : (
        <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 6, maxWidth: 420 }}>
          <input required className="uh-input" placeholder="Your name" />
          <input required type="email" className="uh-input" placeholder="you@email.com" />
          <textarea required className="uh-input" rows={4} placeholder="How can we help?" />
          <button className="uh-btn uh-btn-dark" style={{ alignSelf: "flex-start" }}>Send message</button>
        </form>
      )}
    </SimplePage>
  );
}
function PolicyPage({ type }) {
  const content = {
    shipping: {
      title: "Shipping policy",
      sections: [
        {
          heading: "Order processing",
          text: "Orders are generally processed and dispatched within 1–3 business days after order confirmation and payment verification."
        },
        {
          heading: "Delivery time",
          text: "Standard delivery usually takes 3–7 business days after dispatch. Delivery times may vary depending on location, product availability and courier service. Remote areas may take longer."
        },
        {
          heading: "Shipping charges",
          text: "Shipping charges, if applicable, are shown at checkout before placing the order. Additional charges may apply for Cash on Delivery where applicable."
        },
        {
          heading: "Separate deliveries",
          text: "Products from different stores or locations may be delivered separately."
        },
        {
          heading: "Tracking & delays",
          text: "Tracking details may be shared through SMS, WhatsApp or email. Delivery may be delayed due to courier issues, weather, natural events, strikes, government restrictions or incorrect/incomplete address details."
        }
      ]
    },

    returns: {
      title: "Returns & refunds policy",
      sections: [
        {
          heading: "General return policy",
          text: "Eligible products may generally be returned within 7 days of delivery unless a different period is mentioned on the product page. Products must be unused, undamaged and in their original condition with applicable packaging, tags and accessories."
        },
        {
          heading: "Damaged, defective or wrong product",
          text: "If you receive a damaged, defective or wrong product, or a missing item/accessory, contact VC Mart customer support as soon as possible with your order details and supporting photos/videos. After verification, a replacement, exchange or refund may be provided."
        },
        {
          heading: "Clothing & fashion",
          text: "Clothing must be unused and unwashed with original tags attached where applicable. Products showing signs of washing, alteration, use, perfume, stains or damage may not be eligible. Size exchanges/returns are subject to the product page terms."
        },
        {
          heading: "Mobile & electronics",
          text: "Mobile and electronic products may be subject to manufacturer warranty terms. Serial number or IMEI verification may be required. Products damaged due to misuse, physical or liquid damage, unauthorized repair or improper handling may not qualify for return or refund."
        },
        {
          heading: "Bike spare parts & accessories",
          text: "Customers are responsible for checking vehicle compatibility, model, variant and specifications before ordering. Installed, fitted, modified, used or damaged parts may not be eligible for return. Product-specific and manufacturer policies may apply."
        },
        {
          heading: "Non-returnable products",
          text: "Certain products may not be eligible for return due to their nature, hygiene, customization, installation or other restrictions. Such products will be marked on the product page wherever applicable."
        },
        {
          heading: "Refund process",
          text: "Returned products are inspected before a refund is approved. Approved refunds are generally processed through the original payment method or another suitable method depending on the payment type. Processing time may vary by the payment provider or bank."
        },
        {
          heading: "Cancellation",
          text: "Orders may be cancelled before dispatch, subject to order status and product-specific conditions. Once shipped, cancellation may not be possible and the applicable return process may apply."
        },
        {
          heading: "Important note",
          text: "Product-specific return, warranty and replacement conditions mentioned on the product page will take precedence wherever applicable."
        }
      ]
    },

    terms: {
      title: "Terms & conditions",
      sections: [
        {
          heading: "Use of VC Mart",
          text: "By using VC Mart, customers agree to provide accurate information and use the website only for lawful purchases."
        },
        {
          heading: "Products & pricing",
          text: "Product prices, availability, specifications and offers may change without prior notice."
        },
        {
          heading: "Product-specific conditions",
          text: "Product-specific warranty, return, exchange and replacement conditions mentioned on the product page will apply wherever applicable."
        },
        {
          heading: "Orders",
          text: "VC Mart reserves the right to cancel or restrict orders in cases of incorrect information, misuse or other valid business reasons."
        }
      ]
    },

    privacy: {
      title: "Privacy policy",
      sections: [
        {
          heading: "Information we collect",
          text: "VC Mart may collect information such as your name, contact details and delivery address when required to process orders and provide services."
        },
        {
          heading: "How we use your information",
          text: "Customer information is used for order processing, delivery, customer support and related services."
        },
        {
          heading: "Your information",
          text: "We do not sell customer personal information to third parties."
        },
        {
          heading: "Payment information",
          text: "Payment information is processed securely through the applicable payment provider and is not stored directly by VC Mart."
        }
      ]
    }
  }[type] || {
    title: "Policy",
    sections: []
  };

  return (
    <SimplePage title={content.title}>
      {content.sections.map((section, index) => (
        <div key={index} style={{ marginBottom: 18 }}>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            {section.heading}
          </h3>

          <p style={{ margin: 0 }}>
            {section.text}
          </p>
        </div>
      ))}
    </SimplePage>
  );
}
function NotFoundPage({ nav }) {
  return (
    <div className="uh-container" style={{ padding: "90px 24px", textAlign: "center" }}>
      <p style={{ fontSize: 64, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "var(--primary)" }}>404</p>
      <h2 style={{ fontSize: 22, marginBottom: 8 }}>Page not found</h2>
      <p style={{ color: "var(--ink-soft)", marginBottom: 22 }}>The page you're looking for doesn't exist or may have moved.</p>
      <button className="uh-btn uh-btn-dark" onClick={() => nav("home")}>Back to home</button>
    </div>
  );
}

/* =========================================================================
   ADMIN DASHBOARD
   ========================================================================= */
function AdminShell({ tab, setTab, children, nav }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ClipboardList },
    { id: "customers", label: "Customers", icon: Users },
    { id: "inventory", label: "Inventory", icon: Boxes },
    { id: "settings", label: "Settings", icon: Settings },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: 560 }} id="uh-admin-grid">
      <aside style={{ background: "var(--primary)", padding: "20px 14px" }}>
        <a onClick={() => nav("home")} style={{ color: "#fff", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, display: "block", padding: "0 8px 20px" }}>{siteConfig.siteName} <span style={{ color: "var(--accent)", fontSize: 12, fontWeight: 700 }}>ADMIN</span></a>
        {navItems.map(it => (
          <a key={it.id} onClick={() => setTab(it.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 10px", borderRadius: 8, fontSize: 13.5, fontWeight: 600, color: tab === it.id ? "#fff" : "rgba(255,255,255,.6)", background: tab === it.id ? "rgba(255,255,255,.1)" : "transparent", marginBottom: 2 }}>
            <it.icon size={16} /> {it.label}
          </a>
        ))}
      </aside>
      <div style={{ padding: "26px 30px", background: "var(--bg)", overflowX: "auto" }}>{children}</div>
      <style>{`@media (max-width: 820px) { #uh-admin-grid { grid-template-columns: 1fr !important; } #uh-admin-grid > aside { display: flex; overflow-x: auto; gap: 6px; padding: 10px !important; } #uh-admin-grid > aside a { white-space: nowrap; padding: 8px 12px !important; } }`}</style>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <div className="uh-card" style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 12.5, color: "var(--ink-soft)", fontWeight: 600 }}>{label}</p>
          <p style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", margin: "6px 0 2px" }}>{value}</p>
          {sub && <p style={{ fontSize: 11.5, color: "var(--green)" }}>{sub}</p>}
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: accent || "var(--accent-tint)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={17} color="var(--accent-dark)" />
        </div>
      </div>
    </div>
  );
}

function MiniBarChart({ data }) {
  const max = Math.max(...data.map(d => d.value), 0) || 1;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 160, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ width: "100%", height: (d.value / max) * 130, background: "var(--primary)", borderRadius: 4 }} title={d.value} />
          <span style={{ fontSize: 10.5, color: "var(--muted)" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function AdminDashboard({ nav, products, refreshProducts }) {
  const [tab, setTab] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
  if (tab !== "orders" && tab !== "dashboard") return;

  const fetchAllOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError("");

      const data = await getAllOrders();
      setOrders(data || []);
    } catch (error) {
      console.error("Failed to fetch admin orders:", error);
      setOrdersError(error.message || "Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  fetchAllOrders();
}, [tab]);

  const [userStats, setUserStats] = useState({ totalUsers: 0, customers: 0, wholesale: 0, reseller: 0 });
  const [userStatsLoading, setUserStatsLoading] = useState(false);
  const [userStatsError, setUserStatsError] = useState("");

  useEffect(() => {
  if (tab !== "dashboard") return;

  const fetchUserStats = async () => {
    try {
      setUserStatsLoading(true);
      setUserStatsError("");

      const data = await getUserStats();
      setUserStats({
        totalUsers: data.totalUsers || 0,
        customers: data.customers || 0,
        wholesale: data.wholesale || 0,
        reseller: data.reseller || 0,
      });
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
      setUserStatsError(error.message || "Failed to load user stats");
    } finally {
      setUserStatsLoading(false);
    }
  };

  fetchUserStats();
}, [tab]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    store: "clothing",
    category: "",
    brand: "",
    retailPrice: "",
    wholesalePrice: "",
    resellerPrice: "",
    stock: "",
    images: "",
    sizes: "",
    colors: "",
    bikeBrand: "",
    compatible: "",
    sku: "",
    rating: 0,
    reviews: 0,
    badge: "",
    isActive: true,
  });

  // A "valid" order counts toward sales/revenue — not cancelled, not a failed payment.
  const isValidOrder = (o) => o.status !== "cancelled" && o.paymentStatus !== "failed";

  const orderStats = useMemo(() => {
    const now = new Date();

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const salesLast30d = orders
      .filter((o) => isValidOrder(o) && new Date(o.createdAt) >= thirtyDaysAgo)
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      days.push(d);
    }

    const weekly = days.map((d) => {
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);

      const value = orders
        .filter((o) => {
          if (!isValidOrder(o)) return false;
          const created = new Date(o.createdAt);
          return created >= dayStart && created < dayEnd;
        })
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      return { label: dayLabels[d.getDay()], value };
    });

    return {
      totalOrders: orders.length,
      salesLast30d,
      weekly,
    };
  }, [orders]);

  const weekly = orderStats.weekly;

  const lowStock = products.filter((p) => p.stock < 20);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      store: "clothing",
      category: "",
      brand: "",
      retailPrice: "",
      wholesalePrice: "",
      resellerPrice: "",
      stock: "",
      images: "",
      sizes: "",
      colors: "",
      bikeBrand: "",
      compatible: "",
      sku: "",
      rating: 0,
      reviews: 0,
      badge: "",
      isActive: true,
    });

    setEditingProduct(null);
  };

  const openAddProduct = () => {
    resetForm();
    setShowProductForm(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      description: product.description || "",
      store: product.store || "clothing",
      category: product.category || "",
      brand: product.brand || "",
      retailPrice: product.retailPrice ?? "",
      wholesalePrice: product.wholesalePrice ?? "",
      resellerPrice: product.resellerPrice ?? "",
      stock: product.stock ?? "",
      images: (product.images || []).join(", "),
      sizes: (product.sizes || []).join(", "),
      colors: (product.colors || []).join(", "),
      bikeBrand: product.bikeBrand || "",
      compatible: (product.compatible || []).join(", "),
      sku: product.sku || "",
      rating: product.rating ?? 0,
      reviews: product.reviews ?? 0,
      badge: product.badge || "",
      isActive: product.isActive !== false,
    });

    setShowProductForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        store: form.store,
        category: form.category.trim(),
        brand: form.brand.trim(),

        retailPrice: Number(form.retailPrice),
        wholesalePrice: Number(form.wholesalePrice),
        resellerPrice: Number(form.resellerPrice),
        stock: Number(form.stock),

        images: form.images
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        sizes: form.sizes
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        colors: form.colors
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        bikeBrand: form.bikeBrand.trim(),

        compatible: form.compatible
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        sku: form.sku.trim(),

        rating: Number(form.rating) || 0,
        reviews: Number(form.reviews) || 0,

        badge: form.badge.trim() || null,

        isActive: form.isActive,
      };

      if (editingProduct) {
        await updateProduct(
          editingProduct.id || editingProduct._id,
          productData
        );

        alert("Product updated successfully ✅");
      } else {
        await createProduct(productData);

        alert("Product added successfully ✅");
      }

      setShowProductForm(false);
      resetForm();

      if (refreshProducts) {
        await refreshProducts();
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    const productId = product.id || product._id;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      await deleteProduct(productId);

      alert("Product deleted successfully ✅");

      if (refreshProducts) {
        await refreshProducts();
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to delete product");
    }
  };

  return (
    <AdminShell tab={tab} setTab={setTab} nav={nav}>

      {/* ================= DASHBOARD ================= */}

      {tab === "dashboard" && (
        <div>
          <h1 style={{ fontSize: 22, marginBottom: 20 }}>
            Dashboard
          </h1>

          <div
            className="uh-grid"
            style={{
              gridTemplateColumns: "repeat(4,1fr)",
              marginBottom: 20,
            }}
            id="uh-admin-stats"
          >
            <StatCard
              label="Total sales (30d)"
              value={ordersLoading ? "…" : formatPrice(orderStats.salesLast30d)}
              icon={TrendingUp}
            />

            <StatCard
              label="Total orders"
              value={ordersLoading ? "…" : orderStats.totalOrders.toLocaleString("en-IN")}
              icon={ClipboardList}
            />

            <StatCard
              label="Total products"
              value={products.length}
              icon={Package}
            />

            <StatCard
              label="Total customers"
              value={userStatsLoading ? "…" : userStats.totalUsers.toLocaleString("en-IN")}
              icon={Users}
            />
          </div>

          <div
            className="uh-grid"
            style={{
              gridTemplateColumns: "repeat(3,1fr)",
              marginBottom: 20,
            }}
          >
            <StatCard
              label="Retail customers"
              value={userStatsLoading ? "…" : userStats.customers.toLocaleString("en-IN")}
              icon={User}
            />

            <StatCard
              label="Wholesalers"
              value={userStatsLoading ? "…" : userStats.wholesale.toLocaleString("en-IN")}
              sub="Currently disabled — will grow once enabled"
              icon={Boxes}
            />

            <StatCard
              label="Resellers"
              value={userStatsLoading ? "…" : userStats.reseller.toLocaleString("en-IN")}
              sub="Currently disabled — will grow once enabled"
              icon={TrendingUp}
            />
          </div>

          {userStatsError && (
            <p style={{ fontSize: 12.5, color: "var(--red)", marginBottom: 16 }}>
              Couldn't load customer stats: {userStatsError}
            </p>
          )}

          <div
            className="uh-grid"
            style={{
              gridTemplateColumns: "1.4fr 1fr",
            }}
            id="uh-admin-lower"
          >
            <div className="uh-card" style={{ padding: 20 }}>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 14.5,
                  marginBottom: 16,
                }}
              >
                Revenue this week
              </p>

              <MiniBarChart data={weekly} />
            </div>

            <div className="uh-card" style={{ padding: 20 }}>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 14.5,
                  marginBottom: 14,
                }}
              >
                Low stock products
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  maxHeight: 190,
                  overflowY: "auto",
                }}
              >
                {lowStock.slice(0, 6).map((p) => (
                  <div
                    key={p.id || p._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12.5,
                    }}
                  >
                    <span style={{ color: "var(--ink-soft)" }}>
                      {p.name}
                    </span>

                    <span
                      style={{
                        fontWeight: 700,
                        color: "var(--red)",
                      }}
                    >
                      {p.stock} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style>{`
            @media (max-width: 900px) {
              #uh-admin-stats,
              #uh-admin-lower {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </div>
      )}

      {/* ================= PRODUCTS ================= */}

      {tab === "products" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <h1 style={{ fontSize: 22 }}>
              Products
            </h1>

            <button
              className="uh-btn uh-btn-primary"
              onClick={openAddProduct}
            >
              <Plus size={15} />
              Add product
            </button>
          </div>

          <div
            className="uh-card"
            style={{
              overflow: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
                minWidth: 850,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "var(--bg)",
                    textAlign: "left",
                  }}
                >
                  {[
                    "Product",
                    "Store",
                    "Brand",
                    "Retail",
                    "Stock",
                    "SKU",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 14px",
                        fontSize: 11.5,
                        color: "var(--ink-soft)",
                        fontWeight: 700,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {products.slice(0, 50).map((p) => (
                  <tr
                    key={p.id || p._id}
                    style={{
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 14px",
                        fontWeight: 600,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <img
                          src={
                            p.images?.[0] ||
                            "https://via.placeholder.com/40"
                          }
                          alt={p.name}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 5,
                            objectFit: "cover",
                          }}
                        />

                        {p.name}
                      </div>
                    </td>

                    <td style={{ padding: "10px 14px" }}>
                      {storeOf(p.store)?.name || p.store}
                    </td>

                    <td style={{ padding: "10px 14px" }}>
                      {p.brand || "-"}
                    </td>

                    <td
                      style={{
                        padding: "10px 14px",
                        fontWeight: 700,
                      }}
                    >
                      {formatPrice(p.retailPrice)}
                    </td>

                    <td
                      style={{
                        padding: "10px 14px",
                        color:
                          p.stock < 20
                            ? "var(--red)"
                            : "var(--green)",
                        fontWeight: 700,
                      }}
                    >
                      {p.stock}
                    </td>

                    <td
                      style={{
                        padding: "10px 14px",
                        color: "var(--muted)",
                      }}
                    >
                      {p.sku}
                    </td>

                    <td style={{ padding: "10px 14px" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 7,
                        }}
                      >
                        <button
                          className="uh-btn"
                          onClick={() => openEditProduct(p)}
                        >
                          Edit
                        </button>

                        <button
                          className="uh-btn"
                          onClick={() => handleDeleteProduct(p)}
                          style={{
                            color: "var(--red)",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= ADD / EDIT PRODUCT MODAL ================= */}

      {showProductForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            className="uh-card"
            style={{
              width: "100%",
              maxWidth: 850,
              maxHeight: "90vh",
              overflowY: "auto",
              padding: 24,
              background: "var(--surface)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h2 style={{ fontSize: 20 }}>
                {editingProduct
                  ? "Edit Product"
                  : "Add Product"}
              </h2>

              <button
                className="uh-btn"
                onClick={() => {
                  setShowProductForm(false);
                  resetForm();
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProductSubmit}>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0,1fr))",
                  gap: 15,
                }}
              >

                {/* NAME */}

                <div>
                  <label>Product Name</label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                    placeholder="Classic Cotton Shirt"
                    style={{
                      width: "100%",
                      padding: 10,
                      marginTop: 6,
                    }}
                  />
                </div>

                {/* STORE */}

                <div>
                  <label>Store</label>

                  <select
                    name="store"
                    value={form.store}
                    onChange={handleFormChange}
                    required
                    style={{
                      width: "100%",
                      padding: 10,
                      marginTop: 6,
                    }}
                  >
                    <option value="clothing">
                      Clothing
                    </option>

                    <option value="bike-parts">
                      Bike Spare Parts
                    </option>

                    <option value="mobile-store">
                      Mobile Store
                    </option>
                  </select>
                </div>

                {/* CATEGORY */}

                <div>
                  <label>Category</label>

                  <input
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    required
                    placeholder="Shirts / Brakes / Smartphones"
                    style={{
                      width: "100%",
                      padding: 10,
                      marginTop: 6,
                    }}
                  />
                </div>

                {/* BRAND */}

                <div>
                  <label>Brand</label>

                  <input
                    name="brand"
                    value={form.brand}
                    onChange={handleFormChange}
                    placeholder="Nike / Honda / Samsung"
                    style={{
                      width: "100%",
                      padding: 10,
                      marginTop: 6,
                    }}
                  />
                </div>

                {/* RETAIL */}

                <div>
                  <label>Retail Price</label>

                  <input
                    type="number"
                    name="retailPrice"
                    value={form.retailPrice}
                    onChange={handleFormChange}
                    required
                    min="0"
                    style={{
                      width: "100%",
                      padding: 10,
                      marginTop: 6,
                    }}
                  />
                </div>

                {/* WHOLESALE */}

                <div>
                  <label>Wholesale Price</label>

                  <input
                    type="number"
                    name="wholesalePrice"
                    value={form.wholesalePrice}
                    onChange={handleFormChange}
                    required
                    min="0"
                    style={{
                      width: "100%",
                      padding: 10,
                      marginTop: 6,
                    }}
                  />
                </div>

                {/* RESELLER */}

                <div>
                  <label>Reseller Price</label>

                  <input
                    type="number"
                    name="resellerPrice"
                    value={form.resellerPrice}
                    onChange={handleFormChange}
                    required
                    min="0"
                    style={{
                      width: "100%",
                      padding: 10,
                      marginTop: 6,
                    }}
                  />
                </div>

                {/* STOCK */}

                <div>
                  <label>Stock</label>

                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleFormChange}
                    required
                    min="0"
                    style={{
                      width: "100%",
                      padding: 10,
                      marginTop: 6,
                    }}
                  />
                </div>

                {/* SKU */}

                <div>
                  <label>SKU</label>

                  <input
                    name="sku"
                    value={form.sku}
                    onChange={handleFormChange}
                    required
                    placeholder="VC-SHIRT-001"
                    style={{
                      width: "100%",
                      padding: 10,
                      marginTop: 6,
                    }}
                  />
                </div>

                {/* IMAGES */}

                <div>
                  <label>Image URLs</label>

                  <input
                    name="images"
                    value={form.images}
                    onChange={handleFormChange}
                    placeholder="url1, url2, url3"
                    style={{
                      width: "100%",
                      padding: 10,
                      marginTop: 6,
                    }}
                  />
                </div>

                {/* SIZES */}

                <div>
                  <label>Sizes</label>

                  <input
                    name="sizes"
                    value={form.sizes}
                    onChange={handleFormChange}
                    placeholder="S, M, L, XL"
                    style={{
                      width: "100%",
                      padding: 10,
                      marginTop: 6,
                    }}
                  />
                </div>

                {/* COLORS */}

                <div>
                  <label>Colors</label>

                  <input
                    name="colors"
                    value={form.colors}
                    onChange={handleFormChange}
                    placeholder="Black, White, Blue"
                    style={{
                      width: "100%",
                      padding: 10,
                      marginTop: 6,
                    }}
                  />
                </div>

                {/* BIKE BRAND */}

                <div>
                  <label>Bike Brand</label>

                  <input
                    name="bikeBrand"
                    value={form.bikeBrand}
                    onChange={handleFormChange}
                    placeholder="Honda / Yamaha / Bajaj"
                    style={{
                      width: "100%",
                      padding: 10,
                      marginTop: 6,
                    }}
                  />
                </div>

                {/* COMPATIBLE */}

                <div>
                  <label>Compatible Models</label>

                  <input
                    name="compatible"
                    value={form.compatible}
                    onChange={handleFormChange}
                    placeholder="Activa 6G, Activa 5G"
                    style={{
                      width: "100%",
                      padding: 10,
                      marginTop: 6,
                    }}
                  />
                </div>

                {/* BADGE */}

                <div>
                  <label>Badge</label>

                  <input
                    name="badge"
                    value={form.badge}
                    onChange={handleFormChange}
                    placeholder="New / Bestseller"
                    style={{
                      width: "100%",
                      padding: 10,
                      marginTop: 6,
                    }}
                  />
                </div>

                {/* RATING */}

                <div>
                  <label>Rating</label>

                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    name="rating"
                    value={form.rating}
                    onChange={handleFormChange}
                    style={{
                      width: "100%",
                      padding: 10,
                      marginTop: 6,
                    }}
                  />
                </div>

              </div>

              {/* DESCRIPTION */}

              <div style={{ marginTop: 15 }}>
                <label>Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={4}
                  placeholder="Product description..."
                  style={{
                    width: "100%",
                    padding: 10,
                    marginTop: 6,
                    resize: "vertical",
                  }}
                />
              </div>

              {/* ACTIVE */}

              <div
                style={{
                  marginTop: 15,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleFormChange}
                />

                <label>
                  Product is active
                </label>
              </div>

              {/* BUTTONS */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 22,
                }}
              >
                <button
                  type="button"
                  className="uh-btn"
                  onClick={() => {
                    setShowProductForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="uh-btn uh-btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Add Product"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

     

      {/* ================= OTHER ADMIN TABS ================= */}

{tab === "orders" && (
  <div>
    <h1
      style={{
        fontSize: 22,
        marginBottom: 18,
      }}
    >
      Orders
    </h1>

    {ordersLoading && (
      <div
        className="uh-card"
        style={{
          padding: 30,
          textAlign: "center",
        }}
      >
        <p style={{ color: "var(--muted)", margin: 0 }}>
          Loading orders...
        </p>
      </div>
    )}

    {!ordersLoading && ordersError && (
      <div
        className="uh-card"
        style={{
          padding: 30,
          textAlign: "center",
        }}
      >
        <p style={{ color: "#C62828", marginBottom: 14 }}>
          {ordersError}
        </p>
      </div>
    )}

    {!ordersLoading &&
      !ordersError &&
      orders.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="No orders yet"
          body="Customer orders will appear here."
        />
      )}

    {!ordersLoading &&
      !ordersError &&
      orders.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {orders.map((order) => (
            <div
              key={order._id}
              className="uh-card"
              style={{ padding: 20 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 14,
                  gap: 20,
                }}
              >
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      marginBottom: 4,
                    }}
                  >
                    Order #{order._id.slice(-8)}
                  </p>

                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      margin: 0,
                    }}
                  >
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <select
  value={order.status}
  onChange={async (e) => {
    const newStatus = e.target.value;

    try {
      const updatedOrder = await updateOrderStatus(
        order._id,
        newStatus
      );

      setOrders((prevOrders) =>
        prevOrders.map((item) =>
          item._id === updatedOrder._id
            ? { ...item, status: updatedOrder.status }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert(error.message || "Failed to update order status");
    }
  }}
  style={{
    padding: "7px 10px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--ink)",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    textTransform: "capitalize",
  }}
>
  <option value="pending">Pending</option>
  <option value="confirmed">Confirmed</option>
  <option value="processing">Processing</option>
  <option value="shipped">Shipped</option>
  <option value="delivered">Delivered</option>
  <option value="cancelled">Cancelled</option>
</select>
              </div>

              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: 14,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    marginBottom: 5,
                  }}
                >
                  Customer
                </p>

                <p
                  style={{
                    fontSize: 13,
                    margin: 0,
                    color: "var(--ink-soft)",
                  }}
                >
                  {order.user?.name || "Unknown customer"}
                </p>

                <p
                  style={{
                    fontSize: 12,
                    margin: "3px 0 0",
                    color: "var(--muted)",
                  }}
                >
                  {order.user?.email || "No email"}
                </p>
              </div>

              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  marginTop: 14,
                  paddingTop: 14,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    marginBottom: 10,
                  }}
                >
                  Items
                </p>

                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                      marginBottom: 7,
                    }}
                  >
                    <span style={{ color: "var(--ink-soft)" }}>
                      {item.name} × {item.quantity}
                    </span>

                    <span style={{ fontWeight: 600 }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  marginTop: 14,
                  paddingTop: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 15,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      marginBottom: 3,
                    }}
                  >
                    Payment
                  </p>

                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      margin: 0,
                      textTransform: "uppercase",
                    }}
                  >
                    {order.paymentMethod}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      marginBottom: 3,
                    }}
                  >
                    Payment Status
                  </p>

                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      margin: 0,
                      textTransform: "capitalize",
                    }}
                  >
                    {order.paymentStatus}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      marginBottom: 3,
                    }}
                  >
                    Total
                  </p>

                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      margin: 0,
                    }}
                  >
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
  </div>
)}

{(tab === "customers" ||
  tab === "inventory" ||
  tab === "settings") && (
  <div>
    <h1
      style={{
        fontSize: 22,
        marginBottom: 18,
        textTransform: "capitalize",
      }}
    >
      {tab}
    </h1>

    <EmptyState
      icon={Sparkles}
      title={`${tab.charAt(0).toUpperCase() + tab.slice(1)} module`}
      body="This admin section is scaffolded and ready to connect to live data once the backend API is available."
    />
  </div>
)}

    </AdminShell>
  );
}
/* =========================================================================
   ROOT APP
   ========================================================================= */
export default function App() {
  const [page, setPage] = useState("home");
  const [params, setParams] = useState({});
  const resetToken = new URLSearchParams(window.location.search).get("token");
const resetEmail = new URLSearchParams(window.location.search).get("email");
const isResetPasswordPage =
  window.location.pathname === "/reset-password" &&
  resetToken &&
  resetEmail;
  const isVerifyEmailPage =
  window.location.pathname === "/verify-email";
  const [role, setRole] = useState("retail");
  const [cart, setCart] = useState(() => {
  try {
    const token = localStorage.getItem("vc_token");
    const userData = localStorage.getItem("vc_user");

    if (!token || !userData) {
      return [];
    }

    const user = JSON.parse(userData);
    const cartKey = `vc_cart_${user.email}`;

    const savedCart = localStorage.getItem(cartKey);

    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Failed to restore cart:", error);
    return [];
  }
});
  const [cartOwnerEmail, setCartOwnerEmail] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
 useEffect(() => {
  if (!user?.email) {
    return;
  }

  // Don't save until this user's cart has been loaded.
  if (cartOwnerEmail !== user.email) {
    return;
  }

  try {
    const cartKey = `vc_cart_${user.email}`;
    localStorage.setItem(cartKey, JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart:", error);
  }
}, [cart, user?.email, cartOwnerEmail]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiProducts, setApiProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const PRODUCTS_PER_PAGE = 12;

 const fetchProducts = useCallback(async (page = 1) => {
  try {
    const data = await getProducts(page, PRODUCTS_PER_PAGE);

    const productList = Array.isArray(data)
      ? data
      : (data.products || []);

    setApiProducts(productList);

    if (!Array.isArray(data) && data.pagination) {
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
    }
  } catch (error) {
    console.error("Failed to load products:", error);
  } finally {
    setLoadingProducts(false);
  }
}, []);

useEffect(() => {
  fetchProducts();
}, [fetchProducts]);

// Restore logged-in user after page refresh
useEffect(() => {
  const restoreUser = async () => {
    try {
      const currentUser = await getCurrentUser();

      if (currentUser) {
        setUser({
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
        });
      }
    } catch (error) {
      console.error("Failed to restore user:", error);
      // Remove expired/invalid session
      localStorage.removeItem("vc_token");
      localStorage.removeItem("vc_user");
      setUser(null);
      setRole("retail");
    }
  };

  restoreUser();
}, []);

useEffect(() => {
  if (!user?.email) {
    setCartOwnerEmail(null);
    setCart([]);
    return;
  }

  // Mark cart as not loaded while switching/restoring user.
  setCartOwnerEmail(null);

  try {
    const cartKey = `vc_cart_${user.email}`;
    const savedCart = localStorage.getItem(cartKey);

    setCart(savedCart ? JSON.parse(savedCart) : []);
    setCartOwnerEmail(user.email);
  } catch (error) {
    console.error("Failed to load user cart:", error);
    setCart([]);
    setCartOwnerEmail(user.email);
  }
}, [user?.email]);

const products = loadingProducts ? [] : apiProducts;
const normalizedProducts = products.map((product) => ({
  ...product,
  id: product.id || product._id,

  sizes: Array.isArray(product.sizes)
    ? product.sizes
        .map((s) => {
          if (typeof s === "string") return s.trim();

          if (typeof s === "object" && s !== null) {
            return String(
              s.name ||
              s.value ||
              s.label ||
              s.size ||
              ""
            ).trim();
          }

          return String(s || "").trim();
        })
        .filter(Boolean)
    : [],

  colors: Array.isArray(product.colors)
    ? product.colors
        .map((c) => {
          if (typeof c === "string") return c.trim();

          if (typeof c === "object" && c !== null) {
            return String(
              c.name ||
              c.value ||
              c.label ||
              c.color ||
              ""
            ).trim();
          }

          return String(c || "").trim();
        })
        .filter(Boolean)
    : [],

  discount: Number(product.discount) || 0,
}));

  const nav = useCallback((p, prm = {}) => {
    setPage(p); setParams(prm); setMobileOpen(false);
    window.scrollTo?.({ top: 0, behavior: "instant" });
  }, []);

 const addToCart = useCallback((id, qty) => {
  // User must be logged in before adding anything to cart
  if (!user?.email) {
    nav("auth");
    return;
  }

   console.log("ADDING TO CART:", id, qty);
  console.log("CURRENT USER:", user?.email);

  setCart(prev => {
    const existing = prev.find(c => c.id === id);

    if (existing) {
      return prev.map(c =>
        c.id === id
          ? { ...c, qty: c.qty + qty }
          : c
      );
    }

    return [...prev, { id, qty }];
  });
}, [user?.email, nav]);
  const updateQty = useCallback((id, qty) => setCart(prev => prev.map(c => c.id === id ? { ...c, qty } : c)), []);
  const removeItem = useCallback((id) => setCart(prev => prev.filter(c => c.id !== id)), []);
  const clearCart = useCallback(() => setCart([]), []);
  const toggleWishlist = useCallback((id) => setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]), []);

  const handleSearchSubmit = () => {
  if (searchTerm.trim()) {
    nav("search", { q: searchTerm.trim() });
  }
};

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const commonHandlers = { onAddToCart: addToCart, onToggleWishlist: toggleWishlist };

  let content;
if (isResetPasswordPage) {
  content = (
    <ResetPasswordPage
      nav={nav}
      token={resetToken}
      email={resetEmail}
    />
  );
} else if (isVerifyEmailPage) {
  content = <VerifyEmailPage nav={nav} />;
} else if (page === "home") {
  content = (
    <HomePage
      nav={nav}
      role={role}
      setRole={setRole}
      wishlist={wishlist}
      products={normalizedProducts}
      {...commonHandlers}
    />
  );
} else if (page === "store") {
  content = (
    <StoreListingPage
      storeId={params.storeId}
      nav={nav}
      role={role}
      searchTerm={searchTerm}
      wishlist={wishlist}
      products={normalizedProducts}
      {...commonHandlers}
    />
  );
} 
else if (page === "search") {
  content = (
    <SearchResultsPage
      searchTerm={searchTerm}
      nav={nav}
      role={role}
      wishlist={wishlist}
      products={normalizedProducts}
      {...commonHandlers}
    />
  );
}
else if (page === "product") {
  content = (
    <ProductDetailsPage
      productId={params.id}
      nav={nav}
      role={role}
      wished={wishlist.includes(params.id)}
      wishlist={wishlist}
      products={normalizedProducts}
      {...commonHandlers}
    />
  );
} else if (page === "cart") {
  content = (
    <CartPage
      cart={cart}
      updateQty={updateQty}
      removeItem={removeItem}
      role={role}
      nav={nav}
      products={normalizedProducts}
    />
  );
} else if (page === "checkout") {
  content = (
    <CheckoutPage
      cart={cart}
      role={role}
      nav={nav}
      clearCart={clearCart}
      products={normalizedProducts}
    />
  );
} else if (page === "auth") {
  content = <AuthPage nav={nav} login={setUser} />;
} else if (page === "verify-email") {
  content = <VerifyEmailPage nav={nav} />;
} else if (page === "profile") {
  content = (
    <ProfilePage
      user={user}
      role={role}
      setRole={setRole}
      nav={nav}
      logout={() => {
        localStorage.removeItem("vc_token");
        localStorage.removeItem("vc_user");
        setUser(null);
        setRole("retail");
        setCart([]);
        nav("home");
      }}
    />
  );
} else if (page === "orders") {
  content = <OrdersPage nav={nav} />;
} else if (page === "wishlist") {
  content = (
    <WishlistPage
      wishlist={wishlist}
      nav={nav}
      role={role}
      products={normalizedProducts}
      {...commonHandlers}
    />
  );
} else if (page === "about") {
  content = <AboutPage />;
} else if (page === "contact") {
  content = <ContactPage />;
} else if (page === "policy") {
  content = <PolicyPage type={params.type} />;
} else if (page === "admin") {
  if (!user) {
    content = <AuthPage nav={nav} login={setUser} />;
  } else if (user.role !== "admin") {
    nav("home");

    content = (
      <HomePage
        nav={nav}
        role={role}
        setRole={setRole}
        wishlist={wishlist}
        products={normalizedProducts}
        {...commonHandlers}
      />
    );
  } else {
    content = (
      <AdminDashboard
        nav={nav}
        products={normalizedProducts}
        refreshProducts={fetchProducts}
      />
    );
  }
}
else if (page === "admin") {
  if (!user) {
    content = <AuthPage nav={nav} login={setUser} />;
  } else if (user.role !== "admin") {
    nav("home");
    content = <HomePage nav={nav} role={role} setRole={setRole} wishlist={wishlist} products={normalizedProducts} {...commonHandlers} />;
  } else {
    content = (
      <AdminDashboard
        nav={nav}
        products={normalizedProducts}
        refreshProducts={fetchProducts}
      />
    );
  }
}
  return (
    <div className="uh-root">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      <GlobalStyle />
      {page !== "admin" && <TopBar />}
      {page !== "admin" && (
        <Navbar
          nav={nav} cartCount={cartCount} wishlistCount={wishlist.length} role={role} setRole={setRole}
          isLoggedIn={!!user} user={user} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
          searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearchSubmit={handleSearchSubmit}
        />
      )}
      {content}
      {page !== "admin" && <Footer nav={nav} />}
    </div>
  );
}