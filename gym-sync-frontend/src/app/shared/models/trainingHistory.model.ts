export interface WorkoutExerciseSetHistory {
  repsCount: number;
  weight?: number;
  done: boolean;
}
export interface WorkoutExerciseHistory {
  name: string;
  breakTime: number;
  isBreak?: boolean;
  comment: string;
  sets: WorkoutExerciseSetHistory[];
}
export interface WorkoutHistory {
  date: string;
  planId: number;
  totalTime: number;
  exercises: WorkoutExerciseHistory[];
}
