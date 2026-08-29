import express from "express";

import {
  sendFriendRequest,
  getReceivedRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
} from "../controllers/friendRequestController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/send",
  protect,
  sendFriendRequest
);

router.get(
  "/received",
  protect,
  getReceivedRequests
);

router.put(
  "/:requestId/accept",
  protect,
  acceptFriendRequest
);

router.put(
  "/:requestId/reject",
  protect,
  rejectFriendRequest
);

router.get(
  "/friends",
  protect,
  getFriends
);

export default router;