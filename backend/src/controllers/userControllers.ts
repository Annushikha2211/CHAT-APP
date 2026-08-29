
import { Request, Response } from "express";
import User from "../models/User";

export const getUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await User.find()
      .select("-password");

    return res.status(200).json({
      users,
    });
  } catch (error) {
    console.log("Error fetching users:", error);

    return res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.findById(
      req.params.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(
      "Get user by id error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch user",
    });
  }
};

export const searchUsers = async (
  req: any,
  res: Response
) => {
  try {
    const q = String(
      req.query.q || ""
    ).trim();

    if (!q) {
      return res.json({
        users: [],
      });
    }

    const users = await User.find({
      _id: {
        $ne: req.user?.userId,
      },

      $or: [
        {
          name: {
            $regex: q,
            $options: "i",
          },
        },
        {
          username: {
            $regex: q.replace("@", ""),
            $options: "i",
          },
        },
        {
          email: {
            $regex: q,
            $options: "i",
          },
        },
      ],
    })
      .select("-password")
      .limit(20);

    return res.json({
      users,
    });
  } catch (error) {
    console.log(
      "Search users error:",
      error
    );

    return res.status(500).json({
      message: "Search failed",
    });
  }
};