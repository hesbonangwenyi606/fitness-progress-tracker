import { Workout, WorkoutCategory, UserStats, WeeklyData, PersonalRecord, UserProfile, Measurement } from '@/types/fitness';

export const workoutCategories: WorkoutCategory[] = [
  {
    id: 'strength',
    name: 'Strength',
    icon: 'dumbbell',
    color: '#6366F1',
    image: 'https://d64gsuwffb70l.cloudfront.net/693ff08f4422210386ffdfea_1765798144827_929fc857.jpg'
  },
  {
    id: 'cardio',
    name: 'Cardio',
    icon: 'heart-pulse',
    color: '#F97316',
    image: 'https://d64gsuwffb70l.cloudfront.net/693ff08f4422210386ffdfea_1765798145832_e7609800.jpg'
  },
  {
    id: 'yoga',
    name: 'Yoga',
    icon: 'flower',
    color: '#10B981',
    image: 'https://d64gsuwffb70l.cloudfront.net/693ff08f4422210386ffdfea_1765798142279_c601d38e.jpg'
  },
  {
    id: 'hiit',
    name: 'HIIT',
    icon: 'zap',
    color: '#EF4444',
    image: 'https://d64gsuwffb70l.cloudfront.net/693ff08f4422210386ffdfea_1765798143033_61205548.jpg'
  },
  {
    id: 'cycling',
    name: 'Cycling',
    icon: 'bike',
    color: '#8B5CF6',
    image: 'https://d64gsuwffb70l.cloudfront.net/693ff08f4422210386ffdfea_1765798146991_cf667878.png'
  },
  {
    id: 'running',
    name: 'Running',
    icon: 'footprints',
    color: '#06B6D4',
    image: 'https://d64gsuwffb70l.cloudfront.net/693ff08f4422210386ffdfea_1765798146192_420c1347.jpg'
  },
  {
    id: 'swimming',
    name: 'Swimming',
    icon: 'waves',
    color: '#3B82F6',
    image: 'https://d64gsuwffb70l.cloudfront.net/693ff08f4422210386ffdfea_1765798157520_e7472419.png'
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: 'trophy',
    color: '#F59E0B',
    image: 'https://d64gsuwffb70l.cloudfront.net/693ff08f4422210386ffdfea_1765798148871_65701b8c.jpg'
  }
];

export const initialWorkouts: Workout[] = [
  {
    id: '1',
    type: 'strength',
    name: 'Upper Body Power',
    duration: 45,
    calories: 320,
    date: '2025-12-15',
    exercises: [
      { id: 'e1', name: 'Bench Press', sets: 4, reps: 10, weight: 135 },
      { id: 'e2', name: 'Shoulder Press', sets: 3, reps: 12, weight: 65 },
      { id: 'e3', name: 'Bicep Curls', sets: 3, reps: 15, weight: 30 },
      { id: 'e4', name: 'Tricep Dips', sets: 3, reps: 12 }
    ],
    notes: 'Felt strong today! Increased bench press weight.'
  },
  {
    id: '2',
    type: 'cardio',
    name: 'Morning Run',
    duration: 35,
    calories: 380,
    date: '2025-12-14',
    exercises: [
      { id: 'e5', name: '5K Run', duration: 28 },
      { id: 'e6', name: 'Cool Down Walk', duration: 7 }
    ],
    notes: 'New personal best on 5K!'
  },
  {
    id: '3',
    type: 'yoga',
    name: 'Flexibility Flow',
    duration: 60,
    calories: 180,
    date: '2025-12-13',
    exercises: [
      { id: 'e7', name: 'Sun Salutation', duration: 15 },
      { id: 'e8', name: 'Warrior Sequence', duration: 20 },
      { id: 'e9', name: 'Hip Openers', duration: 15 },
      { id: 'e10', name: 'Savasana', duration: 10 }
    ]
  },
  {
    id: '4',
    type: 'hiit',
    name: 'Tabata Blast',
    duration: 25,
    calories: 290,
    date: '2025-12-12',
    exercises: [
      { id: 'e11', name: 'Burpees', sets: 4, reps: 20 },
      { id: 'e12', name: 'Mountain Climbers', sets: 4, reps: 30 },
      { id: 'e13', name: 'Jump Squats', sets: 4, reps: 15 },
      { id: 'e14', name: 'High Knees', sets: 4, duration: 1 }
    ],
    notes: 'Intense session! Heart rate peaked at 175 bpm.'
  },
  {
    id: '5',
    type: 'cycling',
    name: 'Hill Climbs',
    duration: 50,
    calories: 420,
    date: '2025-12-11',
    exercises: [
      { id: 'e15', name: 'Warm Up Ride', duration: 10 },
      { id: 'e16', name: 'Hill Intervals', duration: 30 },
      { id: 'e17', name: 'Cool Down', duration: 10 }
    ]
  },
  {
    id: '6',
    type: 'strength',
    name: 'Leg Day',
    duration: 55,
    calories: 380,
    date: '2025-12-10',
    exercises: [
      { id: 'e18', name: 'Squats', sets: 5, reps: 8, weight: 185 },
      { id: 'e19', name: 'Deadlifts', sets: 4, reps: 6, weight: 225 },
      { id: 'e20', name: 'Leg Press', sets: 3, reps: 12, weight: 320 },
      { id: 'e21', name: 'Calf Raises', sets: 4, reps: 15, weight: 100 }
    ],
    notes: 'Hit a new PR on deadlifts!'
  },
  {
    id: '7',
    type: 'running',
    name: 'Interval Training',
    duration: 40,
    calories: 450,
    date: '2025-12-09',
    exercises: [
      { id: 'e22', name: 'Warm Up Jog', duration: 5 },
      { id: 'e23', name: 'Sprint Intervals', duration: 25 },
      { id: 'e24', name: 'Cool Down', duration: 10 }
    ]
  },
  {
    id: '8',
    type: 'swimming',
    name: 'Lap Training',
    duration: 45,
    calories: 350,
    date: '2025-12-08',
    exercises: [
      { id: 'e25', name: 'Freestyle Laps', duration: 20 },
      { id: 'e26', name: 'Backstroke', duration: 15 },
      { id: 'e27', name: 'Butterfly', duration: 10 }
    ]
  },
  {
    id: '9',
    type: 'sports',
    name: 'Basketball Game',
    duration: 90,
    calories: 650,
    date: '2025-12-07',
    exercises: [
      { id: 'e28', name: 'Full Court Game', duration: 90 }
    ],
    notes: 'Great game with friends!'
  },
  {
    id: '10',
    type: 'yoga',
    name: 'Morning Stretch',
    duration: 30,
    calories: 90,
    date: '2025-12-06',
    exercises: [
      { id: 'e29', name: 'Gentle Flow', duration: 20 },
      { id: 'e30', name: 'Meditation', duration: 10 }
    ]
  },
  {
    id: '11',
    type: 'strength',
    name: 'Full Body Circuit',
    duration: 40,
    calories: 340,
    date: '2025-12-05',
    exercises: [
      { id: 'e31', name: 'Push Ups', sets: 3, reps: 20 },
      { id: 'e32', name: 'Pull Ups', sets: 3, reps: 10 },
      { id: 'e33', name: 'Lunges', sets: 3, reps: 12 },
      { id: 'e34', name: 'Plank', sets: 3, duration: 1 }
    ]
  },
  {
    id: '12',
    type: 'cardio',
    name: 'Treadmill Session',
    duration: 30,
    calories: 280,
    date: '2025-12-04',
    exercises: [
      { id: 'e35', name: 'Incline Walk', duration: 15 },
      { id: 'e36', name: 'Jog', duration: 15 }
    ]
  },
  {
    id: '13',
    type: 'hiit',
    name: 'Core Crusher',
    duration: 20,
    calories: 220,
    date: '2025-12-03',
    exercises: [
      { id: 'e37', name: 'Russian Twists', sets: 4, reps: 20 },
      { id: 'e38', name: 'Bicycle Crunches', sets: 4, reps: 30 },
      { id: 'e39', name: 'Leg Raises', sets: 4, reps: 15 }
    ]
  },
  {
    id: '14',
    type: 'cycling',
    name: 'Endurance Ride',
    duration: 75,
    calories: 580,
    date: '2025-12-02',
    exercises: [
      { id: 'e40', name: 'Steady State Cycling', duration: 75 }
    ],
    notes: 'Covered 25 miles today!'
  },
  {
    id: '15',
    type: 'running',
    name: 'Recovery Run',
    duration: 25,
    calories: 200,
    date: '2025-12-01',
    exercises: [
      { id: 'e41', name: 'Easy Pace Run', duration: 25 }
    ]
  }
];

export const initialUserStats: UserStats = {
  totalWorkouts: 47,
  totalCalories: 15680,
  totalMinutes: 2340,
  currentStreak: 12,
  weeklyGoalProgress: 75,
  personalRecords: [
    { id: 'pr1', name: 'Deadlift', value: 225, unit: 'lbs', date: '2025-12-10', previousBest: 205 },
    { id: 'pr2', name: '5K Run', value: 28, unit: 'min', date: '2025-12-14', previousBest: 30 },
    { id: 'pr3', name: 'Plank Hold', value: 180, unit: 'sec', date: '2025-12-01', previousBest: 150 },
    { id: 'pr4', name: 'Bench Press', value: 135, unit: 'lbs', date: '2025-12-15', previousBest: 125 },
    { id: 'pr5', name: 'Cycling Distance', value: 25, unit: 'miles', date: '2025-12-02', previousBest: 22 }
  ]
};

export const weeklyData: WeeklyData[] = [
  { day: 'Mon', workouts: 1, calories: 320, minutes: 45 },
  { day: 'Tue', workouts: 1, calories: 380, minutes: 35 },
  { day: 'Wed', workouts: 1, calories: 180, minutes: 60 },
  { day: 'Thu', workouts: 1, calories: 290, minutes: 25 },
  { day: 'Fri', workouts: 1, calories: 420, minutes: 50 },
  { day: 'Sat', workouts: 2, calories: 560, minutes: 85 },
  { day: 'Sun', workouts: 0, calories: 0, minutes: 0 }
];

export const initialUserProfile: UserProfile = {
  name: 'Alex Johnson',
  weight: 175,
  targetWeight: 165,
  weeklyGoal: 5,
  measurements: [
    { date: '2025-12-01', weight: 178, bodyFat: 22, chest: 40, waist: 34, hips: 38 },
    { date: '2025-12-08', weight: 176, bodyFat: 21.5, chest: 40, waist: 33.5, hips: 38 },
    { date: '2025-12-15', weight: 175, bodyFat: 21, chest: 40.5, waist: 33, hips: 37.5 }
  ]
};

export const monthlyProgress = [
  { month: 'Jul', weight: 185, workouts: 12 },
  { month: 'Aug', weight: 183, workouts: 15 },
  { month: 'Sep', weight: 181, workouts: 18 },
  { month: 'Oct', weight: 179, workouts: 20 },
  { month: 'Nov', weight: 177, workouts: 22 },
  { month: 'Dec', weight: 175, workouts: 15 }
];
