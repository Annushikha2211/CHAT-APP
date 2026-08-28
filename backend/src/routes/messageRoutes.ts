import express from "express";

import {
  sendMessage,
  getMessages,
  markMessagesAsRead,
  markMessagesAsDelivered,
  editMessage,
  deleteMessage,
  getChatList,
} from "../controllers/messageController";



import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, sendMessage);

router.get(
  "/chats",
  protect,
  getChatList
);

router.put(
  "/delivered/:userId",
  protect,
  markMessagesAsDelivered
);

router.get("/:userId", protect, getMessages);

router.put("/read/:userId", protect, markMessagesAsRead);

router.get("/chats", protect, getChatList);

router.get("/:userId", protect, getMessages);

router.put(
  "/:messageId",
  protect,
  editMessage
);

router.delete(
  "/:messageId",
  protect,
  deleteMessage
);



export default router;