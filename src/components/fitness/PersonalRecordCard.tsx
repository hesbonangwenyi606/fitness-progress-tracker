import React from 'react';
import { PersonalRecord } from '@/types/fitness';
import { Trophy, TrendingUp, Medal, Award, Crown, Star } from 'lucide-react';

interface PersonalRecordCardProps {
  record: PersonalRecord;
  rank: number;
}

const badgeIcons = [Crown, Medal, Award, Star, Trophy];
const badgeColors = ['#F59E0B', '#94A3B8', '#CD7F32', '#6366F1', '#10B981'];

const PersonalRecordCard: React.FC<PersonalRecordCardProps> = ({ record, rank }) => {
  const BadgeIcon = badgeIcons[rank - 1] || Trophy;
  const badgeColor = badgeColors[rank - 1] || '#6366F1';
  
  const improvement = record.previousBest 
    ? ((record.value - record.previousBest) / record.previousBest * 100).toFixed(1)
    : null;

  const isImprovement = record.previousBest && record.value > record.previousBest;
  const isTimeRecord = record.unit === 'min' || record.unit === 'sec';
  const showPositiveChange = isTimeRecord ? !isImprovement : isImprovement;

  return (
    <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 group overflow-hidden">
      {/* Rank Badge */}
      <div 
        className="absolute -top-1 -right-1 w-10 h-10 flex items-center justify-center"
        style={{ color: badgeColor }}
      >
        <BadgeIcon className="w-8 h-8 opacity-30 group-hover:opacity-50 transition-opacity" />
      </div>

      {/* Content */}
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
          style={{ backgroundColor: `${badgeColor}20`, color: badgeColor }}
        >
          #{rank}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium truncate">{record.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl font-bold" style={{ color: badgeColor }}>
              {record.value}
            </span>
            <span className="text-slate-400 text-sm">{record.unit}</span>
            
            {improvement && (
              <div className={`flex items-center gap-0.5 text-xs ${
                showPositiveChange ? 'text-green-400' : 'text-red-400'
              }`}>
                <TrendingUp className={`w-3 h-3 ${!showPositiveChange ? 'rotate-180' : ''}`} />
                <span>{Math.abs(parseFloat(improvement))}%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Previous Best */}
      {record.previousBest && (
        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Previous Best</span>
            <span className="text-slate-300">{record.previousBest} {record.unit}</span>
          </div>
        </div>
      )}

      {/* Date */}
      <div className="mt-2 text-xs text-slate-500">
        Achieved on {new Date(record.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })}
      </div>
    </div>
  );
};

export default PersonalRecordCard;
