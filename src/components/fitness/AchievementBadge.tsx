import React from 'react';
import { 
  Flame, 
  Target, 
  Trophy, 
  Zap, 
  Star, 
  Award, 
  Medal, 
  Crown,
  Dumbbell,
  Calendar
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedDate?: string;
}

interface AchievementBadgeProps {
  achievement: Achievement;
}

const iconMap: Record<string, React.ElementType> = {
  flame: Flame,
  target: Target,
  trophy: Trophy,
  zap: Zap,
  star: Star,
  award: Award,
  medal: Medal,
  crown: Crown,
  dumbbell: Dumbbell,
  calendar: Calendar
};

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const Icon = iconMap[achievement.icon] || Trophy;

  return (
    <div 
      className={`relative p-4 rounded-xl border transition-all duration-300 ${
        achievement.unlocked 
          ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600' 
          : 'bg-slate-800/20 border-slate-800 opacity-50'
      }`}
    >
      {/* Badge Icon */}
      <div className="flex flex-col items-center text-center">
        <div 
          className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
            achievement.unlocked ? '' : 'grayscale'
          }`}
          style={{ 
            backgroundColor: achievement.unlocked ? `${achievement.color}20` : '#1e293b',
            boxShadow: achievement.unlocked ? `0 0 20px ${achievement.color}30` : 'none'
          }}
        >
          <Icon 
            className="w-7 h-7" 
            style={{ color: achievement.unlocked ? achievement.color : '#475569' }} 
          />
        </div>
        
        <h4 className={`font-semibold text-sm ${achievement.unlocked ? 'text-white' : 'text-slate-500'}`}>
          {achievement.name}
        </h4>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
          {achievement.description}
        </p>
        
        {achievement.unlocked && achievement.unlockedDate && (
          <span className="text-xs text-slate-500 mt-2">
            {new Date(achievement.unlockedDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        )}
      </div>

      {/* Locked Overlay */}
      {!achievement.unlocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export const achievements: Achievement[] = [
  {
    id: '1',
    name: 'First Step',
    description: 'Complete your first workout',
    icon: 'star',
    color: '#F59E0B',
    unlocked: true,
    unlockedDate: '2025-07-01'
  },
  {
    id: '2',
    name: 'Week Warrior',
    description: 'Complete 7 workouts in a week',
    icon: 'flame',
    color: '#EF4444',
    unlocked: true,
    unlockedDate: '2025-08-15'
  },
  {
    id: '3',
    name: 'Consistency King',
    description: 'Maintain a 30-day streak',
    icon: 'crown',
    color: '#8B5CF6',
    unlocked: false
  },
  {
    id: '4',
    name: 'Calorie Crusher',
    description: 'Burn 10,000 calories total',
    icon: 'zap',
    color: '#F97316',
    unlocked: true,
    unlockedDate: '2025-10-20'
  },
  {
    id: '5',
    name: 'Iron Will',
    description: 'Complete 50 strength workouts',
    icon: 'dumbbell',
    color: '#6366F1',
    unlocked: false
  },
  {
    id: '6',
    name: 'Marathon Month',
    description: 'Log 1000 active minutes in a month',
    icon: 'calendar',
    color: '#10B981',
    unlocked: true,
    unlockedDate: '2025-11-30'
  },
  {
    id: '7',
    name: 'Goal Getter',
    description: 'Reach your target weight',
    icon: 'target',
    color: '#06B6D4',
    unlocked: false
  },
  {
    id: '8',
    name: 'Champion',
    description: 'Unlock all achievements',
    icon: 'trophy',
    color: '#FBBF24',
    unlocked: false
  }
];

export default AchievementBadge;
