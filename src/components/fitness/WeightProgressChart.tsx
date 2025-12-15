import React from 'react';
import { TrendingDown } from 'lucide-react';

interface MonthlyData {
  month: string;
  weight: number;
  workouts: number;
}

interface WeightProgressChartProps {
  data: MonthlyData[];
  targetWeight: number;
}

const WeightProgressChart: React.FC<WeightProgressChartProps> = ({ data, targetWeight }) => {
  const weights = data.map(d => d.weight);
  const minWeight = Math.min(...weights, targetWeight) - 5;
  const maxWeight = Math.max(...weights) + 5;
  const range = maxWeight - minWeight;

  const getY = (weight: number) => {
    return 100 - ((weight - minWeight) / range) * 80 - 10;
  };

  const points = data.map((item, index) => ({
    x: (index / (data.length - 1)) * 100,
    y: getY(item.weight),
    weight: item.weight,
    month: item.month
  }));

  const pathD = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    
    // Create smooth curve
    const prev = points[index - 1];
    const cpX = (prev.x + point.x) / 2;
    return `${path} C ${cpX} ${prev.y}, ${cpX} ${point.y}, ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L 100 100 L 0 100 Z`;
  const targetY = getY(targetWeight);

  const totalLoss = data[0].weight - data[data.length - 1].weight;

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-semibold">Weight Progress</h3>
          <p className="text-slate-400 text-sm">Last 6 months</p>
        </div>
        <div className="flex items-center gap-2 text-green-400">
          <TrendingDown className="w-5 h-5" />
          <span className="font-semibold">-{totalLoss} lbs</span>
        </div>
      </div>

      <div className="relative h-48">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between text-xs text-slate-500">
          <span>{maxWeight}</span>
          <span>{Math.round((maxWeight + minWeight) / 2)}</span>
          <span>{minWeight}</span>
        </div>

        {/* Chart area */}
        <div className="ml-12 h-full">
          <svg 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
            className="w-full h-40"
          >
            {/* Grid lines */}
            {[20, 40, 60, 80].map((y) => (
              <line 
                key={y}
                x1="0" 
                y1={y} 
                x2="100" 
                y2={y} 
                stroke="#334155" 
                strokeWidth="0.3"
                strokeDasharray="2,2"
              />
            ))}

            {/* Target weight line */}
            <line 
              x1="0" 
              y1={targetY} 
              x2="100" 
              y2={targetY} 
              stroke="#10B981" 
              strokeWidth="0.8"
              strokeDasharray="4,4"
            />
            <text 
              x="2" 
              y={targetY - 2} 
              fill="#10B981" 
              fontSize="4"
            >
              Goal: {targetWeight} lbs
            </text>

            {/* Area gradient */}
            <defs>
              <linearGradient id="weightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path 
              d={areaD} 
              fill="url(#weightGradient)"
            />

            {/* Line */}
            <path 
              d={pathD} 
              fill="none" 
              stroke="#8B5CF6" 
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points */}
            {points.map((point, index) => (
              <g key={index}>
                <circle 
                  cx={point.x} 
                  cy={point.y} 
                  r="3" 
                  fill="#8B5CF6"
                  stroke="#1e293b"
                  strokeWidth="1.5"
                />
                <text 
                  x={point.x} 
                  y={point.y - 5} 
                  fill="#fff" 
                  fontSize="3.5"
                  textAnchor="middle"
                >
                  {point.weight}
                </text>
              </g>
            ))}
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between mt-2">
            {data.map((item, index) => (
              <span key={index} className="text-xs text-slate-400">{item.month}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-xs text-slate-400">Weight</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-green-500" style={{ borderStyle: 'dashed' }} />
          <span className="text-xs text-slate-400">Target</span>
        </div>
      </div>
    </div>
  );
};

export default WeightProgressChart;
