import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDatabase from "./config/database";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import messageRoutes from "./routes/messageRoutes";

dotenv.config();

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

connectDatabase();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Chat app server is running");
});

/* ================= SOCKET.IO ================= */

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("join", (userId: string) => {
    socket.join(userId);

    console.log(
      `👤 User ${userId} joined room`
    );
  });

  socket.on("sendMessage", (message) => {
    console.log("📨 New socket message:", message);

    io.to(message.receiver).emit(
      "receiveMessage",
      message
    );
  });

  socket.on("disconnect", () => {
    console.log(
      "🔴 User disconnected:",
      socket.id
    );
  });
});

/* ============================================= */

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});