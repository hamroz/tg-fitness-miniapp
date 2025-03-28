export type ExerciseCategory =
  | "cardio"
  | "strength"
  | "flexibility"
  | "balance";

export interface Exercise {
  _id: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  muscleGroup: string[];
  equipment: string[];
  imageUrl?: string;
  videoUrl?: string;
  timer?: number; // in seconds, for timed exercises
  isTimeBased: boolean;
}

export interface WorkoutLog {
  _id?: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  date: Date | string;
  reps?: number;
  sets?: number;
  weight?: number;
  duration?: number; // in seconds
  notes?: string;
}

export interface UserProgress {
  userId: string;
  workouts: WorkoutLog[];
  stats: {
    totalWorkouts: number;
    totalExercises: number;
    totalTime: number; // in seconds
  };
}
