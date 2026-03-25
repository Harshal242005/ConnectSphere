import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database/db.js";
import cloudinary from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.Cloudinary_Name,
  api_key: process.env.Cloudinary_Api,
  api_secret: process.env.Cloudinary_Secret,
});

const app = express();

// Security middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: "Too many requests, please try again later" },
});
app.use("/api/", limiter);

// Auth-specific stricter rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many login attempts, please try again later" },
});
app.use("/api/auth", authLimiter);

// Parsing & logging middlewares
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("server is running");
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postRoutes);
app.use("/api/message", messageRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Connect to DB before starting server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
