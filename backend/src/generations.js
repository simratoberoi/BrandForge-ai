import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import verifyToken from "./middleware/verifyToken.js";
import cloudinary from "./services/cloudinary.js";
import { buildCreativePrompt } from "./services/gemini.js";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateImageWithGemini(prompt, sourceImageUrl) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-preview-image-generation",
  });

  const result = await model.generateContent([
    {
      text: [
        "Create a studio-quality marketing creative.",
        "Use this product image as reference:",
        sourceImageUrl,
        "Final creative prompt:",
        prompt,
      ].join("\n"),
    },
  ]);

  const parts = result?.response?.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p?.inlineData?.data);
  return imagePart?.inlineData?.data || null;
}

router.post("/generate", verifyToken, async (req, res) => {
  try {
    const { sourceImageUrl, ...options } = req.body;

    if (!sourceImageUrl) {
      return res
        .status(400)
        .json({ success: false, message: "sourceImageUrl required" });
    }

    const finalPrompt = await buildCreativePrompt(options);
    const generatedImageBase64 = await generateImageWithGemini(
      finalPrompt,
      sourceImageUrl,
    );

    if (!generatedImageBase64) {
      return res.status(501).json({
        success: false,
        message:
          "Gemini did not return image bytes. Prompt was generated successfully.",
        prompt: finalPrompt,
      });
    }

    const uploaded = await cloudinary.uploader.upload(
      `data:image/png;base64,${generatedImageBase64}`,
      { folder: "brandforge/generated", resource_type: "image" },
    );

    return res.json({
      success: true,
      prompt: finalPrompt,
      generatedImageUrl: uploaded.secure_url,
      generatedPublicId: uploaded.public_id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Generation failed",
      error: error.message,
    });
  }
});

export default router;
