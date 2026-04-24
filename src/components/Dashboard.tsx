import React from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Droplets, Flame, Target, ChevronRight, Plus, Minus } from 'lucide-react';
import { DailyStats } from '../types';

const data = [
  { name: 'Mon', value: 2100 },
  { name: 'Tue', value: 2300 },
  { name: 'Wed', value: 2200 },
  { name: 'Thu', value: 1800 },
  { name: 'Fri', value: 2400 },
  { name: 'Sat', value: 2500 },
  { name: 'Sun', value: 2200 },
];

interface DashboardProps {
  stats: DailyStats;
  onUpdateHydration: (val: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, onUpdateHydration }) => {
  const caloriesLeft = stats.targetCalories - stats.consumedCalories;
  const progress = (stats.consumedCalories / stats.targetCalories) * 100;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
            Hello, <span className="text-emerald-400">Sanjith & Team</span>
          </h1>
          <p className="text-zinc-500 text-sm md:text-base mt-1">Ready to fuel your body with AI precision?</p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right">
            <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Streak</span>
            <span className="text-white font-bold">12 Days</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
            <Target size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Stats Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Calorie Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 md:p-12 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Flame size={120} className="text-emerald-500" />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="relative w-48 h-48 md:w-56 md:h-56 shrink-0">
                <svg className="w-full h-full -rotate-90 transform">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    className="stroke-zinc-800 fill-none"
                    strokeWidth="12"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    className="stroke-emerald-500 fill-none transition-all duration-1000 ease-out"
                    strokeWidth="12"
                    strokeDasharray={`${progress * 2.82 * (progress > 100 ? 1 : 1)} 282`}
                    strokeLinecap="round"
                    style={{ strokeDashoffset: -282 * (1 - Math.min(1, progress / 100)) }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Remaining</span>
                  <span className="text-5xl font-black text-white">{caloriesLeft}</span>
                  <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mt-1">kcal</span>
                </div>
              </div>

              <div className="flex-1 space-y-6 w-full">
                <div>
                  <h3 className="text-white text-xl font-bold mb-2">Daily Goal</h3>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-1000"
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    <span>{stats.consumedCalories} consumed</span>
                    <span>{stats.targetCalories} target</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <QuickStat label="Protein" value={stats.consumedProtein} target={stats.targetProtein} unit="g" />
                  <QuickStat label="Carbs" value={stats.consumedCarbs} target={stats.targetCarbs} unit="g" />
                  <QuickStat label="Fat" value={stats.consumedFat} target={stats.targetFat} unit="g" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Weekly Intensity Graph */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-white text-lg font-bold">Nutritional Intensity</h3>
              <div className="flex gap-2">
                {['D', 'W', 'M'].map(t => (
                  <button key={t} className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-colors ${t === 'W' ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 11 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Sidebar widgets */}
        <div className="lg:col-span-4 space-y-8">
          {/* Hydration Card */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 flex flex-col h-full md:h-auto min-h-[300px]"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Droplets size={28} />
              </div>
              <div className="text-right">
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block">Daily Target</span>
                <span className="text-white font-bold">{stats.targetHydration} Glasses</span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center items-center py-4">
              <div className="text-6xl font-black text-white mb-2">{stats.hydration}</div>
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Glasses consumed</span>
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => onUpdateHydration(Math.max(0, stats.hydration - 1))}
                className="flex-1 h-14 bg-zinc-800 hover:bg-zinc-700 rounded-2xl flex items-center justify-center text-zinc-400 transition-colors"
              >
                <Minus size={20} />
              </button>
              <button 
                onClick={() => onUpdateHydration(stats.hydration + 1)}
                className="flex-1 h-14 bg-emerald-500 hover:bg-emerald-400 rounded-2xl flex items-center justify-center text-white transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </motion.div>

          {/* Quick Tip / Goal */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                <Target size={20} />
              </div>
              <h4 className="text-white font-bold">Today's Focus</h4>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Based on your activity, try to increase your <span className="text-emerald-400">Protein intake</span> by 15g in your next meal.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const QuickStat = ({ label, value, target, unit }: { label: string, value: number, target: number, unit: string }) => (
  <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-800">
    <span className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest block mb-1">{label}</span>
    <div className="flex items-baseline gap-0.5">
      <span className="text-white font-bold">{value}</span>
      <span className="text-zinc-600 text-[10px]">{unit}</span>
    </div>
    <div className="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
      <div 
        className="h-full bg-zinc-400 transition-all duration-1000"
        style={{ width: `${Math.min(100, (value / target) * 100)}%` }}
      />
    </div>
  </div>
);

const MacroRow = ({ label, current, target, color }: { label: string, current: number, target: number, color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
      <span className="text-zinc-500">{label}</span>
      <span className="text-zinc-300">{current}G / {target}G</span>
    </div>
    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-1000`} 
        style={{ width: `${Math.min(100, (current / target) * 100)}%` }}
      />
    </div>
  </div>
);
