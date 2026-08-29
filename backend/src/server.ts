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

app.use(
  cors({
    origin: "http://localhost:5173",
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