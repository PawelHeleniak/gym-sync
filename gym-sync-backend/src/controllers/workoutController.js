import Workout from "../models/Workout.js";

export const addWorkout = async (req, res) => {
  try {
    const newBody = req.body;
    const { userId } = req.query;

    newBody.estimatedTime = calculateEstimatedTime(newBody.exercises);
    newBody.userId = userId;
    const newWorkout = new Workout(newBody);
    const savedWorkout = await newWorkout.save();

    res.status(201).json(savedWorkout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getWorkout = async (req, res) => {
  try {
    const { userId } = req.query;
    const workout = await Workout.findOne({
      _id: req.params.id,
      userId,
    });
    if (!workout)
      return res.status(404).json({ error: "Trening nie znaleziony" });

    res.status(200).json(workout);
  } catch (err) {
    console.error("Błąd pobierania treningu:", err.message);
    res.status(500).json({ error: "Nie udało się pobrać treningu" });
  }
};
export const getWorkouts = async (req, res) => {
  try {
    const { userId } = req.query;
    const workout = await Workout.find({ userId });

    if (!workout)
      return res.status(404).json({ error: "Lista treningów nie znaleziona" });

    res.status(200).json(workout);
  } catch (err) {
    console.error("Błąd pobierania listy treningów:", err.message);
    res.status(500).json({ error: "Nie udało się pobrać listy treningów" });
  }
};
export const deleteWorkout = async (req, res) => {
  try {
    const { userId } = req.query;
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!workout)
      return res.status(404).json({ error: "Trening nie znaleziony" });

    res.status(200).json({ message: "Trening usunięty", workout });
  } catch (err) {
    console.error("Błąd usuwania treningu:", err.message);
    res.status(500).json({ error: "Nie udało się usunąć treningu" });
  }
};
export const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const newBody = req.body;
    const { userId } = req.query;

    newBody.estimatedTime = calculateEstimatedTime(newBody.exercises);

    const updatedWorkout = await Workout.findOneAndUpdate(
      { _id: id, userId },
      newBody,
      { new: true, runValidators: true },
    );

    if (!updatedWorkout) {
      return res.status(404).json({ error: "Trening nie znaleziony" });
    }

    res
      .status(200)
      .json({ message: "Trening zaktualizowany", workout: updatedWorkout });
  } catch (err) {
    console.error("Błąd aktualizowania treningu:", err.message);
    res.status(500).json({ error: "Nie udało się zaktualizować treningu" });
  }
};

const calculateEstimatedTime = (exercises = []) => {
  return exercises.reduce((sum, e) => {
    const setsCount = Array.isArray(e.sets) ? e.sets.length : 0;
    const breakTime = Number(e.breakTime) || 0;
    return sum + breakTime * setsCount;
  }, 0);
};
