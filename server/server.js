const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express(); // 👈 YE PEHLE

// Connect MongoDB
connectDB();

// ---------------- SECURITY ----------------

app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// ---------------- CORS ----------------

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);


// RAZORPAY WEBHOOK RAW BODY
app.use(
  "/api/payments/webhook",
  express.raw({
    type: "application/json",
    limit: "1mb",
  })
);

// ---------------- BODY PARSER ----------------

app.use(express.json({ limit: "1mb" }));



// ---------------- ROUTES ----------------

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// ---------------- BASIC ROUTE ----------------

app.get("/", (req, res) => {
  res.send("VC Mart Backend is running 🚀");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "VC Mart API is running",
  });
});

// ---------------- ERROR HANDLER ----------------

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", {
  message: err.message,
  status: err.status || 500,
});

res.status(err.status || 500).json({
  message: "Something went wrong. Please try again later.",
  });
});

// PROCESS ERROR HANDLERS
process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION:", error);
});

// ---------------- SERVER ----------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});