interface trainingList {
  name: string;
  estimatedTime: number;
  id: number;
  workout: Workout[];
}
interface Workout {
  name: string;
  breakTime: number;
  break?: boolean;
  set: number;
  reps: WorkoutReps[];
  weight: number;
}
interface WorkoutReps {
  count: number;
  done: boolean;
}
