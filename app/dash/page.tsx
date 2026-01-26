"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Target, CheckCircle2, ShieldCheck, ArrowRight, BarChart3, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function DeenDash() {
  const [energy, setEnergy] = useState("");
  const [mission, setMission] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);

  const generateMission = async (level: string) => {
    setLoading(true);
    setMission(null);
    setCompleted([]);
    try {
      const res = await fetch("/api/dash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ energy: level }),
      });
      const data = await res.json();
      setMission(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (index: number) => {
    setCompleted(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <main className="min-h-screen bg-[#0a0f14] text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <nav className="flex justify-between items-center mb-12">
          <Link href="/" className="text-xs tracking-widest text-teal-500 font-bold uppercase hover:opacity-70 transition-all">
            ← Exit System
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono text-teal-500 uppercase tracking-tighter">System Active</span>
          </div>
        </nav>

        <div className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 italic">
            Deen<span className="text-teal-500">Dash</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">Daily Spiritual Operations // Select Energy Level</p>
        </div>

        {/* ENERGY SELECTOR */}
        {!mission && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[
              { id: "low", label: "Low Battery", desc: "Small, easy wins", icon: <Zap size={20}/> },
              { id: "focused", label: "Focused", desc: "Balanced growth", icon: <Target size={20}/> },
              { id: "high", label: "Warrior", desc: "High impact tasks", icon: <ShieldCheck size={20}/> }
            ].map((box) => (
              <button
                key={box.id}
                onClick={() => generateMission(box.id)}
                className="group p-6 bg-slate-900/50 border border-slate-800 rounded-xl text-left hover:border-teal-500/50 hover:bg-teal-500/5 transition-all cursor-pointer"
              >
                <div className="text-slate-500 group-hover:text-teal-500 transition-colors mb-4">{box.icon}</div>
                <h3 className="font-bold text-lg mb-1">{box.label}</h3>
                <p className="text-xs text-slate-500">{box.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="py-20 text-center">
            <BarChart3 className="mx-auto text-teal-500 animate-bounce mb-4" />
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-teal-500/50">Compiling Mission Data...</p>
          </div>
        )}

        {/* MISSION DISPLAY */}
        <AnimatePresence>
          {mission && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-8 bg-slate-900 border-l-4 border-teal-500 rounded-r-xl">
                <h2 className="text-xs font-mono text-teal-500 mb-2 uppercase tracking-widest">Primary Objective</h2>
                <h3 className="text-2xl font-bold uppercase">{mission.missionTitle}</h3>
              </div>

              <div className="grid gap-4">
                {mission.tasks.map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    onClick={() => toggleTask(idx)}
                    whileHover={{ x: 5 }}
                    className={`p-5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      completed.includes(idx) 
                      ? "bg-teal-500/10 border-teal-500/50" 
                      : "bg-slate-900/30 border-slate-800"
                    }`}
                  >
                    <div>
                      <h4 className={`font-bold transition-all ${completed.includes(idx) ? "line-through text-slate-500" : ""}`}>
                        {item.task}
                      </h4>
                      <p className="text-[11px] text-teal-500/70 uppercase tracking-wider font-semibold mt-1">
                        Reward: {item.reward}
                      </p>
                    </div>
                    {completed.includes(idx) ? (
                      <CheckCircle2 className="text-teal-500" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-slate-700" />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* FOOTER QUOTE */}
              <div className="p-6 bg-teal-500 text-black rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase opacity-60">System Boost</p>
                  <p className="font-bold text-lg">{mission.boost}</p>
                </div>
                <Zap fill="black" />
              </div>

              <button 
                onClick={() => setMission(null)}
                className="w-full py-4 border border-slate-800 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw size={14} /> Reset Mission
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}