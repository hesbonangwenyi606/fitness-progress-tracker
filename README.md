A premium full-stack fitness tracking application that allows users to log workouts, track progress, visualize fitness data, and sync everything securely to the cloud in real time.

Built with React + TypeScript, modern UI animations, real-time database integration, and secure user authentication.

✨ Features
🧠 Core Functionality

Log workout sessions with detailed exercises, sets, reps, weights, and notes

Track fitness progress over time with interactive charts

Manage personal fitness goals and body measurements

Store and track personal records (PRs)

Achievement system with locked/unlocked badges

Real-time cloud sync across devices

Offline support with automatic sync when authenticated

📊 Dashboard

Hero section with personalized welcome

6 animated stat cards (total workouts, calories, streaks, etc.)

8 workout categories:

Strength

Cardio

Yoga

HIIT

Cycling

Running

Swimming

Sports

Recent workout history

Weekly progress charts

Monthly goal completion rings

## Workout Timer
Real-time stopwatch for workouts
Start, pause, and reset functionality
Built using a custom React hook
Designed to be extendable for intervals and rest timers

## Workout History
Expandable workout cards
View exercises, sets, reps, and notes
Search and filter by workout category
Clean, readable workout summaries

## Progress Tracking
Weight progress chart (6-month trend with target line)
Line and bar charts for workout volume and frequency
Personal records with improvement indicators
Achievement badges with visual states

## Profile
Editable fitness goals
Body measurements tracking
Achievement overview
Activity summary

## Authentication & Security
Email/password authentication
Sign up, sign in, and sign out flows
Secure Row Level Security (RLS) policies
All user data is private and isolated
Sync status indicator in the app header

## Database Schema
**The application uses a fully structured relational schema:**
user_profiles
workouts
exercises
measurements

**personal_records**
Each table is protected by Row Level Security (RLS) to ensure users can only access their own data.

## Architecture
Frontend
React
TypeScript
Tailwind CSS

**SVG & CSS animations**
Custom reusable components

**State & Logic**
Custom React hooks (useAuth, useFitnessData, useWorkoutTimer)

**Optimistic UI updates**
Local persistence with cloud sync

## Backend
Cloud database with real-time subscriptions
Secure authentication
Automatic data synchronization

## Project Structure
src/
├── components/
│   ├── StatCard.tsx
│   ├── WorkoutTimer.tsx
│   ├── WorkoutHistoryCard.tsx
│   ├── ProgressChart.tsx
│   ├── CircularProgress.tsx
│   ├── PersonalRecordCard.tsx
│   ├── AchievementBadge.tsx
│   └── AuthModal.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useFitnessData.ts
│   └── useWorkoutTimer.ts
│
├── pages/
│   ├── Dashboard.tsx
│   ├── History.tsx
│   ├── Progress.tsx
│   └── Profile.tsx
│
├── types/
│   └── fitness.ts
│
└── AppLayout.tsx

## Getting Started
Prerequisites
Node.js (v18+ recommended)
npm or yarn

**Installation**
git clone https://github.com/yourusername/fitness-progress-tracker.git
cd fitness-progress-tracker
npm install

Run Locally
npm run dev


The app will be available at:
http://localhost:5173

## Data Handling
When not authenticated, data is stored locally
On sign-in, local data automatically syncs to the cloud
Real-time updates across devices when logged in

## UI & UX Highlights
Dark theme with premium feel
Smooth animations for stats and progress
Responsive layout for all screen sizes
Clean and intuitive navigation
Custom hero and category images

 ## Planned Features
**Interval & rest-based workout timer**

## Exercise library with muscle groups and equipment filters
Workout plans and training programs
AI-generated workout plans

## Export workout data (CSV/PDF)
This project demonstrates:
Full-stack development skills
Real-world data modeling
Secure authentication & authorization
Real-time data synchronization
Scalable and maintainable architecture
Strong UI/UX engineering