import { Response } from "express";
import Block from "../models/block";
import { AuthRequest } from "../middleware/authMiddleware";

export const blockUser = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const blocker = req.user?.userId;
    const blocked = req.params.userId;

    if (!blocker) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (blocker === blocked) {
      return res.status(400).json({
        message: "You cannot block yourself",
      });
    }

    await Block.findOneAndUpdate(
      { blocker, blocked },
      { blocker, blocked },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      message: "User blocked successfully",
    });
  } catch (error) {
    console.log("Block error:", error);

    return res.status(500).json({
      message: "Failed to block user",
    });
  }
};

export const unblockUser = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const blocker = req.user?.userId;
    const blocked = req.params.userId;

    await Block.findOneAndDelete({
      blocker,
      blocked,
    });

    return res.status(200).json({
      message: "User unblocked successfully",
    });
  } catch (error) {
    console.log("Unblock error:", error);

    return res.status(500).json({
      message: "Failed to unblock user",
    });
  }
};

export const getBlockStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const blocker = req.user?.userId;
    const blocked = req.params.userId;

    const block = await Block.findOne({
      blocker,
      blocked,
    });

    return res.status(200).json({
      blocked: !!block,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to check block status",
    });
  }
};