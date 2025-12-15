import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Workout, Exercise, UserProfile, Measurement, PersonalRecord, UserStats } from '@/types/fitness';

interface UseFitnessDataProps {
  userId: string | undefined;
}

export function useFitnessData({ userId }: UseFitnessDataProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data
  const fetchData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch workouts with exercises
      const { data: workoutsData, error: workoutsError } = await supabase
        .from('workouts')
        .select(`
          *,
          exercises (*)
        `)
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (workoutsError) throw workoutsError;

      // Transform workouts data
      const transformedWorkouts: Workout[] = (workoutsData || []).map(w => ({
        id: w.id,
        type: w.type,
        name: w.name,
        duration: w.duration,
        calories: w.calories,
        date: w.date,
        notes: w.notes,
        exercises: (w.exercises || []).map((e: any) => ({
          id: e.id,
          name: e.name,
          sets: e.sets,
          reps: e.reps,
          weight: e.weight,
          duration: e.duration,
        })),
      }));

      setWorkouts(transformedWorkouts);

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') throw profileError;

      if (profileData) {
        setUserProfile({
          name: profileData.name,
          weight: profileData.weight,
          targetWeight: profileData.target_weight,
          weeklyGoal: profileData.weekly_goal,
          measurements: [],
        });
      }

      // Fetch measurements
      const { data: measurementsData, error: measurementsError } = await supabase
        .from('measurements')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (measurementsError) throw measurementsError;

      const transformedMeasurements: Measurement[] = (measurementsData || []).map(m => ({
        date: m.date,
        weight: m.weight,
        bodyFat: m.body_fat,
        chest: m.chest,
        waist: m.waist,
        hips: m.hips,
      }));

      setMeasurements(transformedMeasurements);

      // Fetch personal records
      const { data: recordsData, error: recordsError } = await supabase
        .from('personal_records')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (recordsError) throw recordsError;

      const transformedRecords: PersonalRecord[] = (recordsData || []).map(r => ({
        id: r.id,
        name: r.name,
        value: r.value,
        unit: r.unit,
        date: r.date,
        previousBest: r.previous_best,
      }));

      setPersonalRecords(transformedRecords);

    } catch (err: any) {
      console.error('Error fetching fitness data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!userId) return;

    fetchData();

    // Subscribe to workouts changes
    const workoutsChannel = supabase
      .channel('workouts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workouts',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    // Subscribe to exercises changes
    const exercisesChannel = supabase
      .channel('exercises-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'exercises',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    // Subscribe to measurements changes
    const measurementsChannel = supabase
      .channel('measurements-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'measurements',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    // Subscribe to personal_records changes
    const recordsChannel = supabase
      .channel('records-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'personal_records',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(workoutsChannel);
      supabase.removeChannel(exercisesChannel);
      supabase.removeChannel(measurementsChannel);
      supabase.removeChannel(recordsChannel);
    };
  }, [userId, fetchData]);

  // Add workout
  const addWorkout = async (workout: Omit<Workout, 'id'>) => {
    if (!userId) return { error: 'Not authenticated' };

    try {
      // Insert workout
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          user_id: userId,
          type: workout.type,
          name: workout.name,
          duration: workout.duration,
          calories: workout.calories,
          date: workout.date,
          notes: workout.notes,
        })
        .select()
        .single();

      if (workoutError) throw workoutError;

      // Insert exercises
      if (workout.exercises.length > 0) {
        const exercisesToInsert = workout.exercises.map(e => ({
          workout_id: workoutData.id,
          user_id: userId,
          name: e.name,
          sets: e.sets,
          reps: e.reps,
          weight: e.weight,
          duration: e.duration,
        }));

        const { error: exercisesError } = await supabase
          .from('exercises')
          .insert(exercisesToInsert);

        if (exercisesError) throw exercisesError;
      }

      return { data: workoutData, error: null };
    } catch (err: any) {
      console.error('Error adding workout:', err);
      return { error: err.message };
    }
  };

  // Delete workout
  const deleteWorkout = async (workoutId: string) => {
    if (!userId) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId)
        .eq('user_id', userId);

      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      console.error('Error deleting workout:', err);
      return { error: err.message };
    }
  };

  // Update user profile
  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!userId) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: profile.name,
          weight: profile.weight,
          target_weight: profile.targetWeight,
          weekly_goal: profile.weeklyGoal,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) throw error;

      // Refresh profile
      fetchData();
      return { error: null };
    } catch (err: any) {
      console.error('Error updating profile:', err);
      return { error: err.message };
    }
  };

  // Add measurement
  const addMeasurement = async (measurement: Omit<Measurement, 'date'> & { date?: string }) => {
    if (!userId) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('measurements')
        .insert({
          user_id: userId,
          date: measurement.date || new Date().toISOString().split('T')[0],
          weight: measurement.weight,
          body_fat: measurement.bodyFat,
          chest: measurement.chest,
          waist: measurement.waist,
          hips: measurement.hips,
        });

      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      console.error('Error adding measurement:', err);
      return { error: err.message };
    }
  };

  // Add personal record
  const addPersonalRecord = async (record: Omit<PersonalRecord, 'id'>) => {
    if (!userId) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('personal_records')
        .insert({
          user_id: userId,
          name: record.name,
          value: record.value,
          unit: record.unit,
          date: record.date,
          previous_best: record.previousBest,
        });

      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      console.error('Error adding personal record:', err);
      return { error: err.message };
    }
  };

  // Calculate user stats
  const userStats: UserStats = {
    totalWorkouts: workouts.length,
    totalCalories: workouts.reduce((sum, w) => sum + w.calories, 0),
    totalMinutes: workouts.reduce((sum, w) => sum + w.duration, 0),
    currentStreak: calculateStreak(workouts),
    weeklyGoalProgress: calculateWeeklyProgress(workouts, userProfile?.weeklyGoal || 5),
    personalRecords,
  };

  return {
    workouts,
    userProfile,
    measurements,
    personalRecords,
    userStats,
    loading,
    error,
    addWorkout,
    deleteWorkout,
    updateProfile,
    addMeasurement,
    addPersonalRecord,
    refetch: fetchData,
  };
}

// Helper function to calculate streak
function calculateStreak(workouts: Workout[]): number {
  if (workouts.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const sortedDates = [...new Set(workouts.map(w => w.date))]
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  let currentDate = today;

  for (const dateStr of sortedDates) {
    const workoutDate = new Date(dateStr);
    workoutDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      streak++;
      currentDate = workoutDate;
    } else {
      break;
    }
  }

  return streak;
}

// Helper function to calculate weekly progress
function calculateWeeklyProgress(workouts: Workout[], weeklyGoal: number): number {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const workoutsThisWeek = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    return workoutDate >= startOfWeek;
  });

  return Math.min(100, Math.round((workoutsThisWeek.length / weeklyGoal) * 100));
}
