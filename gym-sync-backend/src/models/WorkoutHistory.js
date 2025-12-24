import mongoose from "mongoose";

const exerciseSetSchema = new mongoose.Schema({
  repsCount: Number,
  weight: Number,
  done: Boolean,
});

const exerciseSchema = new mongoose.Schema({
  name: String,
  breakTime: Number,
  isBreak: Boolean,
  comment: String,
  sets: [exerciseSetSchema],
});

const workoutHistorySchema = new mongoose.Schema({
  planId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  totalTime: { type: Number, required: true },
  day: { type: Number },
  badge: { type: Boolean },
  exercises: [exerciseSchema],
});

export default mongoose.model("WorkoutHistory", workoutHistorySchema);
