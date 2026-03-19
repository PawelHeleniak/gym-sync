import express from "express";
import {
  addWorkout,
  getWorkout,
  getWorkouts,
  deleteWorkout,
  updateWorkout,
  getWorkoutDays,
} from "../controllers/workoutController.js";
import { authenticateToken } from "../utils/jwt.js";

const router = express.Router();

router.post("/add", addWorkout, authenticateToken);
router.put("/update/:id", updateWorkout, authenticateToken);
router.get("/getWorkoutDays", getWorkoutDays, authenticateToken);
router.get("/:id", getWorkout, authenticateToken);
router.get("/", getWorkouts, authenticateToken);
router.delete("/delete/:id", deleteWorkout, authenticateToken);

export default router;
