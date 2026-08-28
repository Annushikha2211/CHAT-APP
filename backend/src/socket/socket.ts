import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";

interface OnlineUser {
  socketId: string;
  userId: string;
}

const onlineUsers = new Map<string, OnlineUser>();

export const initializeSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { userId: string };

      socket.data.userId = decoded.userId;

      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    onlineUsers.set(userId, {
      socketId: socket.id,
      userId,
    });

    console.log("User connected:", userId);

    // Tell everyone that this user is online
    socket.broadcast.emit("user_online", userId);

    // Send current online users
    socket.emit(
      "online_users",
      Array.from(onlineUsers.keys())
    );

    socket.on("send_message", (message) => {
      const receiver = onlineUsers.get(message.receiver);

      if (receiver) {
        io.to(receiver.socketId).emit("new_message", message);

        // Message reached receiver's socket
        socket.emit("message_delivered", {
          messageId: message._id,
        });
      }
    });

    socket.on("message_read", ({ messageId, senderId }) => {
      const sender = onlineUsers.get(senderId);

      if (sender) {
        io.to(sender.socketId).emit("message_read", {
          messageId,
        });
      }
    });

    socket.on("typing", ({ receiverId }) => {
      const receiver = onlineUsers.get(receiverId);

      if (receiver) {
        io.to(receiver.socketId).emit("user_typing", {
          userId,
        });
      }
    });

    socket.on("stop_typing", ({ receiverId }) => {
      const receiver = onlineUsers.get(receiverId);

      if (receiver) {
        io.to(receiver.socketId).emit("user_stop_typing", {
          userId,
        });
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);

      socket.broadcast.emit("user_offline", userId);

      console.log("User disconnected:", userId);
    });
  });

  return io;
};