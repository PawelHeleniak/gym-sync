export interface ExerciseSet {
  repsCount: number;
  weight?: number;
  done: boolean;
}
export interface Exercise {
  name: string;
  breakTime: number;
  isBreak?: boolean;
  comment: string;
  sets: ExerciseSet[];
}
export interface TrainingList {
  _id?: string;
  name: string;
  day?: number;
  badge?: boolean;
  estimatedTime: number;
  exercises: Exercise[];
  historyCount?: number;
}
