import express from "express";
import { loginUser, logOutUser, registerUser } from "../controller/auth.controllers.js";
import uploadFile from "../middlewares/multer.js";

const router = express.Router();


router.post("/register",  uploadFile , registerUser);
router.post("/login", loginUser);
router.get("/logout", logOutUser);





export default router;



