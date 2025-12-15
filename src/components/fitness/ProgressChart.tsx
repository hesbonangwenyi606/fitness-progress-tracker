import React from 'react';
import { WeeklyData } from '@/types/fitness';

interface ProgressChartProps {
  data: WeeklyData[];
  type: 'bar' | 'line';
  dataKey: 'workouts' | 'calories' | 'minutes';
  color: string;
  title: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ 
  data, 
  type, 
  dataKey, 
  color, 
  title 
}) => {
  const maxValue = Math.max(...data.map(d => d[dataKey]));
  const total = data.reduce((sum, d) => sum + d[dataKey], 0);

  if (type === 'bar') {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold">{title}</h3>
          <span className="text-slate-400 text-sm">
            Total: <span className="text-white font-medium">{total.toLocaleString()}</span>
          </span>
        </div>
        
        <div className="flex items-end justify-between gap-2 h-40">
          {data.map((item, index) => {
            const height = maxValue > 0 ? (item[dataKey] / maxValue) * 100 : 0;
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center justify-end h-32">
                  <span className="text-xs text-slate-400 mb-1">
                    {item[dataKey] > 0 ? item[dataKey] : ''}
                  </span>
                  <div 
                    className="w-full max-w-8 rounded-t-md transition-all duration-500 ease-out"
                    style={{ 
                      height: `${height}%`,
                      backgroundColor: item[dataKey] > 0 ? color : 'transparent',
                      minHeight: item[dataKey] > 0 ? '8px' : '0',
                      boxShadow: item[dataKey] > 0 ? `0 0 15px ${color}40` : 'none'
                    }}
                  />
                </div>
                <span className="text-xs text-slate-400">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Line chart
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = maxValue > 0 ? 100 - (item[dataKey] / maxValue) * 80 : 90;
    return { x, y, value: item[dataKey], day: item.day };
  });

  const pathD = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    return `${path} L ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold">{title}</h3>
        <span className="text-slate-400 text-sm">
          Total: <span className="text-white font-medium">{total.toLocaleString()}</span>
        </span>
      </div>

      <div className="relative h-40">
        <svg 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line 
              key={y}
              x1="0" 
              y1={y} 
              x2="100" 
              y2={y} 
              stroke="#334155" 
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          ))}

          {/* Area fill */}
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path 
            d={areaD} 
            fill={`url(#gradient-${dataKey})`}
          />

          {/* Line */}
          <path 
            d={pathD} 
            fill="none" 
            stroke={color} 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((point, index) => (
            <circle 
              key={index}
              cx={point.x} 
              cy={point.y} 
              r="2.5" 
              fill={color}
              stroke="#1e293b"
              strokeWidth="1.5"
            />
          ))}
        </svg>

        {/* Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between mt-2">
          {data.map((item, index) => (
            <span key={index} className="text-xs text-slate-400">{item.day}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
