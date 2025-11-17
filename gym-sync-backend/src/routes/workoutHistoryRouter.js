import express from "express";
import {
  addFinishedWorkout,
  getHistoryForPlan,
} from "../controllers/workoutHistoryController.js";

const router = express.Router();

router.post("/add", addFinishedWorkout);
router.get("/:id", getHistoryForPlan);

export default router;
