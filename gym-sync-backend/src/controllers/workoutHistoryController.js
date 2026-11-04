import mongoose from "mongoose";
import WorkoutHistory from "../models/WorkoutHistory.js";

const getUserId = (req) => req.user?.userId || req.query.userId;

export const addFinishedWorkout = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(400).json({ error: "Brak userId" });

    const finished = new WorkoutHistory({
      userId,
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
    const userId = getUserId(req);
    const history = await WorkoutHistory.find({
      planId: req.params.id,
      userId,
    }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMonthlyWorkoutCounts = async (req, res) => {
  try {
    const id = getUserId(req);
    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(401).json({ error: "Brak autoryzacji" });
    }
    const userId = new mongoose.Types.ObjectId(id);
    const year = Number(req.query.year);
    if (!Number.isInteger(year) || year < 1000 || year > 9999) {
      return res.status(400).json({ error: "Nieprawidłowy rok" });
    }

    const startDate = new Date(Date.UTC(year, 0, 1));
    const endDate = new Date(Date.UTC(year + 1, 0, 1));

    const history = await WorkoutHistory.aggregate([
      {
        $match: {
          userId,
          date: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const monthlyWorkoutCounts = Array(12).fill(0);
    history.forEach((month) => {
      monthlyWorkoutCounts[month._id - 1] = month.count;
    });

    res.json({ year, monthlyWorkoutCounts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllHistory = async (req, res) => {
  try {
    const userId = getUserId(req);
    const history = await WorkoutHistory.find({ userId }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
