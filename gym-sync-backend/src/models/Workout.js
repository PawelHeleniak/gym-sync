import mongoose from "mongoose";

const exerciseSetSchema = new mongoose.Schema({
  repsCount: { type: Number, required: true },
  weight: { type: Number },
  done: { type: Boolean, required: true, default: false },
});

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breakTime: { type: Number, required: true },
  isRest: { type: Boolean, default: false },
  sets: {
    type: [exerciseSetSchema],
    validate: [
      (arr) => arr.length > 0 || !this.isRest,
      "Ćwiczenie musi mieć przynajmniej jeden set",
    ],
  },
});

const trainingPlanSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  estimatedTime: { type: Number, required: true },
  exercises: {
    type: [exerciseSchema],
    validate: [
      (arr) => arr.length > 0 || !this.isRest,
      "plan musi mieć przynajmniej jeden exercise",
    ],
  },
});

const Workout = mongoose.model("Workout", trainingPlanSchema);
export default Workout;
