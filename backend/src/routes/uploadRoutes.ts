import express from "express";
import upload from "../middleware/uploadMiddleware";
import { uploadFile } from "../controllers/uploadController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.single("file"),
  uploadFile
);

export default router;