import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Clock, Trash2 } from 'lucide-react';
import { FoodItem } from '../types';

interface LogProps {
  logs: FoodItem[];
  onDelete: (id: string) => void;
}

export const Log: React.FC<LogProps> = ({ logs, onDelete }) => {
  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-white">Activity Log</h1>
        <p className="text-zinc-500 text-sm">Everything you've enjoyed today</p>
      </div>

      {logs.length === 0 ? (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-20 text-center space-y-6"
        >
          <div className="w-24 h-24 bg-zinc-800 rounded-[32px] flex items-center justify-center text-zinc-700 mx-auto">
            <Utensils size={40} />
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-2xl font-bold text-zinc-400">Your log is empty.</h3>
            <p className="text-zinc-600 text-sm md:text-base leading-relaxed">Everything you scan with the NutriVision camera will appear here for your review.</p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-12">
          {logs.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex gap-4 md:gap-6 group relative overflow-hidden"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 bg-zinc-800 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                {item.imageUrl ? (
                  <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-700">
                    <Utensils size={32} />
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg md:text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{item.name}</h4>
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="text-zinc-700 hover:text-red-400 transition-colors p-2 -mr-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">
                    <Clock size={12} />
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="flex gap-6 mt-4">
                  <Stat label="Calories" value={item.calories} color="text-emerald-400" />
                  <Stat label="Protein" value={item.protein} color="text-blue-400" />
                  <Stat label="Carbs" value={item.carbs} color="text-orange-400" />
                  <Stat label="Fat" value={item.fat} color="text-zinc-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const Stat = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="flex flex-col">
    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-tighter">{label}</span>
    <span className={`text-xs font-bold ${color}`}>{value}</span>
  </div>
);
