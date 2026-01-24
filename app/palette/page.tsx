"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, RefreshCw, Palette, Check, Zap, ArrowLeft, Wand2, Sparkles } from "lucide-react";
import Link from 'next/link';
import { toast } from 'sonner';

export default function PalettePage() {
  const [vibe, setVibe] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isLampMode, setIsLampMode] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // --- THE LAMP GLITCH LOGIC ---
  useEffect(() => {
    if (vibe.toLowerCase() === "lamp") {
      setIsLampMode(true);
      setColors(['#10002B', '#240046', '#3C096C', '#FFD700', '#E0AA3E']);
      toast("The Lamp has been rubbed. Wish granted.", {
        icon: '🧞‍♂️',
        style: { background: '#240046', color: '#FFD700', border: '1px solid #FFD700' }
      });
    } else {
      setIsLampMode(false);
    }
  }, [vibe]);

  const getPalette = async () => {
    if (!vibe || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/palette", {
        method: "POST",
        body: JSON.stringify({ vibe }),
      });
      const data = await res.json();
      setColors(data.colors);
      toast.success("Neural harmonies synced.");
    } catch (err) {
      setColors(['#0F172A', '#1E293B', '#334155', '#475569', '#64748B']);
      toast.error("Using fallback harmonies.");
    }
    setLoading(false);
  };

  const copyColor = (color: string, index: number) => {
    navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    toast.success(`${color} copied`);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <motion.div 
      animate={{ backgroundColor: isLampMode ? "#0D001A" : "#030303" }}
      className="min-h-screen text-zinc-100 p-6 md:p-12 relative overflow-hidden transition-colors duration-1000 font-sans"
    >
      {/* BACKGROUND DECOR */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] blur-[120px] rounded-full transition-colors duration-1000 ${isLampMode ? 'bg-purple-600/20' : 'bg-cyan-500/10'}`} />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* NAV */}
        <nav className="flex justify-between items-center mb-16">
          <Link href="/" className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-xs font-black tracking-widest uppercase">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Hub
          </Link>
          <div className="px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase">
            {isLampMode ? "LEGENDARY STATUS" : "Experiment // 002"}
          </div>
        </nav>

        <header className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase mb-2">
            Palette <span className={`transition-all duration-1000 ${isLampMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-yellow-500' : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600'}`}>Genie</span>
          </h1>
          <p className="text-zinc-500 font-mono text-[10px] tracking-[0.4em] uppercase">Neural Color Summoning System</p>
        </header>

        {/* SUMMONING INTERFACE (THE MIST) */}
        <div className="relative mb-24 max-w-2xl group">
            {/* The Outer Glow */}
            <div className={`absolute -inset-4 rounded-[2rem] blur-2xl transition-all duration-1000 ${
                (isHovering || vibe) ? (isLampMode ? 'bg-yellow-500/20 opacity-100' : 'bg-cyan-500/20 opacity-100') : 'opacity-0'
            }`} />

            <div className="relative bg-zinc-950 border border-zinc-800 rounded-[2rem] p-2 flex flex-col md:flex-row gap-2 shadow-2xl overflow-hidden">
                
                {/* THE MIST OVERLAY */}
                <AnimatePresence>
                    {(!vibe && !isHovering && !loading) && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
                            className="absolute inset-0 z-20 pointer-events-none backdrop-blur-md bg-zinc-900/40 flex items-center justify-center"
                        >
                            <span className="text-zinc-500 text-xs font-black tracking-[0.5em] uppercase animate-pulse">Rub to Summon</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <input 
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                    onFocus={() => setIsHovering(true)}
                    onBlur={() => setIsHovering(false)}
                    onKeyDown={(e) => e.key === 'Enter' && getPalette()}
                    placeholder="Describe a vibe..."
                    className="flex-1 bg-transparent px-6 py-4 outline-none text-zinc-200 placeholder:text-zinc-700 font-medium z-10"
                />

                <button 
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onClick={getPalette}
                    disabled={loading || !vibe}
                    className={`relative overflow-hidden px-8 py-4 rounded-[1.4rem] font-black text-xs tracking-widest uppercase transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-30 z-10 ${
                        isLampMode ? 'bg-yellow-500 text-black' : 'bg-white text-black hover:bg-cyan-400'
                    }`}
                >
                    {loading ? (
                        <RefreshCw className="animate-spin" size={16} />
                    ) : (
                        <>
                            <motion.div
                                animate={ (isHovering || vibe) ? { rotate: 360, scale: [1, 1.2, 1] } : {} }
                                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            >
                                <Sparkles size={16} />
                            </motion.div>
                            {isLampMode ? "Summon" : "Grant Wish"}
                        </>
                    )}
                </button>
            </div>
        </div>

        {/* PALETTE DISPLAY */}
        <div className="flex flex-col md:flex-row gap-3 h-[450px] mb-24 w-full overflow-hidden">
          <AnimatePresence mode="popLayout">
            {colors.length > 0 ? colors.map((color, i) => (
              <motion.div
                key={color + i}
                initial={{ opacity: 0, flexGrow: 0 }}
                animate={{ opacity: 1, flexGrow: 1 }}
                exit={{ opacity: 0, flexGrow: 0 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: i * 0.05 }}
                onClick={() => copyColor(color, i)}
                className="group relative cursor-pointer flex flex-col items-center justify-end pb-10 rounded-[2.5rem] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:flex-[3] min-w-[60px] border border-white/5"
                style={{ backgroundColor: color }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 group-hover:to-black/60 transition-all rounded-[2.5rem]" />
                <div className="relative z-10 flex flex-col items-center gap-4 w-full px-2">
                    <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 bg-black/30 backdrop-blur-xl p-3 rounded-full border border-white/20">
                        {copiedIndex === i ? <Check size={18} className="text-white" /> : <Copy size={18} className="text-white" />}
                    </div>
                    <div className="bg-black/40 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-center min-w-[80px]">
                        <p className="font-mono text-[12px] font-bold tracking-tighter text-white uppercase">{color}</p>
                    </div>
                </div>
              </motion.div>
            )) : (
              [...Array(5)].map((_, i) => (
                <div key={i} className="flex-1 bg-zinc-900/40 border border-zinc-800/50 border-dashed rounded-[2.5rem] animate-pulse" />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* LIVE UI PREVIEW */}
        {colors.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="relative mb-24">
            <div className="bg-zinc-900/20 rounded-[3rem] p-10 border border-zinc-800/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-[10px] font-black text-zinc-500 flex items-center gap-2 uppercase tracking-[0.4em]">
                        <Zap size={14} className={isLampMode ? "text-yellow-500" : "text-cyan-500"} /> Neural Output Preview
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div style={{ color: colors[0] }} className="text-5xl font-black tracking-tighter leading-[0.9] italic uppercase transition-colors duration-1000">
                            The Lab <br/> Never Sleeps.
                        </div>
                        <p className="text-zinc-500 text-lg leading-relaxed max-w-sm font-medium">
                            Testing harmonies for <span className="text-zinc-200">{vibe}</span>.
                        </p>
                        <div className="flex gap-4">
                            <button style={{ backgroundColor: colors[3] }} className="px-8 py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase text-black hover:brightness-110 transition-all shadow-xl">
                                Initialize
                            </button>
                            <button style={{ borderColor: colors[1], color: colors[1] }} className="px-8 py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase border hover:bg-white/5 transition-colors">
                                Archive
                            </button>
                        </div>
                    </div>
                    
                    <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-zinc-800 bg-zinc-950 p-2 shadow-2xl">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundColor: colors[4] }} />
                        <div className="relative h-full w-full rounded-[2rem] bg-zinc-900/80 backdrop-blur-xl p-8 flex flex-col justify-between border border-white/5">
                            <div className="flex justify-between items-start">
                                <div className="space-y-3">
                                    <div className="h-2.5 w-32 rounded-full" style={{ backgroundColor: colors[0] }} />
                                    <div className="h-2.5 w-20 rounded-full opacity-30" style={{ backgroundColor: colors[3] }} />
                                </div>
                                <div className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: colors[1] }}>
                                    <Sparkles size={24} className="text-black/40" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-12 w-full rounded-xl bg-zinc-800/50" />
                                <div className="h-6 w-3/4 rounded-xl bg-zinc-800/50 opacity-50" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}