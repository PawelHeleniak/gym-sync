import express from "express";
import {
  login,
  register,
  updatePassword,
  getUser,
  requestEmailChange,
  confirmEmailChange,
} from "../controllers/userController.js";
import { loginLimiter, registerLimiter } from "../middlewares/authLimiter.js";

const router = express.Router();

router.get("/getUser", getUser);
router.post("/login", login);
router.post("/register", registerLimiter, register);
router.patch("/updatePassword", updatePassword);
router.post("/requestEmailChange", requestEmailChange);
router.post("/confirmEmailChange", confirmEmailChange);

export default router;
