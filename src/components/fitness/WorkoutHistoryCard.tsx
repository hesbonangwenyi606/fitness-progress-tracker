import React, { useState } from 'react';
import { Workout, WorkoutType } from '@/types/fitness';
import { 
  Dumbbell, 
  HeartPulse, 
  Flower2, 
  Zap, 
  Bike, 
  Footprints, 
  Waves, 
  Trophy,
  Clock,
  Flame,
  ChevronDown,
  ChevronUp,
  Calendar
} from 'lucide-react';

interface WorkoutHistoryCardProps {
  workout: Workout;
  onDelete?: (id: string) => void;
}

const typeIconMap: Record<WorkoutType, React.ElementType> = {
  strength: Dumbbell,
  cardio: HeartPulse,
  yoga: Flower2,
  hiit: Zap,
  cycling: Bike,
  running: Footprints,
  swimming: Waves,
  sports: Trophy
};

const typeColorMap: Record<WorkoutType, string> = {
  strength: '#6366F1',
  cardio: '#F97316',
  yoga: '#10B981',
  hiit: '#EF4444',
  cycling: '#8B5CF6',
  running: '#06B6D4',
  swimming: '#3B82F6',
  sports: '#F59E0B'
};

const WorkoutHistoryCard: React.FC<WorkoutHistoryCardProps> = ({ workout, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = typeIconMap[workout.type];
  const color = typeColorMap[workout.type];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 overflow-hidden transition-all duration-300 hover:border-slate-600">
      {/* Main Content */}
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold truncate">{workout.name}</h4>
            <div className="flex items-center gap-3 mt-1">
              <span 
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: `${color}20`, color }}
              >
                {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
              </span>
              <div className="flex items-center gap-1 text-slate-400 text-sm">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(workout.date)}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-slate-300">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{workout.duration}m</span>
            </div>
            <div className="flex items-center gap-1 text-slate-300">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>{workout.calories}</span>
            </div>
            <button className="p-1 text-slate-400 hover:text-white transition-colors">
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-700/50 pt-4 animate-in slide-in-from-top-2 duration-200">
          {/* Exercises */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-slate-400 mb-2">Exercises</h5>
            <div className="space-y-2">
              {workout.exercises.map((exercise) => (
                <div 
                  key={exercise.id}
                  className="flex items-center justify-between bg-slate-700/30 rounded-lg px-3 py-2"
                >
                  <span className="text-white text-sm">{exercise.name}</span>
                  <span className="text-slate-400 text-sm">
                    {exercise.sets && exercise.reps && (
                      <span>{exercise.sets} x {exercise.reps}</span>
                    )}
                    {exercise.weight && (
                      <span className="ml-2">@ {exercise.weight} lbs</span>
                    )}
                    {exercise.duration && !exercise.sets && (
                      <span>{exercise.duration} min</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {workout.notes && (
            <div className="mb-4">
              <h5 className="text-sm font-medium text-slate-400 mb-2">Notes</h5>
              <p className="text-slate-300 text-sm bg-slate-700/30 rounded-lg px-3 py-2">
                {workout.notes}
              </p>
            </div>
          )}

          {/* Actions */}
          {onDelete && (
            <div className="flex justify-end">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(workout.id);
                }}
                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
              >
                Delete Workout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutHistoryCard;
