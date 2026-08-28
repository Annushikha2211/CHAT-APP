import express from "express";

import {
  getMyProfile,
  updateProfile,
} from "../controllers/profileController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get(
  "/me",
  protect,
  getMyProfile
);

router.put(
  "/me",
  protect,
  updateProfile
);

export default router;