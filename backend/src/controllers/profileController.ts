import { Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

export const getMyProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = await User.findById(
      req.user?.userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({ user });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      name,
      username,
      bio,
      profileImage,
    } = req.body;

    const user = await User.findById(
      req.user?.userId
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name !== undefined) {
      user.name = name.trim();
    }

    if (username !== undefined) {
      user.username = username
        .trim()
        .toLowerCase();
    }

    if (bio !== undefined) {
      user.bio = bio.trim();
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    await user.save();

    const safeUser = await User.findById(
      user._id
    ).select("-password");

    return res.json({
      message: "Profile updated",
      user: safeUser,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    console.log(error);

    return res.status(500).json({
      message: "Failed to update profile",
    });
  }
};