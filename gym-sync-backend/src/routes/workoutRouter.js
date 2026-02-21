import express from "express";
import {
  addWorkout,
  getWorkout,
  getWorkouts,
  deleteWorkout,
  updateWorkout,
  getWorkoutDays,
} from "../controllers/workoutController.js";

const router = express.Router();

router.post("/add", addWorkout);
router.put("/update/:id", updateWorkout);
router.get("/getWorkoutDays", getWorkoutDays);
router.get("/:id", getWorkout);
router.get("/", getWorkouts);
router.delete("/delete/:id", deleteWorkout);

export default router;
