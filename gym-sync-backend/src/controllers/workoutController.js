import Workout from "../models/Workout.js";

export const addWorkout = async (req, res) => {
  try {
    const newWorkout = new Workout(req.body);
    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
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
    const workout = await Workout.find();
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
    const workout = await Workout.findByIdAndDelete(req.params.id);
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
    const updatedWorkout = await Workout.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedWorkout) {
      return res.status(404).json({ error: "Trening nie znaleziony" });
    }

    res.status(200).json({ message: "Trening zaktualizowany", workout });
  } catch (err) {
    console.error("Błąd aktualizowania treningu:", err.message);
    res.status(500).json({ error: "Nie udało się zaktualizować treningu" });
  }
};
