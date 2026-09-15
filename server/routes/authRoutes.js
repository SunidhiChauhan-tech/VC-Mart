const express = require("express");

const {
  registerUser,
   verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const User = require("../models/User");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/register", registerUser);
router.get("/verify-email", verifyEmail);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    user: req.user,
  });
});

router.get("/admin-test", authMiddleware, adminMiddleware, (req, res) => {
  res.status(200).json({
    message: "Welcome Admin 👑",
    user: req.user,
  });
});

// ======================================================
// ADMIN — REGISTERED USER COUNTS (read-only, for dashboard)
// ======================================================
router.get("/admin/user-stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [customers, wholesale, reseller, admins, totalUsers] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "wholesale" }),
      User.countDocuments({ role: "reseller" }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({}),
    ]);

    res.status(200).json({
      totalUsers,
      customers,
      wholesale,
      reseller,
      admins,
    });
  } catch (error) {
    console.error("USER STATS ERROR:", error.message);

    res.status(500).json({
      message: "Failed to fetch user stats",
    });
  }
});


module.exports = router;