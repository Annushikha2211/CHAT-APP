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

  // Authentication
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as {
        userId: string;
      };

      socket.data.userId = decoded.userId;

      next();
    } catch (error) {
      console.log("Socket auth error:", error);
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

    // -----------------------------
    // ONLINE USER
    // -----------------------------

    socket.broadcast.emit("user_online", userId);

    socket.emit(
      "online_users",
      Array.from(onlineUsers.keys())
    );

    // -----------------------------
    // CHAT MESSAGE
    // -----------------------------

    socket.on("send_message", (message) => {
      const receiver = onlineUsers.get(message.receiver);

      if (receiver) {
        io.to(receiver.socketId).emit(
          "new_message",
          message
        );

        socket.emit("message_delivered", {
          messageId: message._id,
        });
      }
    });

    // -----------------------------
    // MESSAGE READ
    // -----------------------------

    socket.on(
      "message_read",
      ({ messageId, senderId }) => {
        const sender = onlineUsers.get(senderId);

        if (sender) {
          io.to(sender.socketId).emit(
            "message_read",
            {
              messageId,
            }
          );
        }
      }
    );

    // -----------------------------
    // TYPING
    // -----------------------------

    socket.on(
      "typing",
      ({ receiverId }) => {
        const receiver =
          onlineUsers.get(receiverId);

        if (receiver) {
          io.to(receiver.socketId).emit(
            "user_typing",
            {
              userId,
            }
          );
        }
      }
    );

    socket.on(
      "stop_typing",
      ({ receiverId }) => {
        const receiver =
          onlineUsers.get(receiverId);

        if (receiver) {
          io.to(receiver.socketId).emit(
            "user_stop_typing",
            {
              userId,
            }
          );
        }
      }
    );

    // ==================================================
    // VOICE / VIDEO CALL
    // ==================================================

    // Caller -> Receiver
    socket.on(
      "call_user",
      ({
        receiverId,
        offer,
        callType,
      }) => {
        const receiver =
          onlineUsers.get(receiverId);

        if (!receiver) {
          socket.emit("call_error", {
            message: "User is offline",
          });

          return;
        }

        io.to(receiver.socketId).emit(
          "incoming_call",
          {
            callerId: userId,
            offer,
            callType,
          }
        );
      }
    );

    // Receiver -> Caller
    socket.on(
      "answer_call",
      ({
        callerId,
        answer,
      }) => {
        const caller =
          onlineUsers.get(callerId);

        if (!caller) {
          return;
        }

        io.to(caller.socketId).emit(
          "call_answered",
          {
            answer,
          }
        );
      }
    );

    // ICE candidate
    socket.on(
      "ice_candidate",
      ({
        receiverId,
        candidate,
      }) => {
        const receiver =
          onlineUsers.get(receiverId);

        if (!receiver) {
          return;
        }

        io.to(receiver.socketId).emit(
          "ice_candidate",
          {
            candidate,
          }
        );
      }
    );

    // End call
    socket.on(
      "end_call",
      ({
        receiverId,
      }) => {
        const receiver =
          onlineUsers.get(receiverId);

        if (!receiver) {
          return;
        }

        io.to(receiver.socketId).emit(
          "call_ended"
        );
      }
    );

    // -----------------------------
    // DISCONNECT
    // -----------------------------

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);

      socket.broadcast.emit(
        "user_offline",
        userId
      );

      console.log(
        "User disconnected:",
        userId
      );
    });
  });

  return io;
};