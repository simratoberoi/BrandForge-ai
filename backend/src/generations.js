import express from "express";
import multer from "multer";
import verifyToken from "./middleware/verifyToken.js";
import cloudinary from "./services/cloudinary.js";
import { buildCreativePrompt } from "./services/gemini.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});
const IMAGE_MODEL = "gemini-2.5-flash-image";

const parseGenerateUpload = (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Image is too large. Max file size is 10MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid upload payload",
      error: error.message,
    });
  });
};

async function uploadSourceToCloudinary(file) {
  const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  return cloudinary.uploader.upload(base64, {
    folder: "brandforge/source",
    resource_type: "image",
  });
}

async function generateImageWithGemini(prompt, file) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent?key=${apiKey}`;
  const payload = {
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: [
              "Transform the provided product image into a premium, realistic product-marketing visual.",
              "Preserve core product identity while improving lighting, composition, and ad quality.",
              "Output one final polished image only.",
              "Creative direction:",
              prompt,
            ].join("\n"),
          },
          {
            inlineData: {
              data: file.buffer.toString("base64"),
              mimeType: file.mimetype,
            },
          },
        ],
      },
    ],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const upstreamMessage =
      data?.error?.message || "Gemini image generation failed";
    throw new Error(upstreamMessage);
  }

  const parts = data?.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p?.inlineData?.data);
  return imagePart?.inlineData?.data || null;
}

function buildFallbackPrompt(options) {
  return [
    `Create a premium product visual for ${options.title}.`,
    `Output type: ${options.outputType || "Product Marketing Mockup"}.`,
    `Aspect ratio: ${options.aspectRatio || "16:9"}.`,
    `Creative style: ${options.thumbnailStyle || "Cinematic"}.`,
    `Color mood: ${options.colorSchemeId || "balanced"}.`,
    `Extra direction: ${options.additionalPrompts || "clean studio lighting with realistic shadows"}.`,
    "Preserve the product identity and brand-safe realism.",
  ].join(" ");
}

function mapGeminiError(error) {
  const rawMessage = error?.message || "Unknown generation error";

  if (rawMessage.includes("API_KEY_INVALID")) {
    return {
      status: 500,
      message:
        "Invalid GEMINI_API_KEY. Update backend/.env with a valid Google AI Studio API key and restart backend.",
      error: rawMessage,
    };
  }

  if (rawMessage.includes("PERMISSION_DENIED")) {
    return {
      status: 500,
      message:
        "Gemini access denied for this API key or model. Check key permissions and enabled models.",
      error: rawMessage,
    };
  }

  if (
    rawMessage.includes("RESOURCE_EXHAUSTED") ||
    rawMessage.includes("quota")
  ) {
    return {
      status: 429,
      message:
        "Gemini quota exceeded for image generation. Enable billing or wait for quota reset, then retry.",
      error: rawMessage,
    };
  }

  return {
    status: 500,
    message: "Generation failed",
    error: rawMessage,
  };
}

router.post("/generate", verifyToken, parseGenerateUpload, async (req, res) => {
  try {
    const { title, outputType, aspectRatio, thumbnailStyle, colorSchemeId } =
      req.body;
    const additionalPrompts = req.body.additionalPrompts || "";
    const model = req.body.model || "premium";
    const productImageName =
      req.body.productImageName || req.file?.originalname || "";

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "image file is required" });
    }

    if (!req.file.mimetype?.startsWith("image/")) {
      return res
        .status(400)
        .json({ success: false, message: "Only image files are allowed" });
    }

    if (!title?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "title is required" });
    }

    const options = {
      title,
      outputType,
      aspectRatio,
      thumbnailStyle,
      colorSchemeId,
      additionalPrompts,
      model,
      productImageName,
    };

    let finalPrompt = "";
    let promptFallbackUsed = false;

    try {
      finalPrompt = await buildCreativePrompt(options);
    } catch {
      // Keep generation alive even if prompt-refinement model fails.
      finalPrompt = buildFallbackPrompt(options);
      promptFallbackUsed = true;
    }

    const generatedImageBase64 = await generateImageWithGemini(
      finalPrompt,
      req.file,
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

    const sourceUploaded = await uploadSourceToCloudinary(req.file);

    return res.json({
      success: true,
      prompt: finalPrompt,
      promptFallbackUsed,
      generatedImageUrl: uploaded.secure_url,
      generatedPublicId: uploaded.public_id,
      sourceImageUrl: sourceUploaded.secure_url,
      sourcePublicId: sourceUploaded.public_id,
    });
  } catch (error) {
    const mapped = mapGeminiError(error);
    return res.status(mapped.status).json({
      success: false,
      message: mapped.message,
      error: mapped.error,
    });
  }
});

export default router;
