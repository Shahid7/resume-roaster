"use client";
import { SUNNAH_LIBRARY } from './data';
import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, CheckCircle2, Zap, BookOpen, History } from 'lucide-react';

export default function SunnahStream() {
  const [dailySunnahs, setDailySunnahs] = useState<any[]>([]);
  const [completed, setCompleted] = useState<number[]>([]);
  const [noorPoints, setNoorPoints] = useState(0);

  // Change this to test different days (e.g., 0, 1, 2...)
  const dayOffset = 0; 

  useEffect(() => {
    // 1. Load Total Points
    const savedPoints = localStorage.getItem('noor_points_total');
    if (savedPoints) setNoorPoints(parseInt(savedPoints));
    
    // 2. Load Completed IDs
    const savedCompleted = localStorage.getItem('sunnah_completed_today');
    const localCompleted: number[] = savedCompleted ? JSON.parse(savedCompleted) : [];
    
    // Cast dayOffset to number to stop TypeScript from complaining about "no overlap"
    const currentOffset = dayOffset as number;

    // 3. Calculation Logic
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24)) + currentOffset;

    // 4. FILTER ENGINE
    // If testing (offset > 0), we show everything. 
    // If live (offset === 0), we filter out what you've already done.
    const pool = currentOffset !== 0 
      ? SUNNAH_LIBRARY 
      : SUNNAH_LIBRARY.filter(s => !localCompleted.includes(s.id));

    // Reset visual checkmarks only when testing different days
    setCompleted(currentOffset !== 0 ? [] : localCompleted);

    const perDay = 10;
    const startIndex = (dayOfYear * perDay) % (pool.length || 1);
    
    let selection = pool.slice(startIndex, startIndex + perDay);
    
    if (selection.length < perDay && pool.length > perDay) {
      selection = [...selection, ...pool.slice(0, perDay - selection.length)];
    }

    setDailySunnahs(selection);

  }, [dayOffset]);

  const handleComplete = (sunnah: any) => {
    if (completed.includes(sunnah.id)) return;
    
    const updatedPoints = noorPoints + sunnah.points;
    const updatedCompleted = [...completed, sunnah.id];
    
    setCompleted(updatedCompleted);
    setNoorPoints(updatedPoints);
    
    localStorage.setItem('noor_points_total', updatedPoints.toString());
    localStorage.setItem('sunnah_completed_today', JSON.stringify(updatedCompleted));

    // Remove the completed item from the current view immediately for that "disappearing" effect
    setDailySunnahs(prev => prev.filter(item => item.id !== sunnah.id));
  };

  return (
    <div className="min-h-screen bg-[#061612] text-white p-4 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <header className="flex flex-col md:flex-row justify-between items-center bg-white/[0.03] border border-white/10 p-10 rounded-[50px] backdrop-blur-3xl shadow-2xl">
          <div className="flex items-center gap-8">
            <div className="relative h-24 w-24 rounded-[32px] bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Trophy size={48} className="text-emerald-950" />
            </div>
            <div>
              <h2 className="text-6xl font-black tracking-tighter italic">{noorPoints}</h2>
              <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
                <Sparkles size={12}/> Noor Points Balance
              </p>
            </div>
          </div>
          <div className="bg-emerald-500/10 text-emerald-400 px-6 py-2 rounded-2xl border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
            {completed.length} Sunnahs Revived
          </div>
        </header>

        

        <div className="space-y-4">
           <div className="flex items-center justify-between px-6 mb-4 text-emerald-500/50">
              <div className="flex items-center gap-3">
                <History size={16}/>
                <span className="text-xs font-black uppercase tracking-widest">Available Fresh Sunnahs</span>
              </div>
              <span className="text-[10px] font-bold">Day : {dayOffset}</span>
           </div>

          {dailySunnahs.length > 0 ? (
            dailySunnahs.map((s, idx) => (
              <button
                key={`${s.id}-${dayOffset}`}
                onClick={() => handleComplete(s)}
                className="w-full group relative flex items-center justify-between p-8 rounded-[40px] border border-white/5 bg-white/[0.04] transition-all duration-500 text-left hover:bg-white/[0.08] hover:border-emerald-500/40 hover:-translate-y-1"
              >
                <div className="flex items-center gap-8">
                  <div className="h-14 w-14 rounded-2xl flex items-center justify-center font-black text-xl bg-white/5 text-emerald-500/40 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl font-bold text-white">{s.title}</h3>
                      <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded text-[10px] font-black text-emerald-500/60 uppercase">
                        <BookOpen size={10}/> {s.book} {s.num}
                      </div>
                    </div>
                    <p className="text-emerald-100/40 mt-2 font-medium max-w-lg">{s.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-black text-white/20 group-hover:text-emerald-400 transition-colors">
                  <span className="text-sm">+{s.points}</span>
                  <Zap size={16} />
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
              <CheckCircle2 className="mx-auto mb-4 text-emerald-500" size={48} />
              <h3 className="text-2xl font-bold">All Available Sunnahs Completed!</h3>
              <p className="text-white/40 italic">Check back tomorrow for a new rotation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}