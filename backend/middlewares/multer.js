// multer.js
import multer from "multer";

const storage = multer.memoryStorage();

const uploadFile = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single("file");

export default (req, res, next) => {
  uploadFile(req, res, (err) => {
    if (err) {
      console.log("Multer error:", err.message);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};
