import express from "express";
import { login, register } from "../controllers/userController.js";
import { loginLimiter, registerLimiter } from "../middlewares/authLimiter.js";

const router = express.Router();

router.post("/login", loginLimiter, login);
router.post("/register", registerLimiter, register);

export default router;
