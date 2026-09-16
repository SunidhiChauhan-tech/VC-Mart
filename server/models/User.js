const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    isEmailVerified: {
       type: Boolean,
       default: false,
    },

emailVerificationToken: {
  type: String,
  default: null,
},

emailVerificationExpires: {
  type: Date,
  default: null,
},

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    resetPasswordToken: {
      type: String,
       default: null,
    },

resetPasswordExpires: {
  type: Date,
  default: null,
},

    accountType: {
      type: String,
      enum: ["retail", "wholesale"],
      default: "retail",
    },

    wholesaleStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },

    businessName: {
      type: String,
      trim: true,
      default: "",
    },

    businessType: {
      type: String,
      trim: true,
      default: "",
    },

    businessAddress: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    state: {
      type: String,
      trim: true,
      default: "",
    },

    pincode: {
      type: String,
      trim: true,
      default: "",
    },

    gstin: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },

    pan: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },

    role: {
      type: String,
      enum: ["customer", "admin", "wholesale", "reseller"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);