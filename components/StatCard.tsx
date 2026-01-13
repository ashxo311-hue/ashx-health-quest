
import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  goal: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  onIncrement: (amount: number) => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, goal, unit, icon, color, onIncrement }) => {
  const progress = Math.min((value / goal) * 100, 100);
  const isComplete = value >= goal;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-xl`}>
          {icon}
        </div>
        {isComplete && (
          <span className="bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Goal Met!
          </span>
        )}
      </div>
      
      <h3 className="text-slate-500 font-medium text-sm mb-1">{title}</h3>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-3xl font-bold text-slate-900">{value.toLocaleString()}</span>
        <span className="text-slate-400 text-sm font-medium">{unit}</span>
      </div>

      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-6">
        <div 
          className={`h-full transition-all duration-700 ease-out ${isComplete ? 'bg-green-500' : color.replace('text-', 'bg-')}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => onIncrement(Math.floor(goal * 0.1))}
          className="flex-1 py-2 px-4 rounded-xl bg-slate-50 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors border border-slate-200"
        >
          +10%
        </button>
        <button 
          onClick={() => onIncrement(Math.floor(goal * 0.25))}
          className={`flex-1 py-2 px-4 rounded-xl font-semibold text-sm text-white transition-colors ${isComplete ? 'bg-green-500' : color.replace('text-', 'bg-')}`}
        >
          Add More
        </button>
      </div>
    </div>
  );
};

export default StatCard;
