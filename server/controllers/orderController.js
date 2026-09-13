const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");

// ===============================
// PRICE HELPER
// ===============================

const getProductPrice = (product, role) => {
  if (role === "wholesale") {
    return product.wholesalePrice;
  }

  if (role === "reseller") {
    return product.resellerPrice;
  }

  return product.retailPrice;
};

// ===============================
// VERIFY + CALCULATE ORDER
// ===============================

const calculateVerifiedOrder = async (items, role) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  // --------------------------------
  // Combine duplicate products
  // --------------------------------

  const quantityMap = new Map();

  for (const item of items) {
    if (!item.product) {
      throw new Error("Product ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(item.product)) {
      throw new Error("Invalid product ID");
    }

    const quantity = Number(item.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error("Invalid product quantity");
    }

    const productId = item.product.toString();

    quantityMap.set(
      productId,
      (quantityMap.get(productId) || 0) + quantity
    );
  }

  let subtotal = 0;
  const verifiedItems = [];

  // --------------------------------
  // Verify products from database
  // --------------------------------

  for (const [productId, quantity] of quantityMap.entries()) {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (!product.isActive) {
      throw new Error(
        `${product.name} is currently unavailable`
      );
    }

    if (product.stock < quantity) {
      throw new Error(
        `${product.name} does not have enough stock`
      );
    }

    const price = getProductPrice(product, role);

    if (!Number.isFinite(price) || price < 0) {
      throw new Error(
        `Invalid price for ${product.name}`
      );
    }

    subtotal += price * quantity;

    verifiedItems.push({
      product: product._id,
      name: product.name,
      price: price,
      quantity: quantity,
      image: product.images?.[0] || "",
    });
  }

  // --------------------------------
  // Shipping calculation
  // --------------------------------

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

// ===============================
// REDUCE STOCK ATOMICALLY
// ===============================

const reduceStock = async (items, session) => {
  for (const item of items) {
    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: item.product,
        isActive: true,
        stock: { $gte: item.quantity },
      },
      {
        $inc: {
          stock: -item.quantity,
        },
      },
      {
        new: true,
        session,
      }
    );

    // If no document was updated, stock changed
    // between verification and final order creation.
    if (!updatedProduct) {
      throw new Error(
        `${item.name} is no longer available in the requested quantity`
      );
    }
  }
};

// ===============================
// CREATE ORDER
// ===============================

const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      items,
      paymentMethod,
      paymentStatus,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      shippingAddress,
    } = req.body;

    // --------------------------------
    // Validate payment method
    // --------------------------------

    if (!["cod", "razorpay"].includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    // --------------------------------
    // Calculate everything from DB
    // --------------------------------

    const verifiedOrder = await calculateVerifiedOrder(
      items,
      req.user.role
    );

    // --------------------------------
    // COD
    // --------------------------------

    if (paymentMethod === "cod") {
      let createdOrder;

      await session.withTransaction(async () => {
        // Reduce stock atomically
        await reduceStock(
          verifiedOrder.items,
          session
        );

        // Create order
        const orders = await Order.create(
          [
            {
              user: req.user._id,
              items: verifiedOrder.items,
              totalAmount: verifiedOrder.totalAmount,
              paymentMethod: "cod",
              paymentStatus: "pending",
              shippingAddress: shippingAddress || {},
            },
          ],
          { session }
        );

        createdOrder = orders[0];
      });

      return res.status(201).json({
        message: "Order created successfully",
        order: createdOrder,
      });
    }

    // --------------------------------
    // RAZORPAY
    // --------------------------------

    if (paymentMethod === "razorpay") {
      if (
        paymentStatus !== "paid" ||
        !razorpayPaymentId ||
        !razorpayOrderId ||
        !razorpaySignature
      ) {
        return res.status(400).json({
          message: "Razorpay payment is not verified",
        });
      }

      // --------------------------------
      // Prevent duplicate Razorpay order
      // --------------------------------

      const existingOrder = await Order.findOne({
        razorpayOrderId,
      });

      if (existingOrder) {
        return res.status(409).json({
          message:
            "This Razorpay order has already been processed",
          order: existingOrder,
        });
      }

      let createdOrder;

      await session.withTransaction(async () => {
        // Reduce stock atomically
        await reduceStock(
          verifiedOrder.items,
          session
        );

        // Create verified paid order
        const orders = await Order.create(
          [
            {
              user: req.user._id,
              items: verifiedOrder.items,
              totalAmount: verifiedOrder.totalAmount,
              paymentMethod: "razorpay",
              paymentStatus: "paid",
              razorpayPaymentId,
              razorpayOrderId,
              razorpaySignature,
              shippingAddress: shippingAddress || {},
            },
          ],
          { session }
        );

        createdOrder = orders[0];
      });

      return res.status(201).json({
        message: "Order created successfully",
        order: createdOrder,
      });
    }
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error.message);

    return res.status(400).json({
      message:
        error.message || "Failed to create order",
    });
  } finally {
    await session.endSession();
  }
};

// ===============================
// GET MY ORDERS
// ===============================

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.product", "name images")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("GET MY ORDERS ERROR:", error.message);

    return res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};

// ===============================
// GET ALL ORDERS — ADMIN
// ===============================

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email role")
      .populate("items.product", "name images")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error.message);

    return res.status(500).json({
      message: "Failed to fetch all orders",
    });
  }
};

// ===============================
// UPDATE ORDER STATUS — ADMIN
// ===============================

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(req.params.id)
    ) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(
  "UPDATE ORDER STATUS ERROR:",
  error.message
);

    return res.status(500).json({
      message: "Failed to update order status",
    });
  }
};

// ===============================
// EXPORTS
// ===============================

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};