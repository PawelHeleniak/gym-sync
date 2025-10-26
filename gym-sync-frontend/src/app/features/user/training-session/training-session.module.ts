interface trainingList {
  name: string;
  estimatedTime: number;
  workout: Exercise[];
}
interface Exercise {
  name: string;
  breakTime: number;
  break?: boolean;
  reps: ExerciseSet[];
}
interface ExerciseSet {
  count: number;
  weight?: number;
  done: boolean;
}
