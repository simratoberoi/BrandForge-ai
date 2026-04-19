import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
