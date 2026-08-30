import { Response } from "express";
import FriendRequest from "../models/FriendRequest";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

// SEND REQUEST
export const sendFriendRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const senderId = req.user?.userId;
    const { receiverId } = req.body;

    if (!senderId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!receiverId) {
      return res.status(400).json({
        message: "Receiver ID is required",
      });
    }

    if (senderId === receiverId) {
      return res.status(400).json({
        message: "You cannot send request to yourself",
      });
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (existingRequest) {
      return res.status(400).json({
        message: `Request already ${existingRequest.status}`,
      });
    }

    // Agar saamne wale ne pehle request bheji hai
    const reverseRequest = await FriendRequest.findOne({
      sender: receiverId,
      receiver: senderId,
    });

    if (reverseRequest) {
      if (reverseRequest.status === "pending") {
        return res.status(400).json({
          message: "This user has already sent you a request",
        });
      }
    }

    const request = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    return res.status(201).json({
      message: "Friend request sent",
      request,
    });
  } catch (error) {
    console.log("Send friend request error:", error);

    return res.status(500).json({
      message: "Failed to send friend request",
    });
  }
};

// GET RECEIVED REQUESTS
export const getReceivedRequests = async (
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

    const requests = await FriendRequest.find({
      receiver: userId,
      status: "pending",
    })
      .populate("sender", "name username email profileImage")
      .sort({ createdAt: -1 });

    // Deleted users wale pending requests ko safe filter karein
    const validRequests = requests.filter(
      (request) => request.sender !== null && request.sender !== undefined
    );

    return res.json({
      requests: validRequests,
    });
  } catch (error) {
    console.log("Get received requests error:", error);

    return res.status(500).json({
      message: "Failed to get requests",
    });
  }
};

// ACCEPT REQUEST
export const acceptFriendRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const { requestId } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const request = await FriendRequest.findOne({
      _id: requestId,
      receiver: userId,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({
        message: "Friend request not found",
      });
    }

    request.status = "accepted";

    await request.save();

    return res.json({
      message: "Friend request accepted",
      request,
    });
  } catch (error) {
    console.log("Accept friend request error:", error);

    return res.status(500).json({
      message: "Failed to accept request",
    });
  }
};

// REJECT REQUEST
export const rejectFriendRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const { requestId } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const request = await FriendRequest.findOne({
      _id: requestId,
      receiver: userId,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({
        message: "Friend request not found",
      });
    }

    request.status = "rejected";

    await request.save();

    return res.json({
      message: "Friend request rejected",
    });
  } catch (error) {
    console.log("Reject friend request error:", error);

    return res.status(500).json({
      message: "Failed to reject request",
    });
  }
};

// GET MY FRIENDS - PERMANENTLY FIXED
export const getFriends = async (
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

    const requests = await FriendRequest.find({
      status: "accepted",
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "name username email profileImage")
      .populate("receiver", "name username email profileImage")
      .sort({ updatedAt: -1 });

    const friends = requests
      .map((request: any) => {
        // Safe access: Sender ya Receiver agar null huye toh gracefully crash hone se bachayega
        if (request.sender && request.sender._id?.toString() === userId.toString()) {
          return request.receiver;
        }
        return request.sender;
      })
      // PERMANENT FIX: Null/Undefined items aur deleted users ko list se nikal dega
      .filter((friend: any) => friend !== null && friend !== undefined && friend._id);

    return res.json({
      friends,
    });
  } catch (error) {
    console.log("Get friends error:", error);

    return res.status(500).json({
      message: "Failed to get friends",
    });
  }
};