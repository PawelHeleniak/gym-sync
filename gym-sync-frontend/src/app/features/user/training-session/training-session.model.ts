interface ExerciseSet {
  repsCount: number;
  weight?: number;
  done: boolean;
}
interface Exercise {
  name: string;
  breakTime: number;
  isBreak?: boolean;
  comment: string;
  sets: ExerciseSet[];
}
interface trainingList {
  _id?: string;
  name: string;
  estimatedTime: number;
  exercises: Exercise[];
}
interface TimeItem {
  name: string;
  repsCount: number;
  weight?: number;
  time: string;
  isBreak?: boolean;
}
