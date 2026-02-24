import express from "express";
import {
  login,
  register,
  updatePassword,
  getUser,
} from "../controllers/userController.js";
import { loginLimiter, registerLimiter } from "../middlewares/authLimiter.js";

const router = express.Router();

router.get("/getUser", getUser);
router.post("/login", loginLimiter, login);
router.post("/register", registerLimiter, register);
router.patch("/updatePassword", updatePassword);

export default router;
