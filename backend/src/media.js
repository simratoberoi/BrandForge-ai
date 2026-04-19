import express from "express";
import multer from "multer";
import cloudinary from "./services/cloudinary.js";
import verifyToken from "./middleware/verifyToken.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload-source",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No image uploaded" });
      }

      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(base64, {
        folder: "brandforge/source",
        resource_type: "image",
      });

      return res.json({
        success: true,
        sourceImageUrl: result.secure_url,
        sourcePublicId: result.public_id,
      });
    } catch (error) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Upload failed",
          error: error.message,
        });
    }
  },
);

export default router;
