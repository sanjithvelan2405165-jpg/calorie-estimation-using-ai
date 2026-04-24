import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Calendar, Camera as CameraIcon, List, MessageCircle } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Planner } from './components/Planner';
import { Camera } from './components/Camera';
import { Log } from './components/Log';
import { Chat } from './components/Chat';
import { FoodItem, DailyStats } from './types';

const INITIAL_STATS: DailyStats = {
  targetCalories: 2200,
  consumedCalories: 0,
  targetProtein: 150,
  consumedProtein: 0,
  targetCarbs: 250,
  consumedCarbs: 0,
  targetFat: 70,
  consumedFat: 0,
  hydration: 0,
  targetHydration: 8,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'plan' | 'camera' | 'log' | 'chat'>('home');
  const [logs, setLogs] = useState<FoodItem[]>([]);
  const [stats, setStats] = useState<DailyStats>(INITIAL_STATS);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    const newStats = logs.reduce((acc, item) => ({
      ...acc,
      consumedCalories: acc.consumedCalories + item.calories,
      consumedProtein: acc.consumedProtein + item.protein,
      consumedCarbs: acc.consumedCarbs + item.carbs,
      consumedFat: acc.consumedFat + item.fat,
    }), { ...INITIAL_STATS, hydration: stats.hydration });
    setStats(newStats);
  }, [logs, stats.hydration]);

  const handleCapture = (food: FoodItem) => {
    setLogs(prev => [food, ...prev]);
  };

  const handleDeleteLog = (id: string) => {
    setLogs(prev => prev.filter(item => item.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard stats={stats} onUpdateHydration={(val) => setStats(s => ({ ...s, hydration: val }))} />;
      case 'plan': return <Planner />;
      case 'log': return <Log logs={logs} onDelete={handleDeleteLog} />;
      case 'chat': return <Chat />;
      default: return <Dashboard stats={stats} onUpdateHydration={(val) => setStats(s => ({ ...s, hydration: val }))} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-emerald-500/30 flex flex-col md:flex-row">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-zinc-900 border-r border-zinc-800 flex-col py-8 px-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <CameraIcon size={24} />
          </div>
          <div>
            <h2 className="font-bold text-white leading-tight">NutriVision</h2>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">AI Nutrition</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={20} />} label="Dashboard" />
          <SidebarButton active={activeTab === 'plan'} onClick={() => setActiveTab('plan')} icon={<Calendar size={20} />} label="Smart Planner" />
          <SidebarButton active={activeTab === 'log'} onClick={() => setActiveTab('log')} icon={<List size={20} />} label="Activity Log" />
          <SidebarButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageCircle size={20} />} label="AI Assistant" />
        </nav>

        <button 
          onClick={() => setShowCamera(true)}
          className="mt-auto w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
        >
          <CameraIcon size={20} />
          <span>Quick Scan</span>
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-x-hidden pt-8 md:pt-12 px-6 md:px-12 pb-32 md:pb-12 max-w-5xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Navigation Bar */}
        <nav className="md:hidden fixed bottom-6 left-6 right-6 max-w-md mx-auto h-20 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-[32px] flex items-center justify-around px-2 z-40">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={22} />} label="Home" />
          <NavButton active={activeTab === 'plan'} onClick={() => setActiveTab('plan')} icon={<Calendar size={22} />} label="Plan" />
          
          <div className="relative -top-8">
            <button 
              onClick={() => setShowCamera(true)}
              className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/40 active:scale-90 transition-transform"
            >
              <CameraIcon size={28} />
            </button>
          </div>

          <NavButton active={activeTab === 'log'} onClick={() => setActiveTab('log')} icon={<List size={22} />} label="Log" />
          <NavButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageCircle size={22} />} label="Chat" />
        </nav>
      </div>

      <AnimatePresence>
        {showCamera && (
          <Camera 
            onCapture={handleCapture} 
            onClose={() => setShowCamera(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const SidebarButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${active ? 'bg-emerald-500/10 text-emerald-500 font-bold' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}`}
  >
    {icon}
    <span className="text-sm tracking-wide">{label}</span>
  </button>
);

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);
