export interface Workout {
  id: string;
  type: WorkoutType;
  name: string;
  duration: number; // in minutes
  calories: number;
  date: string;
  exercises: Exercise[];
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
}

export type WorkoutType = 
  | 'strength'
  | 'cardio'
  | 'yoga'
  | 'hiit'
  | 'cycling'
  | 'running'
  | 'swimming'
  | 'sports';

export interface WorkoutCategory {
  id: WorkoutType;
  name: string;
  icon: string;
  color: string;
  image: string;
}

export interface UserStats {
  totalWorkouts: number;
  totalCalories: number;
  totalMinutes: number;
  currentStreak: number;
  weeklyGoalProgress: number;
  personalRecords: PersonalRecord[];
}

export interface PersonalRecord {
  id: string;
  name: string;
  value: number;
  unit: string;
  date: string;
  previousBest?: number;
}

export interface UserProfile {
  name: string;
  weight: number;
  targetWeight: number;
  weeklyGoal: number;
  measurements: Measurement[];
}

export interface Measurement {
  date: string;
  weight: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
}

export interface WeeklyData {
  day: string;
  workouts: number;
  calories: number;
  minutes: number;
}
