import express from "express";  
import dotenv from 'dotenv';
import { connectDB } from "./database/db.js";
import cloudinary from "cloudinary";
import cookieParser from "cookie-parser";


import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";


dotenv.config();

cloudinary.config({
    cloud_name: process.env.Cloudinary_Name,
    api_key: process.env.Cloudinary_Api,
    api_secret: process.env.Cloudinary_Secret,
})


console.log("PORT is:", process.env.PORT); 


const app = express();

//using middlewares
app.use(express.json());
app.use(cookieParser());





const port = process.env.PORT || 3000;

app.get("/", (req,res)=>{
    res.send("server is running");
})

//import routes


app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postRoutes);
app.use("/api/message", messageRoutes);



app.listen(port , () => {
    console.log(`Server is running on port  http://localhost:${port}`);
    connectDB();
})