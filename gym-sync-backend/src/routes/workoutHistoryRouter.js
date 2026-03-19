import express from "express";
import {
  addFinishedWorkout,
  getHistoryForPlan,
  getAllHistory,
} from "../controllers/workoutHistoryController.js";
import { authenticateToken } from "../utils/jwt.js";

const router = express.Router();

router.post("/add", authenticateToken, addFinishedWorkout);
router.get("/:id", authenticateToken, getHistoryForPlan);
router.get("/", authenticateToken, getAllHistory);

export default router;
