import express from "express";

import {
  blockUser,
  unblockUser,
  getBlockStatus,
} from "../controllers/blockControllers";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/:userId", protect, blockUser);

router.delete("/:userId", protect, unblockUser);

router.get("/:userId", protect, getBlockStatus);

export default router;