"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Wand2, Brain, Target, X, Flame, BarChart3, TrendingUp, AlertCircle, ShieldCheck } from 'lucide-react';
import { calculateAuraLocally } from '@/lib/aura-calc';

// --- TYPES ---
interface DayData {
  date: Date;
  score: number;
  isFuture: boolean;
  key: string;
}

interface Goal {
  id: number;
  title: string;
  progress: number;
}

// --- COMPONENTS ---
const AuraCell = ({ 
  day, 
  isFuture, 
  isSelected, 
  onClick, 
  dailyProgress = 0 
}: { 
  day: DayData, 
  isFuture: boolean, 
  isSelected: boolean,
  onClick: () => void,
  dailyProgress?: number 
}) => {
  const todayLocal = new Date().toLocaleDateString('en-CA');
  const isToday = day.key === todayLocal;

  return (
    <div className="relative flex items-center justify-center w-[22px] h-[22px]"> {/* Centered Container */}
      {/* PROGRESS RING */}
      {isToday && !isFuture && dailyProgress > 0 && (
        <svg 
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-30" 
          viewBox="0 0 24 24"
        >
          <circle 
            cx="12" cy="12" r="10" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="text-white/5" 
          />
          <motion.circle
            cx="12" cy="12" r="10" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeDasharray="62.8"
            initial={{ strokeDashoffset: 62.8 }}
            animate={{ strokeDashoffset: 62.8 - (62.8 * dailyProgress) / 100 }}
            className="text-[#bfff00] drop-shadow-[0_0_5px_#bfff00]"
          />
        </svg>
      )}

      <motion.button
        onClick={onClick}
        whileHover={!isFuture ? { scale: 1.15 } : {}}
        whileTap={!isFuture ? { scale: 0.9 } : {}}
        className={`relative z-10 w-3.5 h-3.5 rounded-[3px] transition-all duration-700 outline-none ${
          isSelected ? 'ring-1 ring-white ring-offset-1 ring-offset-[#050505]' : ''
        } ${
          isFuture ? 'bg-white/[0.02] border border-white/5 cursor-not-allowed' :
          day.score === 0 ? 'bg-zinc-900 border border-white/5' : 
          'bg-[#bfff00] shadow-[0_0_15px_rgba(191,255,0,0.4)]'
        } ${isToday && day.score > 0 ? 'animate-pulse' : ''}`}
        style={{ opacity: !isFuture && day.score > 0 ? (day.score / 10) + 0.2 : 1 }}
      />
    </div>
  );
};

// --- MAIN PAGE ---
export default function AuraTracker() {
  const [mounted, setMounted] = useState(false);
  const [log, setLog] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{score: number, verdict: string} | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [history, setHistory] = useState<Record<string, number>>({});
  
  const [goals, setGoals] = useState<Goal[]>([
    { id: 1, title: "Neural Engineering", progress: 0 },
    { id: 2, title: "Physical Peak", progress: 0 },
    { id: 3, title: "Deep Work Protocol", progress: 0 }
  ]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('aura_history');
    const savedGoals = localStorage.getItem('aura_goals');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem('aura_goals', JSON.stringify(goals));
  }, [goals, mounted]);

  const ProtocolAdjustment = ({ score, avgAura }: { score: number, avgAura: number }) => {
    // Logic to determine the "Protocol" based on performance
    const getProtocol = () => {
      if (score < 4) return {
        title: "RECOVERY_PROTOCOL",
        action: "Neural Reset Required",
        desc: "Baseline frequency too low. Immediate 15min physical movement and 2L hydration recommended to clear latency.",
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20"
      };
      if (score >= 4 && score < 8) return {
        title: "STABILITY_PROTOCOL",
        action: "Incremental Loading",
        desc: "System stable but idle. Increase Deep Work blocks by 20% to break out of the maintenance plateau.",
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-400/20"
      };
      return {
        title: "APEX_PROTOCOL",
        action: "High-Frequency Flow",
        desc: "Maximum stability detected. Lock distractions. Today is a primary build window—do not compromise momentum.",
        color: "text-[#bfff00]",
        bg: "bg-[#bfff00]/10",
        border: "border-[#bfff00]/20"
      };
    };
  
    const p = getProtocol();
  
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-6 rounded-[2rem] border ${p.border} ${p.bg} backdrop-blur-xl relative overflow-hidden`}
      >
        {/* Decorative Scanner Line */}
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className={`absolute top-0 h-[1px] w-20 bg-gradient-to-r from-transparent via-current to-transparent ${p.color}`}
        />
  
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className={`flex items-center gap-2 mb-1 font-mono text-[9px] font-black uppercase tracking-[0.2em] ${p.color}`}>
              <Cpu size={12} /> {p.title}
            </div>
            <h4 className="text-xl font-black italic uppercase tracking-tighter text-white">
              {p.action}
            </h4>
          </div>
          <div className={`p-2 rounded-lg bg-black/40 border ${p.border}`}>
            <Wand2 size={16} className={p.color} />
          </div>
        </div>
  
        <p className="text-[10px] text-zinc-400 font-medium leading-relaxed uppercase mb-4">
          {p.desc}
        </p>
  
        <div className="flex gap-2">
          <button className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all hover:bg-white hover:text-black ${p.border} ${p.color}`}>
            Accept_Protocol
          </button>
        </div>
      </motion.div>
    );
  };

  // THE ENGINE: Calculates grid based on History state
  const { gridData, stats, forecast } = useMemo(() => {
    const days: DayData[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toLocaleDateString('en-CA');
    
    let totalScore = 0;
    let loggedDays = 0;

    for (let i = 0; i < 371; i++) {
      const d = new Date(2026, 0, 1);
      d.setDate(d.getDate() + i);
      const key = d.toLocaleDateString('en-CA');
      const isFuture = d > today;
      const score = history[key] || 0;
      
      if (score > 0) {
        totalScore += score;
        loggedDays++;
      }
      days.push({ date: d, score, isFuture, key });
    }

    const avg = loggedDays ? (totalScore / loggedDays).toFixed(1) : "0.0";
    const trajectory = parseFloat(avg) > 7 ? "Apex" : parseFloat(avg) > 3 ? "Stable" : "Idle";

    return { gridData: days, stats: { avg, loggedDays }, forecast: trajectory };
  }, [history]); // This ensures grid updates when history changes

  const dailyProgressTotal = useMemo(() => {
    const total = goals.reduce((acc, curr) => acc + curr.progress, 0);
    return Math.round(total / goals.length);
  }, [goals]);

  const syncAura = async () => {
    if (!log) return;
    setLoading(true);
    const todayKey = new Date().toLocaleDateString('en-CA');

    try {
      const res = await fetch('/api/aura-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ log }),
      });
      const data = await res.json();
      
      const updatedHistory = { ...history, [todayKey]: data.score };
      setHistory(updatedHistory);
      localStorage.setItem('aura_history', JSON.stringify(updatedHistory));
      setResult(data);
    } catch {
      const local = calculateAuraLocally(log);
      const updatedHistory = { ...history, [todayKey]: local.score };
      setHistory(updatedHistory);
      localStorage.setItem('aura_history', JSON.stringify(updatedHistory));
      setResult(local);
    } finally {
      setLoading(false);
      setLog("");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-16 font-sans selection:bg-[#bfff00] selection:text-black">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-16 flex flex-col lg:flex-row justify-between items-end gap-8 pb-8 border-b border-white/5">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 text-[#bfff00] font-mono text-[10px] tracking-[0.5em] mb-4 uppercase opacity-70">
              <div className="w-2 h-2 rounded-full bg-[#bfff00] animate-pulse" /> Kinetic_System_2026
            </div>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter italic uppercase leading-[0.75]">
              Momentum<span className="text-zinc-800">.</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-end gap-4 w-full lg:w-auto">
            <AnimatePresence mode="wait">
              {result && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} 
                  className="bg-[#bfff00] text-black px-6 py-4 rounded-2xl shadow-2xl min-w-[260px]">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">Coach_Verdict</p>
                  <p className="text-sm font-bold italic leading-tight">"{result.verdict}"</p>
                  <div className="mt-2 flex justify-between items-end border-t border-black/10 pt-2">
                    <span className="text-2xl font-black italic">{result.score}/10</span>
                    <span className="text-[8px] font-mono uppercase font-bold tracking-tighter">{forecast}_MODE</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-2 bg-zinc-900/40 p-1.5 rounded-[20px] border border-white/10">
              <div className="px-5 py-3 border-r border-white/5 text-center">
                <p className="text-[8px] text-zinc-600 font-bold uppercase mb-1">Avg_Aura</p>
                <p className="text-2xl font-black text-white italic leading-none">{stats.avg}</p>
              </div>
              <div className="px-5 py-3 text-center">
                <p className="text-[8px] text-zinc-600 font-bold uppercase mb-1">Active</p>
                <p className="text-2xl font-black text-[#bfff00] italic leading-none">{stats.loggedDays}D</p>
              </div>
            </div>
          </div>
        </header>

        <section className="min-w-0">
          {/* GRID */}
          <div className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-10 mb-8 backdrop-blur-3xl relative">
            <div className="overflow-x-auto pb-6 scrollbar-hide">
              <div className="grid grid-flow-col grid-rows-7 gap-2.5 w-max">
                {gridData.map((d) => (
                  <AuraCell 
                    key={d.key} 
                    day={d} 
                    isFuture={d.isFuture} 
                    isSelected={selectedDay?.key === d.key}
                    onClick={() => !d.isFuture && setSelectedDay(d)}
                    dailyProgress={d.key === new Date().toLocaleDateString('en-CA') ? dailyProgressTotal : 0}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence>
  {selectedDay && (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, scale: 0.95 }} 
      className="mt-8 pt-8 border-t border-white/5"
    >
      <div className="grid md:grid-cols-3 gap-6 bg-zinc-900/40 p-6 rounded-[2rem] border border-white/10 backdrop-blur-md">
        
        {/* COL 1: IDENTITY */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#bfff00] animate-pulse" />
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Data_Point_{selectedDay.key}</p>
          </div>
          <h4 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
            Aura_{selectedDay.score}/10
          </h4>
          <div className="flex gap-2">
            {selectedDay.score > 7 ? (
              <span className="text-[8px] px-2 py-0.5 rounded-md bg-[#bfff00]/10 text-[#bfff00] border border-[#bfff00]/20 font-bold uppercase">Apex_State</span>
            ) : (
              <span className="text-[8px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-500 border border-white/5 font-bold uppercase">Maintenance</span>
            )}
          </div>
        </div>

        {/* COL 2: PERFORMANCE METRICS */}
        <div className="flex flex-col justify-center space-y-4 border-x border-white/5 px-6">
          <div className="flex justify-between items-end">
             <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Focus_Intensity</span>
             <span className="text-xs font-mono text-white">{selectedDay.score * 10}%</span>
          </div>
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${selectedDay.score * 10}%` }} 
              className="h-full bg-[#bfff00]" 
            />
          </div>
          <p className="text-[9px] text-zinc-400 leading-relaxed font-medium">
             System analysis suggests this day operated at <span className="text-white italic">{selectedDay.score > 5 ? 'High' : 'Low'} Frequency</span>. No critical drifts detected.
          </p>
        </div>

        {/* COL 3: ACTIONS & CLOSE */}
        <div className="flex flex-col justify-between items-end">
          <button 
            onClick={() => setSelectedDay(null)} 
            className="p-2 hover:bg-white/10 rounded-full text-zinc-500 transition-colors"
          >
            <X size={20}/>
          </button>
          <div className="text-right">
             <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Neural_Memory</p>
             <p className="text-[10px] text-zinc-400 italic">Click "Punch In" again to override this day's frequency.</p>
          </div>
        </div>

      </div>
    </motion.div>
  )}
</AnimatePresence>
          </div>

          {/* INTERACTIVE CARDS */}
          <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/10 border border-white/5 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-6">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Objective_Sync</p>
                 <ShieldCheck size={14} className="text-zinc-600" />
              </div>
              <div className="space-y-6">
                {goals.map((goal) => (
                  <button key={goal.id} onClick={() => setGoals(goals.map(g => g.id === goal.id ? {...g, progress: Math.min(g.progress + 10, 100)} : g))} className="w-full text-left space-y-2 group">
                    <div className="flex justify-between text-[10px] font-bold uppercase italic tracking-tighter">
                      <span className="group-hover:text-[#bfff00] transition-colors">{goal.title}</span>
                      <span className="text-[#bfff00]">{goal.progress}%</span>
                    </div>
                    <div className="h-[2px] bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div animate={{ width: `${goal.progress}%` }} className="h-full bg-[#bfff00]" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900/10 border border-white/5 rounded-3xl p-8 flex flex-col justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-[#bfff00]/10 p-3 rounded-2xl"><TrendingUp className="text-[#bfff00]" size={20} /></div>
                    <div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase">Trajectory</p>
                        <p className="text-2xl font-black italic uppercase text-white">{forecast}_Flow</p>
                    </div>
                </div>
                <div className="mt-6 space-y-3">
                    <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                        <AlertCircle size={14} className="text-[#bfff00]" />
                        <p className="text-[10px] text-zinc-400 font-mono leading-tight uppercase">Recommendation: Click objectives to charge the Today Ring.</p>
                    </div>
                </div>
            </div>
          </div>

          {/* INPUT AREA */}
          <div className="relative group max-w-2xl mx-auto lg:mx-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#bfff00]/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-zinc-900/90 border border-white/10 rounded-3xl p-2 flex items-center shadow-2xl">
              <div className="pl-6 text-zinc-500"><Brain size={20} /></div>
              <input 
                className="flex-1 bg-transparent px-6 py-6 outline-none text-sm placeholder:text-zinc-800 font-medium"
                placeholder="Declare today's frequency..."
                value={log}
                onChange={(e) => setLog(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && syncAura()}
              />
              <button onClick={syncAura} className="bg-[#bfff00] text-black px-10 py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all active:scale-95 shadow-xl shadow-lime-500/10">
                {loading ? "SYNCING" : "PUNCH IN"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}