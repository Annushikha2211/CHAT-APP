import { Response } from "express";
import Message from "../models/Message";
import { AuthRequest } from "../middleware/authMiddleware";

export const sendMessage = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { receiver, content } = req.body;

    const sender = req.user?.userId;

    if (!sender || !receiver || !content?.trim()) {
      return res.status(400).json({
        message: "Receiver and message content are required",
      });
    }

    const message = await Message.create({
      sender,
      receiver,
      content: content.trim(),
    });

    return res.status(201).json({
      message,
    });
  } catch (error) {
    console.log("Error sending message:", error);

    return res.status(500).json({
      message: "Failed to send message",
    });
  }
};

export const getMessages = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user?.userId;

    if (!currentUser) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const messages = await Message.find({
      $or: [
        {
          sender: currentUser,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: currentUser,
        },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      messages,
    });
  } catch (error) {
    console.log("Error fetching messages:", error);

    return res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
};




