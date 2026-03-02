export interface ExerciseSet {
  repsCount: number;
  timeCount: number;
  weight?: number;
  done: boolean;
}
export interface Exercise {
  name: string;
  breakTime: number;
  isBreak?: boolean;
  comment: string;
  sets: ExerciseSet[];
  type?: 'break' | 'reps' | 'time';
}
export interface TrainingList {
  _id?: string;
  name?: string;
  day?: number;
  badge?: boolean;
  estimatedTime: number;
  exercises: Exercise[];
  historyCount?: number;
}
