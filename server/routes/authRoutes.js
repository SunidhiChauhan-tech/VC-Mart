const express = require("express");

const {
  registerUser,
   verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

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


module.exports = router;