import express from "express";

import {
  getUsers,
  searchUsers,
} from "../controllers/userControllers";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getUsers);

router.get(
  "/search",
  protect,
  searchUsers
);

export default router;