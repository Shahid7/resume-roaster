"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Target, Flame, ArrowLeft, Send, Sparkles, Timer, X, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function Aura() {
  const [goal, setGoal] = useState("");
  const [strategy, setStrategy] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTimer, setActiveTimer] = useState<{label: string, minutes: number} | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      // Play a subtle notification sound if you want here
    }
    return () => clearInterval(interval);
  }, [activeTimer, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTask = (label: string) => {
    const times: Record<string, number> = { 
      "Minimalist": 15 * 60, 
      "Deep Work": 120 * 60, 
      "Extreme": 240 * 60 
    };
    setActiveTimer({ label, minutes: times[label] / 60 });
    setTimeLeft(times[label]);
  };

  const getAura = async () => {
    if (!goal) return;
    setLoading(true);
    try {
      const res = await fetch("/api/aura", {
        method: "POST",
        body: JSON.stringify({ goal, energy: "high" }),
      });
      const data = await res.json();
      setStrategy(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white p-6 font-sans overflow-hidden selection:bg-purple-500/30">
      
      {/* TIMER OVERLAY (Active Focus Mode) */}
      <AnimatePresence>
        {activeTimer && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-center"
          >
            <button onClick={() => setActiveTimer(null)} className="absolute top-10 right-10 p-4 text-zinc-500 hover:text-white transition-all">
              <X size={32} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="relative"
            >
              <span className="text-purple-500 font-black tracking-[0.5em] uppercase text-xs mb-4 block">Focus Session: {activeTimer.label}</span>
              <h2 className="text-[12rem] font-black italic tracking-tighter leading-none mb-4 tabular-nums">
                {formatTime(timeLeft)}
              </h2>
              <p className="max-w-md mx-auto text-zinc-500 text-lg italic">
                {timeLeft > 0 ? "Shut out the world. You are in the flow state now." : "Mission Complete. Return to the Lab."}
              </p>
            </motion.div>

            {timeLeft === 0 && (
              <motion.button 
                initial={{ y: 20 }} animate={{ y: 0 }}
                onClick={() => setActiveTimer(null)}
                className="mt-12 px-12 py-4 bg-white text-black font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all flex items-center gap-2"
              >
                <CheckCircle2 size={18} /> Exit Focus
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto relative z-10 pt-12">
        <nav className="mb-16 flex justify-between">
          <Link href="/" className="text-[10px] tracking-[0.4em] text-zinc-500 hover:text-white transition-all uppercase font-black">
            ← Lab_Interface
          </Link>
          <span className="text-[10px] text-purple-500 font-bold tracking-widest">SESSION_06</span>
        </nav>

        {!strategy && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
             <h1 className="text-7xl font-black italic tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-700">AURA.</h1>
            <p className="text-zinc-500 mb-12 uppercase text-[10px] tracking-widest font-bold">Declare your objective for the day.</p>
            
            <div className="relative max-w-lg mx-auto">
              <input 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && getAura()}
                placeholder="Ex: Building the next unicorn..."
                className="w-full bg-zinc-900/30 border border-zinc-800 p-8 rounded-3xl text-xl focus:outline-none focus:border-purple-500/50 transition-all text-center italic placeholder:text-zinc-800"
              />
              <button 
                onClick={getAura}
                className="mt-8 w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-purple-600 hover:text-white transition-all shadow-2xl hover:shadow-purple-500/20"
              >
                Calculate Strategy
              </button>
            </div>
          </motion.div>
        )}

        {loading && (
          <div className="py-40 text-center flex flex-col items-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-t-2 border-purple-500 rounded-full mb-8"
            />
            <p className="text-[10px] font-black tracking-[0.5em] text-zinc-600 uppercase">Synchronizing Momentum...</p>
          </div>
        )}

        <AnimatePresence>
          {strategy && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
              <div className="text-center mb-16">
                <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest block mb-2">Strategy Selected</span>
                <h2 className="text-5xl font-black italic tracking-tighter">{strategy.strategyTitle}</h2>
              </div>

              <div className="grid gap-4">
                {[
                  { label: "Minimalist", data: strategy.minimalist, icon: <Zap size={20} />, color: "hover:border-blue-500/50 group-hover:bg-blue-500/10" },
                  { label: "Deep Work", data: strategy.deepWork, icon: <Target size={20} />, color: "hover:border-purple-500/50 group-hover:bg-purple-500/10" },
                  { label: "Extreme", data: strategy.extreme, icon: <Flame size={20} />, color: "hover:border-orange-500/50 group-hover:bg-orange-500/10" }
                ].map((tier, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.02, x: 10 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startTask(tier.label)}
                    className="group cursor-pointer p-8 border border-zinc-800 bg-zinc-900/20 rounded-[2.5rem] transition-all flex gap-8 items-center relative overflow-hidden"
                  >
                    <div className={`p-5 rounded-2xl bg-zinc-900 border border-zinc-800 transition-colors ${tier.color}`}>
                      {tier.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                         <h3 className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">{tier.label}</h3>
                         <span className="text-[10px] font-bold text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">START SESSION →</span>
                      </div>
                      <p className="text-2xl font-bold text-white mb-2">{tier.data.task}</p>
                      <p className="text-xs text-zinc-500 italic">Impact: {tier.data.impact}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pt-20 text-center flex flex-col items-center">
                <p className="text-sm italic text-zinc-600 font-serif max-w-xs leading-relaxed">"{strategy.quote}"</p>
                <button onClick={() => setStrategy(null)} className="mt-12 text-[10px] font-black uppercase text-zinc-800 hover:text-white transition-all tracking-[0.3em]">
                  New Objective
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}