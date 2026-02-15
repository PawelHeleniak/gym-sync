import WorkoutHistory from "../models/WorkoutHistory.js";

export const addFinishedWorkout = async (req, res) => {
  try {
    const finished = new WorkoutHistory({
      planId: req.body.planId,
      totalTime: req.body.totalTime,
      estimatedTime: req.body.estimatedTime || null,
      exercises: req.body.exercises,
    });
    const saved = await finished.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getHistoryForPlan = async (req, res) => {
  try {
    const history = await WorkoutHistory.find({
      planId: req.params.id,
    }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getAllHistory = async (req, res) => {
  try {
    const history = await WorkoutHistory.find().sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
