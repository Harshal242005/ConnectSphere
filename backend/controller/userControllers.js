import TryCatch from "../utils/TryCatch.js";
import User from "../models/userModel.js";
import { log } from "console";
import getDataUrl from "../utils/urlGenerator.js";
import bcrypt from "bcrypt";

export const myProfile = TryCatch(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const userProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ user });
});

export const followandUnfollowUser = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);

  const loggedInUser = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.id.toString() === loggedInUser.id.toString()) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  if (loggedInUser.following.includes(user._id)) {
    const indexFollowing = loggedInUser.following.indexOf(user._id);
    const indexFollower = user.followers.indexOf(loggedInUser._id);
    loggedInUser.following.splice(indexFollowing, 1);
    user.followers.splice(indexFollower, 1);

    await loggedInUser.save();

    await user.save();

    res.json({
      message: "User Unfollowed",
    });
  } else {
    loggedInUser.following.push(user._id);
    user.followers.push(loggedInUser._id);

    await loggedInUser.save();

    await user.save();

    res.json({
      message: "User Followed",
    });
  }
});

export const userFolloerandFollowingData = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password ")
    .populate("followers", "-password")
    .populate("following", "-password");

  const followers = user.followers;
  const following = user.following;

  res.status(200).json({
    followers,
    following,
  });
});

export const updateProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  const { name } = req.body;

  if (name) {
    user.name = name;
  } else {
    return res.status(400).json({ message: "Name is required" });
  }

  const file = req.file;

  if (file) {
    const fileUrl = getDataUrl(file);

    if (user.profilePic.id) {
      await cloudinary.v2.uploader.destroy(user.profilePic.id);
    }

    const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content);
    user.profilePic = {
      id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  await user.save();

  res.json({
    message: "Profile Updated",
    user,
  });
});

export const updatePassword = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  const { oldPassword, newPassword } = req.body;

  const comparePassword = await bcrypt.compare(oldPassword, user.password);

  if (!comparePassword)
    return res.status(400).json({
      message: "Wrong old password",
    });

  user.password = await bcrypt.hash(newPassword, 10);

  await user.save();

  res.json({
    message: "Password Updated",
  });
});