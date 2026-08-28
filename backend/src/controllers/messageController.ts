import { Response } from "express";
import Message from "../models/Message";
import { AuthRequest } from "../middleware/authMiddleware";


// SEND MESSAGE
export const sendMessage = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const sender = req.user?.userId;

    const {
  receiver,
  content,
  messageType,
  fileUrl,
} = req.body;

   if (
  !sender ||
  !receiver ||
  (
    !content?.trim() &&
    !fileUrl
  )
) {
  return res.status(400).json({
    message:
      "Receiver and message content/file are required",
  });
}

    if (
      messageType === "text" &&
      !content?.trim()
    ) {
      return res.status(400).json({
        message: "Message cannot be empty",
      });
    }

    if (
      messageType !== "text" &&
      !fileUrl
    ) {
      return res.status(400).json({
        message: "File is required",
      });
    }

    const message = await Message.create({
      sender,
      receiver,
      content: content?.trim() || "",
      messageType: messageType || "text",
      fileUrl: fileUrl || "",
      isDelivered: false,
      isRead: false,
    });

    return res.status(201).json({
      message,
    });
  } catch (error) {
    console.log("Send message error:", error);

    return res.status(500).json({
      message: "Failed to send message",
    });
  }
};


// GET MESSAGES
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
    }).sort({
      createdAt: 1,
    });

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

export const markMessagesAsRead = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const currentUser = req.user?.userId;
    const otherUser = req.params.userId;

    if (!currentUser) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    await Message.updateMany(
      {
        sender: otherUser,
        receiver: currentUser,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    return res.status(200).json({
      message: "Messages marked as read",
    });

  } catch (error) {
    console.log("Mark read error:", error);

    return res.status(500).json({
      message: "Failed to mark messages as read",
    });
  }
};


export const markMessagesAsDelivered = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const currentUser = req.user?.userId;
    const otherUser = req.params.userId;

    if (!currentUser) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    await Message.updateMany(
      {
        sender: otherUser,
        receiver: currentUser,
        isDelivered: false,
      },
      {
        $set: {
          isDelivered: true,
        },
      }
    );

    return res.status(200).json({
      message: "Messages marked as delivered",
    });
  } catch (error) {
    console.log("Mark delivered error:", error);

    return res.status(500).json({
      message: "Failed to mark messages as delivered",
    });
  }
};



export const editMessage = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Message cannot be empty",
      });
    }

    const message = await Message.findOne({
      _id: messageId,
      sender: userId,
      isDeleted: false,
    });

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    message.content = content.trim();
    message.isEdited = true;

    await message.save();

    return res.status(200).json({
      message,
    });
  } catch (error) {
    console.log("Edit message error:", error);

    return res.status(500).json({
      message: "Failed to edit message",
    });
  }
};
   

export const deleteMessage = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { messageId } = req.params;

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const message = await Message.findOne({
      _id: messageId,
      sender: userId,
    });

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    message.content = "This message was deleted";
    message.isDeleted = true;

    await message.save();

    return res.status(200).json({
      message,
    });
  } catch (error) {
    console.log("Delete message error:", error);

    return res.status(500).json({
      message: "Failed to delete message",
    });
  }
};


export const getChatList = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const currentUserId = req.user?.userId;

    if (!currentUserId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: currentUserId },
        { receiver: currentUserId },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name username")
      .populate("receiver", "name username");

    const chats: any[] = [];
    const seenUsers = new Set<string>();

    for (const message of messages) {
      const senderId = String(
        typeof message.sender === "object"
          ? message.sender._id
          : message.sender
      );

      const receiverId = String(
        typeof message.receiver === "object"
          ? message.receiver._id
          : message.receiver
      );

      const otherUserId =
        senderId === currentUserId
          ? receiverId
          : senderId;

      if (seenUsers.has(otherUserId)) {
        continue;
      }

      seenUsers.add(otherUserId);

      const unreadCount = await Message.countDocuments({
        sender: otherUserId,
        receiver: currentUserId,
        isRead: false,
      });

      const otherUser =
        senderId === currentUserId
          ? message.receiver
          : message.sender;

      chats.push({
        user: otherUser,
        lastMessage: message.content,
        lastMessageTime: message.createdAt,
        unreadCount,
      });
    }

    return res.status(200).json({
      chats,
    });
  } catch (error) {
    console.log("Chat list error:", error);

    return res.status(500).json({
      message: "Failed to load chats",
    });
  }
};

