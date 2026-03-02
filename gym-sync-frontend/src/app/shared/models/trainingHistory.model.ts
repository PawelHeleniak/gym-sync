export interface WorkoutExerciseSetHistory {
  repsCount: number;
  timeCount: number;
  weight?: number;
  done: boolean;
}
export interface WorkoutExerciseHistory {
  name: string;
  breakTime: number;
  isBreak?: boolean;
  comment: string;
  sets: WorkoutExerciseSetHistory[];
  type?: 'break' | 'reps' | 'time';
}
export interface WorkoutHistory {
  date: string;
  planId: number;
  totalTime: number;
  exercises: WorkoutExerciseHistory[];
}
