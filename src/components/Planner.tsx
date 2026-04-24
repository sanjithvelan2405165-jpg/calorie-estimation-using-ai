import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, RefreshCw, Lightbulb, CheckCircle2 } from 'lucide-react';
import { generateMealPlan } from '../services/gemini';

export const Planner: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<any[]>([]);
  const [view, setView] = useState<'daily' | 'weekly'>('daily');

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateMealPlan('maintain weight and build muscle');
      setPlan(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Smart Planner</h1>
          <p className="text-zinc-500 text-sm">AI-curated nutrition</p>
        </div>
        <button 
          onClick={handleGenerate}
          className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400 active:rotate-180 transition-transform duration-500"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="flex p-1 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <button 
          onClick={() => setView('daily')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${view === 'daily' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500'}`}
        >
          Daily Plan
        </button>
        <button 
          onClick={() => setView('weekly')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${view === 'weekly' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500'}`}
        >
          Weekly Plan
        </button>
      </div>

      {plan.length === 0 ? (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-10 md:p-20 text-center space-y-6"
        >
          <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center text-emerald-500 mx-auto">
            <Calendar size={48} />
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-2xl font-bold text-white">Smart Meal Generation</h3>
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed">
              Our AI analyzes your goals to curate the perfect nutritional path for your body.
            </p>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-12 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {isGenerating ? 'Generating Vision...' : 'Generate Daily Plan'}
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
          {plan.map((meal, idx) => (
            <motion.div
              key={idx}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 flex flex-col gap-6 hover:border-zinc-700 transition-colors group"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle2 size={24} />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block mb-1">{meal.type}</span>
                  <span className="text-sm font-bold text-white">{meal.calories} kcal</span>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">{meal.name}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{meal.description}</p>
              </div>
              <div className="mt-auto pt-4 border-t border-zinc-800 flex gap-4">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Ingredients: 5</span>
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Time: 20 min</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex gap-4"
      >
        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 shrink-0">
          <Lightbulb size={24} />
        </div>
        <div>
          <h4 className="text-white font-bold text-sm">Planning Tip</h4>
          <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
            Generating a <span className="text-blue-400">Weekly Plan</span> helps with grocery shopping and consistency!
          </p>
        </div>
      </motion.div>
    </div>
  );
};
