import { Response } from "express";
import Card from "../models/Card";
import { AuthRequest } from "../middleware/authMiddleware";

export const createCard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const {
      title,
      message,
      template,
      receiverId,
    } = req.body;

    if (!title?.trim() || !message?.trim()) {
      return res.status(400).json({
        message: "Title and message are required",
      });
    }

    if (!receiverId) {
      return res.status(400).json({
        message: "Receiver is required",
      });
    }

    const card = await Card.create({
      sender: userId,
      receiver: receiverId,
      title: title.trim(),
      message: message.trim(),
      template: template || "birthday",
    });

    return res.status(201).json({
      card,
    });
  } catch (error) {
    console.log("Create card error:", error);

    return res.status(500).json({
      message: "Failed to create card",
    });
  }
};

export const getMyCards = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const cards = await Card.find({
      sender: userId,
    })
      .populate("receiver", "name username")
      .sort({ createdAt: -1 });

    return res.json({
      cards,
    });
  } catch (error) {
    console.log("Get cards error:", error);

    return res.status(500).json({
      message: "Failed to get cards",
    });
  }
};