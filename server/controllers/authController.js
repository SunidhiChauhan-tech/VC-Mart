const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

// SIGNUP
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate secure email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Token valid for 30 minutes
    const verificationExpires = new Date(
      Date.now() + 30 * 60 * 1000
    );

    // Gmail transporter
   const { data, error } = await resend.emails.send({
  from: "VC Mart <onboarding@resend.dev>",
  to: [normalizedEmail],
  subject: "VC Mart - Verify Your Email",
  html: `
    ... 
  `,
});

    // Create verification URL
    const verificationUrl =
      `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(
        normalizedEmail
      )}`;

    // Send verification email FIRST
    const { data: mailData, error: mailError } = await resend.emails.send({
  from: "VC Mart <onboarding@resend.dev>",
  to: [normalizedEmail],
  subject: "VC Mart - Verify Your Email",
  html: `
    <div style="
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: auto;
      padding: 30px;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
    ">

      <h2 style="color:#111827;">
        Welcome to VC Mart, ${name}!
      </h2>

      <p style="color:#374151;">
        Thank you for creating your VC Mart account.
      </p>

      <p style="color:#374151;">
        Please verify your email address by clicking the button below.
      </p>

      <a
        href="${verificationUrl}"
        style="
          display:inline-block;
          padding:12px 22px;
          background:#111827;
          color:white;
          text-decoration:none;
          border-radius:6px;
          margin:15px 0;
        "
      >
        Verify My Email
      </a>

      <p style="
        margin-top:20px;
        color:#6b7280;
        font-size:13px;
      ">
        This verification link will expire in 30 minutes.
      </p>

      <p style="
        color:#6b7280;
        font-size:13px;
      ">
        If you did not create this account, you can safely ignore this email.
      </p>

      <p style="color:#374151;">
        — VC Mart Team
      </p>

    </div>
  `,
});

if (mailError) {
  console.error("RESEND EMAIL ERROR:", mailError);

  return res.status(500).json({
    message: "Registration failed",
  });
}

console.log("RESEND EMAIL SENT:", mailData);

    // ONLY create user after email is successfully sent
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "customer",

      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    // Do not issue JWT until email is verified
    return res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });

  } catch (error) {
    console.error("REGISTRATION ERROR:", error.message);

    return res.status(500).json({
      message: "Registration failed",
    });
  }
};

// VERIFY EMAIL
const verifyEmail = async (req, res) => {
  try {
    console.log("VERIFY EMAIL API CALLED:", new Date().toISOString());

    const { token, email } = req.query;

    if (!token || !email) {
      return res.status(400).json({
        message: "Invalid email verification link",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // First, find the user by email
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired email verification link",
      });
    }

    // If the email was already verified,
    // treat repeated verification requests as successful.
    if (user.isEmailVerified) {
      return res.status(200).json({
        message: "Email is already verified. You can now login.",
      });
    }

    // For an unverified user, token must match and must not be expired.
    if (
      user.emailVerificationToken !== token ||
      !user.emailVerificationExpires ||
      user.emailVerificationExpires <= new Date()
    ) {
      return res.status(400).json({
        message: "Invalid or expired email verification link",
      });
    }

    // Verify the email
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await user.save();

    console.log("EMAIL VERIFIED SUCCESSFULLY:", normalizedEmail);

    return res.status(200).json({
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    console.error("EMAIL VERIFICATION ERROR:", error.message);

    return res.status(500).json({
      message: "Unable to verify email",
    });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // EMAIL VERIFICATION CHECK
if (user.role === "customer" && !user.isEmailVerified) {
  return res.status(403).json({
    message: "Please verify your email before logging in.",
  });
}

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
  console.error("LOGIN ERROR:", error.message);

  res.status(500).json({
    message: "Login failed",
  });
}
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    // Don't reveal whether an account exists
    if (!user) {
      return res.status(200).json({
        message: "If an account exists, a password reset link has been sent.",
      });
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save token + expiry (15 minutes)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

  const resetUrl =
  `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;

const { data: mailData, error: mailError } = await resend.emails.send({
  from: "VC Mart <onboarding@resend.dev>",
  to: [user.email],
  subject: "VC Mart - Reset Your Password",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 10px;">

      <h2 style="color:#111827;">
        Reset Your VC Mart Password
      </h2>

      <p style="color:#374151;">
        Hello ${user.name},
      </p>

      <p style="color:#374151;">
        We received a request to reset your VC Mart account password.
      </p>

      <p style="color:#374151;">
        Click the button below to create a new password:
      </p>

      <a
        href="${resetUrl}"
        style="
          display:inline-block;
          padding:12px 22px;
          background:#111827;
          color:white;
          text-decoration:none;
          border-radius:6px;
          margin:15px 0;
        "
      >
        Reset Password
      </a>

      <p style="margin-top:20px; color:#6b7280; font-size:13px;">
        This link will expire in 15 minutes.
      </p>

      <p style="color:#6b7280; font-size:13px;">
        If you did not request this, you can safely ignore this email.
      </p>

      <p style="color:#374151;">
        — VC Mart Team
      </p>

    </div>
  `,
});

if (mailError) {
  console.error("RESEND PASSWORD RESET EMAIL ERROR:", mailError);

  return res.status(500).json({
    message: "Unable to send password reset email",
  });
}

console.log("PASSWORD RESET EMAIL SENT:", mailData);

    return res.status(200).json({
      message: "If an account exists, a password reset link has been sent.",
    });

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error.message);

    return res.status(500).json({
      message: "Unable to process password reset request",
    });
  }
};


// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      return res.status(400).json({
        message: "Email, token and new password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired password reset link",
      });
    }

    user.password = await bcrypt.hash(password, 10);

    // Clear reset token after successful reset
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error.message);

    return res.status(500).json({
      message: "Unable to reset password",
    });
  }
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
};