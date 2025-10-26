interface trainingList {
  _id?: string;
  name: string;
  estimatedTime: number;
  exercises: Exercise[];
}
interface Exercise {
  name: string;
  breakTime: number;
  isBreak?: boolean;
  sets: ExerciseSet[];
}
interface ExerciseSet {
  repsCount: number;
  weight?: number;
  done: boolean;
}
