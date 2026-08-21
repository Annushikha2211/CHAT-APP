import { Request, Response } from "express";
import User from "../models/User";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");

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