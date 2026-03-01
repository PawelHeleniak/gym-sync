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

const router = express.Router();

router.get("/getUser", getUser);
router.post("/login", loginLimiter, login);
router.post("/register", registerLimiter, register);
router.patch("/updatePassword", updatePassword);
router.post("/requestEmailChange", requestEmailChange);
router.post("/resendVerificationEmail", resendVerification);
router.post("/confirmEmailChange", confirmEmailChange); // Zmienić na patch
router.post("/confirmAccount", confirmAccount);

export default router;
