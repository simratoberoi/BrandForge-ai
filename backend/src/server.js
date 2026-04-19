import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../configs/db.js";
import authRoutes from "./auth.js";
import creativesRoutes from "./creatives.js";
import mediaRoutes from "./media.js";
import generationRoutes from "./generations.js";

dotenv.config();
try {
  await connectDB();
} catch (error) {
  console.error("Starting server without database connection.", error.message);
}

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/health", (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(isDbConnected ? 200 : 503).json({
    success: isDbConnected,
    dbConnected: isDbConnected,
    message: isDbConnected ? "Service healthy" : "Database is not connected",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/creatives", creativesRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/generations", generationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
