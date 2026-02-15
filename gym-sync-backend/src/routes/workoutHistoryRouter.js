import express from "express";
import {
  addFinishedWorkout,
  getHistoryForPlan,
  getAllHistory,
} from "../controllers/workoutHistoryController.js";

const router = express.Router();

router.post("/add", addFinishedWorkout);
router.get("/:id", getHistoryForPlan);
router.get("/", getAllHistory);

export default router;
