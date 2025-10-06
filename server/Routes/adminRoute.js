// Routes/adminRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  registerAdmin,
  getAllAdminsController,
  getAdminByIdController,
  updateAdminController,
  deleteAdminController,
} from "../Controller/adminController.js";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const photoDir = path.join(process.cwd(), "uploads", "admins");
    if (!fs.existsSync(photoDir)) {
      fs.mkdirSync(photoDir, { recursive: true });
    }
    cb(null, photoDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes
router.post("/create", upload.single("photo"), registerAdmin);
router.get("/get", getAllAdminsController);
router.get("/get/:id", getAdminByIdController);
router.put("/update/:id", upload.single("photo"), updateAdminController);
router.delete("/delete/:id", deleteAdminController);

export default router;
