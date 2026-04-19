import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ============================================
// ANALYZE PRODUCT IMAGE & GENERATE ENHANCEMENT PROMPT
// ============================================
export async function analyzeProductImage(imageBase64, payload) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const instruction = `
You are a professional product photographer and designer. Analyze this product image and create a detailed prompt to transform it into a high-end, professional product photography image suitable for premium ads, websites, and social media.

Current Product: ${payload.title}
Desired Style: ${payload.thumbnailStyle || "professional"}
Color Scheme: ${payload.colorSchemeId || "luxury"}
Aspect Ratio: ${payload.aspectRatio || "16:9"}
Platform: ${payload.outputType || "e-commerce"}

Analyze the current product and provide a SINGLE detailed, vivid prompt that describes:
1. Professional studio photography setup
2. Lighting: Key light, fill light, background lighting
3. Background: Clean, premium, complementary to the product
4. Product positioning and angle
5. Post-processing: Color grading, clarity, depth
6. Mood and atmosphere

Output ONLY the final prompt text to generate a high-end product image. Make it cinematic and premium.
`;

  const response = await model.generateContent([
    {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg",
      },
    },
    instruction,
  ]);

  return response.response.text().trim();
}

// ============================================
// BUILD CREATIVE PROMPT (TEXT-ONLY)
// ============================================
export async function buildCreativePrompt(payload) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const instruction = `
Create one high-converting product ad image prompt.
Output only the final prompt text.
Title: ${payload.title}
Output Type: ${payload.outputType}
Style: ${payload.thumbnailStyle}
Aspect Ratio: ${payload.aspectRatio}
Color Scheme: ${payload.colorSchemeId}
Extra: ${payload.additionalPrompts || "none"}
`;

  const result = await model.generateContent(instruction);
  return result.response.text().trim();
}
