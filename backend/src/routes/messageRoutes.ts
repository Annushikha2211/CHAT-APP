import express from "express";

import {
  sendMessage,
  getMessages,
} from "../controllers/messageController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    message: "Message routes working",
  });
});

router.post("/", protect, sendMessage);

router.get("/:userId", protect, getMessages);

export default router;