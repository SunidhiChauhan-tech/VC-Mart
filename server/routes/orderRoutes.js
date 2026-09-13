const express = require("express");

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ======================================================
// ORDER INPUT VALIDATION
// ======================================================

const validateCreateOrder = (req, res, next) => {
  const {
    items,
    paymentMethod,
    shippingAddress,
  } = req.body;

  // ---------- ITEMS ----------
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: "Order must contain at least one item",
    });
  }

  // Prevent extremely large orders
  if (items.length > 50) {
    return res.status(400).json({
      message: "Too many different products in one order",
    });
  }

  for (const item of items) {
    if (!item || typeof item !== "object") {
      return res.status(400).json({
        message: "Invalid order item",
      });
    }

    // Product ID must be a string
    if (
      typeof item.product !== "string" ||
      item.product.trim() === ""
    ) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    // Quantity must be an integer
    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 100
    ) {
      return res.status(400).json({
        message:
          "Product quantity must be between 1 and 100",
      });
    }
  }


  // ---------- PAYMENT METHOD ----------
  if (!["cod", "razorpay"].includes(paymentMethod)) {
    return res.status(400).json({
      message: "Invalid payment method",
    });
  }


  // ---------- SHIPPING ADDRESS ----------
  if (
    !shippingAddress ||
    typeof shippingAddress !== "object"
  ) {
    return res.status(400).json({
      message: "Shipping address is required",
    });
  }

  const {
    name,
    phone,
    address,
    city,
    state,
    pincode,
  } = shippingAddress;


  // Name
  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 100
  ) {
    return res.status(400).json({
      message: "Invalid shipping name",
    });
  }


  // Phone
  if (
    typeof phone !== "string" ||
    !/^[6-9]\d{9}$/.test(phone.trim())
  ) {
    return res.status(400).json({
      message: "Invalid phone number",
    });
  }


  // Address
  if (
    typeof address !== "string" ||
    address.trim().length < 5 ||
    address.trim().length > 300
  ) {
    return res.status(400).json({
      message: "Invalid shipping address",
    });
  }


  // City
  if (
    typeof city !== "string" ||
    city.trim().length < 2 ||
    city.trim().length > 100
  ) {
    return res.status(400).json({
      message: "Invalid city",
    });
  }


  // State
  if (
    typeof state !== "string" ||
    state.trim().length > 100
  ) {
    return res.status(400).json({
      message: "Invalid state",
    });
  }


  // Pincode
  if (
    typeof pincode !== "string" ||
    !/^\d{6}$/.test(pincode.trim())
  ) {
    return res.status(400).json({
      message: "Invalid pincode",
    });
  }


  next();
};


// ======================================================
// CUSTOMER/USER — CREATE ORDER
// ======================================================

router.post(
  "/",
  authMiddleware,
  validateCreateOrder,
  createOrder
);


// ======================================================
// CUSTOMER/USER — THEIR OWN ORDERS
// ======================================================

router.get(
  "/my",
  authMiddleware,
  getMyOrders
);


// ======================================================
// ADMIN — ALL ORDERS
// ======================================================

router.get(
  "/admin",
  authMiddleware,
  adminMiddleware,
  getAllOrders
);


// ======================================================
// UPDATE ORDER STATUS — ADMIN
// ======================================================

router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);


module.exports = router;