import React from 'react';
import { WorkoutCategory } from '@/types/fitness';
import { 
  Dumbbell, 
  HeartPulse, 
  Flower2, 
  Zap, 
  Bike, 
  Footprints, 
  Waves, 
  Trophy 
} from 'lucide-react';

interface WorkoutCategoryCardProps {
  category: WorkoutCategory;
  onClick: (category: WorkoutCategory) => void;
  isSelected?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  dumbbell: Dumbbell,
  'heart-pulse': HeartPulse,
  flower: Flower2,
  zap: Zap,
  bike: Bike,
  footprints: Footprints,
  waves: Waves,
  trophy: Trophy
};

const WorkoutCategoryCard: React.FC<WorkoutCategoryCardProps> = ({ 
  category, 
  onClick,
  isSelected = false 
}) => {
  const Icon = iconMap[category.icon] || Dumbbell;

  return (
    <button
      onClick={() => onClick(category)}
      className={`relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:scale-105 group ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-offset-slate-900' 
          : ''
      }`}
      style={{ 
        borderColor: isSelected ? category.color : 'transparent',
        boxShadow: isSelected ? `0 0 20px ${category.color}40` : 'none'
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={category.image} 
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div 
          className="absolute inset-0 transition-opacity duration-300"
          style={{ 
            background: `linear-gradient(135deg, ${category.color}CC 0%, ${category.color}80 50%, transparent 100%)` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start h-24 justify-between">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-white font-semibold text-sm">{category.name}</span>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div 
          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: category.color }}
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
};

export default WorkoutCategoryCard;
