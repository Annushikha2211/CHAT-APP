
import express from "express";

import userRoutes from "./routes/userRoutes";
import messageRoutes from "./routes/messageRoutes";
import cardRoutes from "./routes/cardRoutes";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/messages", messageRoutes);
router.use("/cards", cardRoutes);

export default router;