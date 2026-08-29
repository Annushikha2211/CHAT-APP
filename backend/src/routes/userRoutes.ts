import express from "express";

import {
  getUsers,
  getUserById,
  searchUsers,
} from "../controllers/userControllers";

const router = express.Router();

router.get("/", getUsers);

router.get("/search", searchUsers);

router.get("/:id", getUserById);

export default router;