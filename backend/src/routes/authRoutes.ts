import express from "express";

import {
  signup,
  login,
  verifySignupOTP,
  forgotPassword,
  resetPassword,
} from "../controllers/authControllers";

const router = express.Router();

router.post("/signup", signup);

router.post("/verify-signup-otp", verifySignupOTP);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

export default router;