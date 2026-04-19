import express from "express";
import Creative from "../models/creative.js";
import verifyToken from "./middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const creative = await Creative.create({
      ...req.body,
      userId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      creative,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create creative",
      error: error.message,
    });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const creatives = await Creative.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    return res.json({ success: true, creatives });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch creatives",
      error: error.message,
    });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const creative = await Creative.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!creative) {
      return res
        .status(404)
        .json({ success: false, message: "Creative not found" });
    }

    return res.json({ success: true, creative });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch creative",
      error: error.message,
    });
  }
});

export default router;
