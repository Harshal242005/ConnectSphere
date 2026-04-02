import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {myProfile, userProfile, followandUnfollowUser, userFolloerandFollowingData, updateProfile, updatePassword, getAllUsers} from "../controller/userControllers.js";
import uploadFile from "../middlewares/multer.js";

const router = express.Router();

router.get("/me" , isAuth, myProfile);
router.get("/followdata/:id" , isAuth, userFolloerandFollowingData);
router.post("/follow/:id" , isAuth, followandUnfollowUser);
router.put("/:id" , isAuth,uploadFile, updateProfile);
router.get("/all" , isAuth, getAllUsers);


router.get("/:id" , isAuth, userProfile);
router.post("/:id" , isAuth, updatePassword);
export default router;


