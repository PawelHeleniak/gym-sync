export interface WorkoutExerciseSetHisotry {
  repsCount: number;
  weight?: number;
  done: boolean;
}
export interface WorkoutExerciseHisotry {
  name: string;
  breakTime: number;
  isBreak?: boolean;
  comment: string;
  sets: WorkoutExerciseSetHisotry[];
}
export interface WorkoutHisotry {
  date: string;
  planId: number;
  totalTime: number;
  exercises: WorkoutExerciseHisotry[];
}
