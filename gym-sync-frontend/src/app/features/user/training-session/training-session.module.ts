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
  weight: number;
  reps: WorkoutReps[];
}
interface WorkoutReps {
  count: number;
  done: boolean;
}
