import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const rawUri = process.env.MONGODB_URI?.trim();
    const mongoUri = rawUri?.replace(/^['\"]|['\"]$/g, "");

    if (!mongoUri) {
      throw new Error("MONGODB_URI is missing in environment variables");
    }

    if (mongoUri.includes("<") || mongoUri.includes(">")) {
      throw new Error("MONGODB_URI appears to contain placeholder characters");
    }

    mongoose.connection.on("connected", () => console.log("MongoDB connected"));
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB;
