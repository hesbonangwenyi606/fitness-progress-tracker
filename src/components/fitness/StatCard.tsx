import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  Flame, 
  Clock, 
  Zap, 
  Target, 
  Trophy 
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  unit?: string;
  icon: 'activity' | 'flame' | 'clock' | 'zap' | 'target' | 'trophy';
  color: string;
  progress?: number;
  animate?: boolean;
}

const iconMap = {
  activity: Activity,
  flame: Flame,
  clock: Clock,
  zap: Zap,
  target: Target,
  trophy: Trophy
};

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  unit, 
  icon, 
  color, 
  progress,
  animate = true 
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const Icon = iconMap[icon];

  useEffect(() => {
    if (!animate) {
      setDisplayValue(value);
      return;
    }

    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, animate]);

  return (
    <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 group">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
        style={{ 
          background: `linear-gradient(135deg, ${color}20 0%, transparent 50%)` 
        }}
      />
      
      {/* Icon */}
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>

      {/* Content */}
      <div className="relative">
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">
            {displayValue.toLocaleString()}
          </span>
          {unit && <span className="text-slate-400 text-sm">{unit}</span>}
        </div>
      </div>

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${progress}%`, 
                backgroundColor: color,
                boxShadow: `0 0 10px ${color}50`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
