import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // ✅ import FIRST
import cookieParser from "cookie-parser";
import path from "path";
import cloudinary from "cloudinary";
import connectDB from "./database/db.js";
import { Chat } from "./models/ChatModel.js";
import { isAuth } from "./middlewares/isAuth.js";
import User from "./models/userModel.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.Cloudinary_Name,    // ✅ was Cloudinary_Cloud_Name
  api_key: process.env.Cloudinary_Api,        // ✅ correct
  api_secret: process.env.Cloudinary_Secret,  // ✅ correct
});

// ✅ cors FIRST before everything
app.use(
  cors({
    origin: function (origin, callback) {
      const allowed = [
        "http://localhost:5173",
        "https://connect-sphere-1.vercel.app",
      ];
      if (
        !origin ||
        allowed.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },

    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
);

// ✅ handle preflight
app.options(
  /.*/,
  cors({
    origin: function (origin, callback) {
      const allowed = [
        "http://localhost:5173",
        "https://connect-sphere-1.vercel.app",
      ];
      if (
        !origin ||
        allowed.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },

    credentials: true,
  }),
);


// middlewares
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT;

// routes
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

// to get all chats of user
app.get("/api/messages/chats", isAuth, async (req, res) => {
  try {
    const chats = await Chat.find({
      users: req.user._id,
    }).populate({
      path: "users",
      select: "name profilePic",
    });

    console.log("chats found:", chats.length); 
    const formattedChats = chats.map((chat) => {
      const chatObj = chat.toObject();
      chatObj.users = chatObj.users.filter(
        (user) => user._id.toString() !== req.user._id.toString(),
      );
      return chatObj;
    });

    res.json(formattedChats);
  } catch (error) {
    console.error("Chat error:", error.message); 
    res.status(500).json({ message: error.message });
  }
});

// to get all users
app.get("/api/user/all", isAuth, async (req, res) => {
  try {
    const search = req.query.search || "";
    const users = await User.find({
      name: { $regex: search, $options: "i" },
      _id: { $ne: req.user._id },
    }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/messages", messageRoutes);


const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDB();
});
