import mongoose from "mongoose";

const workoutRepsSchema = new mongoose.Schema({
  count: { type: Number, required: true },
  estimatedTime: { type: Boolean, required: true },
});
const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breakTime: { type: Number, required: true },
  break: { type: Boolean, required: false },
  set: { type: Number, required: true },
  weight: { type: Number, required: true },
  reps: [workoutRepsSchema],
});
const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  estimatedTime: { type: Number, required: true },
  id: { type: Number, required: true },
  workout: [workoutSchema],
});

const Workout = mongoose.model("Workout", listSchema);
export default Workout;
