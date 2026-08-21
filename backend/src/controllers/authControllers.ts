import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import OTP from "../models/OTP";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/sendEmail";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// =========================
// SIGNUP - SEND OTP
// =========================

export const signup = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const otp = generateOTP();

    await OTP.deleteMany({
      email,
      purpose: "signup",
    });

    await OTP.create({
      email,
      name,
      password: hashedPassword,
      otp,
      purpose: "signup",
      expiresAt: new Date(
        Date.now() + 10 * 60 * 1000
      ),
    });

    await sendOTPEmail(email, otp, "signup");

    return res.status(200).json({
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.log("Signup error:", error);

    return res.status(500).json({
      message: "Failed to send OTP",
    });
  }
};

// =========================
// VERIFY SIGNUP OTP
// =========================

export const verifySignupOTP = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({
      email,
      otp,
      purpose: "signup",
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        message: "OTP expired",
      });
    }

    const user = await User.create({
      name: otpRecord.name,
      email: otpRecord.email,
      password: otpRecord.password,
    });

    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    return res.status(201).json({
      message: "Email verified and account created",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Verify signup error:", error);

    return res.status(500).json({
      message: "Failed to verify OTP",
    });
  }
};

// =========================
// LOGIN
// =========================

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Login error:", error);

    return res.status(500).json({
      message: "Login failed",
    });
  }
};

// =========================
// FORGOT PASSWORD - SEND OTP
// =========================

export const forgotPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = generateOTP();

    await OTP.deleteMany({
      email,
      purpose: "reset",
    });

    await OTP.create({
      email,
      otp,
      purpose: "reset",
      expiresAt: new Date(
        Date.now() + 10 * 60 * 1000
      ),
    });

    await sendOTPEmail(email, otp, "reset");

    return res.status(200).json({
      message: "Password reset OTP sent",
    });
  } catch (error) {
    console.log("Forgot password error:", error);

    return res.status(500).json({
      message: "Failed to send reset OTP",
    });
  }
};

// =========================
// RESET PASSWORD
// =========================

export const resetPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP and new password are required",
      });
    }

    const otpRecord = await OTP.findOne({
      email,
      otp,
      purpose: "reset",
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        message: "OTP expired",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await User.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
      }
    );

    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.log("Reset password error:", error);

    return res.status(500).json({
      message: "Failed to reset password",
    });
  }
};

