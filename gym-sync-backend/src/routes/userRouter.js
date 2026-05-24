import express from "express";
import {
  login,
  register,
  updatePassword,
  getUser,
  requestEmailChange,
  resendVerification,
  confirmEmailChange,
  confirmAccount,
} from "../controllers/userController.js";
import { loginLimiter, registerLimiter } from "../middlewares/authLimiter.js";
import { authenticateToken } from "../utils/jwt.js";

const router = express.Router();

router.get("/getUser", authenticateToken, getUser);
router.post("/login", loginLimiter, login);
router.post("/register", registerLimiter, register);
router.patch("/updatePassword", authenticateToken, updatePassword);
router.post("/requestEmailChange", authenticateToken, requestEmailChange);
router.post("/resendVerificationEmail", resendVerification);
router.post("/confirmEmailChange", authenticateToken, confirmEmailChange); // Zmienić na patch
router.post("/confirmAccount", confirmAccount);

export default router;
