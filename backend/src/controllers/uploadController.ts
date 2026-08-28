import { Request, Response } from "express";

export const uploadFile = (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file selected",
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    return res.status(201).json({
      message: "File uploaded successfully",
      fileUrl,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
    });
  } catch (error) {
    console.log("Upload error:", error);

    return res.status(500).json({
      message: "File upload failed",
    });
  }
};