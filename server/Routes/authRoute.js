// Routes/authRoutes.js
import express from "express";
import { loginController } from "../Controller/authController.js";

const router = express.Router();

router.post("/login", loginController);

export default router;
