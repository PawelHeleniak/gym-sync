import mongoose from "mongoose";

const exerciseSetSchema = new mongoose.Schema({
  repsCount: { type: Number, required: true },
  weight: { type: Number },
  done: { type: Boolean, default: false },
});

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breakTime: { type: Number, required: true },
  isRest: { type: Boolean, default: false },
  sets: [exerciseSetSchema],
});

const trainingPlanSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  estimatedTime: { type: Number, required: true },
  exercises: [exerciseSchema],
});

const Workout = mongoose.model("Workout", trainingPlanSchema);
export default Workout;
