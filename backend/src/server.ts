import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";

import connectDatabase from "./config/database";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import messageRoutes from "./routes/messageRoutes";
import profileRoutes from "./routes/profileRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import path from "path";
import cardRoutes from "./routes/cardRoutes";
import friendRequestRoutes from "./routes/friendRequestRoutes";


import { initializeSocket } from "./socket/socket";

dotenv.config();

const app = express();

const httpServer = http.createServer(app);

initializeSocket(httpServer);

connectDatabase();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-app-git-main-annushikha.vercel.app",
  "https://chat-app-annushikha.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.use(
  "/api/friend-requests",
  friendRequestRoutes
);

app.use("/api/upload", uploadRoutes);


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/cards", cardRoutes);



app.get("/", (req, res) => {
  res.send("Chat app server is running");
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});