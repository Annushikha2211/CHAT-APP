import express from "express";

import {
  createCard,
  getMyCards,
} from "../controllers/cardController";

import {
  protect,
} from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/",
  protect,
  createCard
);

router.get(
  "/my",
  protect,
  getMyCards
);

export default router;