import mongoose from "mongoose";

const exerciseSetSchema = new mongoose.Schema({
  repsCount: { type: Number, required: true },
  weight: { type: Number },
  done: { type: Boolean, required: true, default: false },
});

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breakTime: { type: Number, required: true },
  isBreak: { type: Boolean, default: false },
  comment: { type: String },
  sets: {
    type: [exerciseSetSchema],
    validate: [
      (arr) => arr.length > 0 || !this.isBreak,
      "Ćwiczenie musi mieć przynajmniej jeden set",
    ],
  },
});

const workoutSchema = new mongoose.Schema({
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "Workout" },
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  estimatedTime: { type: Number },
  day: { type: Number },
  badge: { type: Boolean },
  exercises: {
    type: [exerciseSchema],
    validate: [
      (arr) => arr.length > 0 || !this.isBreak,
      "plan musi mieć przynajmniej jeden exercise",
    ],
  },
});

const Workout = mongoose.model("Workout", workoutSchema);
export default Workout;
