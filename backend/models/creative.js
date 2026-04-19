import mongoose from "mongoose";

const creativeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    outputType: { type: String, default: "" },
    aspectRatio: { type: String, default: "16:9" },
    thumbnailStyle: { type: String, default: "" },
    colorSchemeId: { type: String, default: "" },
    additionalPrompts: { type: String, default: "" },
    productImageName: { type: String, default: "" },
    model: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    prompt: { type: String, default: "" },
    sourceImageUrl: { type: String, default: "" },
    sourcePublicId: { type: String, default: "" },
    generatedPublicId: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Creative", creativeSchema);
