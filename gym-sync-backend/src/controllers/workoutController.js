import Workout from "../models/Workout.js";

const getUserId = (req) => req.user?.userId || req.query.userId;

export const addWorkout = async (req, res) => {
  try {
    const newBody = req.body;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ error: "Brak autoryzacji" });
    }

    const existingWorkout = await Workout.findOne({
      name: newBody.name,
      userId,
    });

    if (existingWorkout) {
      return res
        .status(400)
        .json({ message: "Trening o tej nazwie już istnieje" });
    }

    newBody.estimatedTime = calculateEstimatedTime(newBody.exercises);
    newBody.userId = userId;
    const newWorkout = new Workout(newBody);
    await newWorkout.save();

    res.status(201).json({ message: "Trening zaktualizowany" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWorkout = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ error: "Brak autoryzacji" });
    }

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
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ error: "Brak autoryzacji" });
    }

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
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ error: "Brak autoryzacji" });
    }

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
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ error: "Brak autoryzacji" });
    }

    newBody.estimatedTime = calculateEstimatedTime(newBody.exercises);

    const existingWorkout = await Workout.findOne({
      name: newBody.name,
      userId,
      _id: { $ne: id }, // ciekawostka to wyklucza aktualnie edytowany
    });

    if (existingWorkout) {
      return res.status(400).json({
        message: "Trening o tej nazwie już istnieje",
      });
    }

    const updatedWorkout = await Workout.findOneAndUpdate(
      { _id: id, userId },
      newBody,
      { new: true, runValidators: true },
    );

    if (!updatedWorkout)
      return res.status(404).json({ error: "Trening nie znaleziony" });

    res
      .status(200)
      .json({ message: "Trening zaktualizowany", workout: updatedWorkout });
  } catch (err) {
    console.error("Błąd aktualizowania treningu:", err.message);
    res.status(500).json({ error: "Nie udało się zaktualizować treningu" });
  }
};

const calculateEstimatedTime = (exercises = []) => {
  return exercises.reduce((total, ex) => {
    const sets = Array.isArray(ex.sets) ? ex.sets : [];
    const breakTime = Number(ex.breakTime) || 0;

    if (ex.isBreak || ex.type === "break") {
      return total + breakTime;
    }

    const setsTime = sets.reduce((sum, set) => {
      if (ex.type === "reps") {
        return sum + (Number(set.repsCount) || 0) * 3;
      }

      return sum + (Number(set.timeCount) || 0);
    }, 0);

    const breaksTime = breakTime * sets.length;

    return total + setsTime + breaksTime;
  }, 0);
};

export const getWorkoutDays = async (req, res) => {
  try {
    const userId = getUserId(req);
    console.log(req.user);

    if (!userId) return res.status(401).json({ error: "Brak autoryzacji" });

    const days = await Workout.distinct("day", { userId });

    res.status(200).json(days);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nie udało się pobrać treningu" });
  }
};
