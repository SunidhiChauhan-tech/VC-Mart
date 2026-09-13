const express = require("express");
const Razorpay = require("razorpay");
const authMiddleware = require("../middleware/authMiddleware");
const Product = require("../models/Product");
const crypto = require("crypto");
const Order = require("../models/Order");
const WebhookEvent = require("../models/WebhookEvent");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =====================================================
// GET PRICE ACCORDING TO USER ROLE
// =====================================================
const getProductPrice = (product, role) => {
  if (role === "wholesale") {
    return product.wholesalePrice;
  }

  if (role === "reseller") {
    return product.resellerPrice;
  }

  return product.retailPrice;
};

// =====================================================
// CALCULATE TRUSTED ORDER TOTAL
// =====================================================
const calculateOrderTotal = async (items, role) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  let subtotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    if (!item.product) {
      throw new Error("Product ID is required");
    }

    const quantity = Number(item.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error("Invalid product quantity");
    }

    const product = await Product.findById(item.product);

    if (!product) {
      throw new Error(`Product not found: ${item.product}`);
    }

    if (!product.isActive) {
      throw new Error(`${product.name} is currently unavailable`);
    }

    if (product.stock < quantity) {
      throw new Error(
        `${product.name} does not have enough stock`
      );
    }

    const price = getProductPrice(product, role);

    if (!Number.isFinite(price) || price < 0) {
      throw new Error(`Invalid price for ${product.name}`);
    }

    subtotal += price * quantity;

    verifiedItems.push({
      product: product._id,
      name: product.name,
      price,
      quantity,
      image: product.images?.[0] || "",
    });
  }

  // Same shipping rule currently used by frontend
  const shipping =
    subtotal > 999 || subtotal === 0 ? 0 : 79;

  const totalAmount = subtotal + shipping;

  return {
    items: verifiedItems,
    subtotal,
    shipping,
    totalAmount,
  };
};

// =====================================================
// CREATE RAZORPAY ORDER
// =====================================================
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;

    const calculated = await calculateOrderTotal(
      items,
      req.user.role
    );

    const options = {
      amount: Math.round(calculated.totalAmount * 100),
      currency: "INR",
      receipt: `vc_mart_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      order,
      pricing: {
        subtotal: calculated.subtotal,
        shipping: calculated.shipping,
        totalAmount: calculated.totalAmount,
      },
    });
  } catch (error) {
    console.error("RAZORPAY ORDER ERROR:", error.message);

res.status(400).json({
  success: false,
  message: "Unable to create payment order. Please try again.",
});
  }
});

// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message: "Payment verification details are missing",
      });
    }

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    const signaturesMatch =
      generatedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(razorpay_signature)
      );

    if (!signaturesMatch) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const razorpayOrder =
      await razorpay.orders.fetch(razorpay_order_id);

    if (razorpayOrder.currency !== "INR") {
      return res.status(400).json({
        success: false,
        message: "Invalid payment currency",
      });
    }

    const payment =
      await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.order_id !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Payment does not belong to this order",
      });
    }

    if (payment.status !== "captured") {
      return res.status(400).json({
        success: false,
        message: "Payment has not been captured",
      });
    }

    if (payment.amount !== razorpayOrder.amount) {
      return res.status(400).json({
        success: false,
        message: "Payment amount mismatch",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: payment.amount,
        status: payment.status,
      },
    });
  } catch (error) {
   console.error(
  "PAYMENT VERIFICATION ERROR:",
  error.message
);

    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
});


// RAZORPAY WEBHOOK
// RAZORPAY WEBHOOK
router.post("/webhook", async (req, res) => {
  try {
    const webhookSignature = req.headers["x-razorpay-signature"];
    const eventId = req.headers["x-razorpay-event-id"];

    if (!webhookSignature) {
      return res.status(400).json({
        message: "Webhook signature missing",
      });
    }

    if (!eventId) {
      return res.status(400).json({
        message: "Webhook event ID missing",
      });
    }

    // Verify webhook signature using RAW request body
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.body)
      .digest("hex");

    const isValidSignature =
      webhookSignature.length === expectedSignature.length &&
      crypto.timingSafeEqual(
        Buffer.from(webhookSignature),
        Buffer.from(expectedSignature)
      );

    if (!isValidSignature) {
      return res.status(400).json({
        message: "Invalid webhook signature",
      });
    }

    // Parse only after signature verification
    const payload = JSON.parse(req.body.toString("utf8"));

    const eventName = payload.event;

    console.log(
      `Razorpay webhook received: ${eventName} | ${eventId}`
    );

    // --------------------------------------------------
    // IDEMPOTENCY CHECK
    // --------------------------------------------------

    const existingEvent = await WebhookEvent.findOne({
      eventId,
    });

    if (existingEvent) {
      console.log(
        `Duplicate Razorpay webhook ignored: ${eventId}`
      );

      return res.status(200).json({
        success: true,
        duplicate: true,
      });
    }

    // --------------------------------------------------
    // PAYMENT DETAILS
    // --------------------------------------------------

    const paymentEntity =
      payload.payload?.payment?.entity;

    const orderEntity =
      payload.payload?.order?.entity;

    const razorpayOrderId =
      paymentEntity?.order_id ||
      orderEntity?.id ||
      "";

    const razorpayPaymentId =
      paymentEntity?.id || "";

    // --------------------------------------------------
    // PAYMENT CAPTURED
    // --------------------------------------------------

    if (eventName === "payment.captured") {
      if (razorpayOrderId) {
        const order = await Order.findOne({
          razorpayOrderId,
        });

        if (order) {
          order.paymentStatus = "paid";

          if (razorpayPaymentId) {
            order.razorpayPaymentId = razorpayPaymentId;
          }

          await order.save();

          console.log(
            `Order payment marked as PAID: ${order._id}`
          );
        } else {
          console.log(
            `No local order found for Razorpay order: ${razorpayOrderId}`
          );
        }
      }
    }

    // --------------------------------------------------
    // PAYMENT FAILED
    // --------------------------------------------------

    else if (eventName === "payment.failed") {
      if (razorpayOrderId) {
        const order = await Order.findOne({
          razorpayOrderId,
        });

        if (order) {
          order.paymentStatus = "failed";

          if (razorpayPaymentId) {
            order.razorpayPaymentId = razorpayPaymentId;
          }

          await order.save();

          console.log(
            `Order payment marked as FAILED: ${order._id}`
          );
        } else {
          console.log(
            `No local order found for failed Razorpay order: ${razorpayOrderId}`
          );
        }
      }
    }

    // --------------------------------------------------
    // ORDER PAID
    // --------------------------------------------------

    else if (eventName === "order.paid") {
      if (razorpayOrderId) {
        const order = await Order.findOne({
          razorpayOrderId,
        });

        if (order) {
          order.paymentStatus = "paid";

          if (razorpayPaymentId) {
            order.razorpayPaymentId = razorpayPaymentId;
          }

          await order.save();

          console.log(
            `Order marked as PAID through order.paid: ${order._id}`
          );
        } else {
          console.log(
            `No local order found for Razorpay order: ${razorpayOrderId}`
          );
        }
      }
    }

    // --------------------------------------------------
    // STORE WEBHOOK EVENT
    // --------------------------------------------------

    await WebhookEvent.create({
      eventId,
      event: eventName || "unknown",
      processed: true,
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    // Unique index protection against simultaneous duplicate events
    if (error.code === 11000) {
      console.log("Duplicate Razorpay webhook ignored.");

      return res.status(200).json({
        success: true,
        duplicate: true,
      });
    }

    console.error(
      "RAZORPAY WEBHOOK ERROR:",
      error.message
    );

    return res.status(400).json({
      message: "Webhook processing failed",
    });
  }
});

module.exports = router;