import express from "express";
import {
  addWorkout,
  getWorkout,
  getWorkouts,
  deleteWorkout,
  updateWorkout,
  getWorkoutDays,
  duplicateWorkout,
} from "../controllers/workoutController.js";
import { authenticateToken } from "../utils/jwt.js";

const router = express.Router();

router.post("/add", authenticateToken, addWorkout);
router.post("/duplicate", authenticateToken, duplicateWorkout);
router.put("/update/:id", authenticateToken, updateWorkout);
router.get("/getWorkoutDays", authenticateToken, getWorkoutDays);
router.get("/:id", authenticateToken, getWorkout);
router.get("/", authenticateToken, getWorkouts);
router.delete("/delete/:id", authenticateToken, deleteWorkout);

export default router;
