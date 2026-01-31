"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ghost, Loader2, Sparkles, MoveLeft, Scan, Share2, Disc, Info, X } from 'lucide-react';
import Link from 'next/link';

export default function AuraMorphos() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [auraData, setAuraData] = useState<any>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [loadIdx, setLoadIdx] = useState(0);

  const loadingMessages = [
    "DECODING NEURAL ARCHITECTURE...",
    "CALIBRATING PRIMARY FREQUENCY...",
    "LOCATING SHADOW IDENTITY...",
    "MAPPING DIGITAL DNA..."
  ];

  // Cycle through loading messages while processing
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const analyzeSoul = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch('/api/morphos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: input }),
      });
  
      if (res.ok) {
        const data = await res.json();
        setAuraData(data);
      } else {
        // 🚨 SAFETY VALVE: If API is blocked, generate a local fallback
        console.warn("API Throttled. Switching to Local Synthesis.");
        generateFallbackAura();
      }
    } catch (err) {
      generateFallbackAura();
    } finally {
      setLoading(false);
    }
  };
  
  // Add this function inside your component
  const generateFallbackAura = () => {
    const fallbacks = [
      {
        primaryColor: "#bfff00",
        secondaryColor: "#00ff88",
        pulseDuration: 2.5,
        title: "System Architect",
        description: "A soul forged in logic and acid-green neon.",
        antiTitle: "The Chaos Artist"
      },
      {
        primaryColor: "#ff0055",
        secondaryColor: "#5500ff",
        pulseDuration: 4.0,
        title: "Silent Observer",
        description: "Deep, rhythmic thoughts that move like slow tides.",
        antiTitle: "The Loud Critic"
      }
    ];
    // Pick a random one
    setAuraData(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
    alert("⚠️ API OFFLINE: Lab is running on Emergency Backup Power (Local Synthesis Mode).");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] relative overflow-hidden selection:bg-[#bfff00] selection:text-black font-sans">
      
      {/* 1. BACKGROUND AMBIENCE */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#111_0%,#050505_100%)]" />
        <motion.div 
          animate={{ opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#bfff00]/5 blur-[120px] rounded-full"
        />
      </div>

      {/* 2. NAVIGATION */}
      <nav className="relative z-50 p-8 flex justify-between items-center">
        <Link href="/" className="group flex items-center gap-3 font-mono text-[10px] tracking-[0.4em] text-zinc-500 hover:text-[#bfff00] transition-all">
          <MoveLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> 
          LAB_EXIT
        </Link>
        
        <button 
          onClick={() => setShowInfo(true)}
          className="group flex items-center gap-2 px-4 py-2 bg-[#bfff00]/5 border border-[#bfff00]/20 rounded-full hover:bg-[#bfff00]/10 transition-all"
        >
          <span className="w-1.5 h-1.5 bg-[#bfff00] rounded-full animate-pulse" />
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#bfff00] uppercase">System_Protocol.info</span>
        </button>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-12 grid lg:grid-cols-2 gap-16">
        
        {/* LEFT: THE INTERFACE */}
        <div className="flex flex-col justify-center space-y-12">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-[#bfff00] mb-6">
              <Scan size={16} />
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase underline decoration-[#bfff00]/30 underline-offset-8">Frequency_Scanner</span>
            </motion.div>
            <h1 className="text-8xl font-black tracking-tighter leading-[0.8] mb-8 uppercase italic">
              Aura <br />
              <span className="text-zinc-900 outline-text">Morphos</span>
            </h1>
          </div>

          <div className="relative group">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste digital DNA (Bio, Tweets, Manifesto)..."
              className="w-full h-64 bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] p-10 text-xl font-light focus:outline-none focus:border-[#bfff00]/50 transition-all placeholder:text-zinc-800 resize-none backdrop-blur-md"
            />
            <div className="absolute -bottom-6 right-8">
              <button 
                onClick={analyzeSoul}
                disabled={loading || !input}
                className="h-16 px-10 bg-[#bfff00] text-black rounded-full font-black uppercase tracking-tighter flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(191,255,0,0.15)] disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                {loading ? loadingMessages[loadIdx] : "Extract Soul"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: THE PULSE & RESULTS */}
        <div className="relative min-h-[500px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!auraData && !loading && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="w-64 h-64 rounded-full border border-zinc-900 border-dashed flex items-center justify-center animate-spin-slow">
                  <Disc size={40} className="text-zinc-900" />
                </div>
                <p className="font-mono text-[10px] text-zinc-700 uppercase tracking-[0.5em]">Awaiting Neural Signal</p>
              </motion.div>
            )}

            {auraData && !loading && (
              <motion.div 
                key="aura"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full flex flex-col items-center"
              >
                {/* THE LIQUID BLOB */}
                <div className="relative w-80 h-80 flex items-center justify-center">
                  <motion.div 
                    animate={{
                      scale: [1, 1.2, 0.9, 1.1, 1],
                      rotate: [0, 90, 180, 270, 360],
                      borderRadius: ["40% 60% 70% 30%", "60% 40% 30% 70%", "40% 60% 70% 30%"]
                    }}
                    transition={{ duration: auraData.pulseDuration || 5, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      background: `linear-gradient(135deg, ${auraData.primaryColor}, ${auraData.secondaryColor})`,
                      boxShadow: `0 0 100px ${auraData.primaryColor}33`,
                    }}
                    className="absolute inset-0 blur-2xl opacity-50"
                  />
                  
                  <div className="relative z-10 text-center">
                    <h2 className="text-5xl font-black uppercase tracking-tighter text-white drop-shadow-2xl">
                      {auraData.title}
                    </h2>
                    <div className="mt-4 px-4 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-[9px] font-mono tracking-widest uppercase text-[#bfff00]">
                      Stability: {auraData.pulseDuration > 3 ? "HIGH" : "FLUID"}
                    </div>
                  </div>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-lg">
                  <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/50">
                    <span className="text-[9px] font-mono text-[#bfff00] uppercase block mb-3 tracking-widest">// ESSENCE</span>
                    <p className="text-sm text-zinc-400 italic leading-relaxed font-light">{auraData.description}</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20">
                    <div className="flex items-center gap-2 text-red-500 mb-3">
                      <Ghost size={14} />
                      <span className="text-[9px] font-mono uppercase tracking-widest">SHADOW</span>
                    </div>
                    <p className="text-xl font-black uppercase tracking-tighter text-white leading-none">{auraData.antiTitle}</p>
                    <p className="text-[8px] font-mono text-zinc-600 mt-3 uppercase tracking-tighter">REJECTED_FREQUENCY</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* 3. CINEMATIC LORE OVERLAY */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-8"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="max-w-3xl w-full relative"
            >
              <button 
                onClick={() => setShowInfo(false)}
                className="absolute -top-16 right-0 p-3 text-zinc-500 hover:text-[#bfff00] transition-colors flex items-center gap-2 font-mono text-xs uppercase"
              >
                Close Protocol <X size={16} />
              </button>

              <h2 className="text-6xl font-black uppercase italic tracking-tighter text-[#bfff00] mb-12">System Briefing</h2>
              
              <div className="grid md:grid-cols-2 gap-16">
                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-white border-b border-zinc-800 pb-4">
                    <span className="font-mono text-lg text-[#bfff00]">01</span>
                    <h4 className="font-black uppercase tracking-tighter">Neural Frequency</h4>
                  </div>
                  <p className="text-zinc-500 font-light leading-relaxed italic">
                    The Morphos measurements are biological. By analyzing the sentiment density of your digital sample, we calculate the <span className="text-white">Aura Hue</span>. The pulse duration represents your kinetic intent—the rhythm of your productivity.
                  </p>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-white border-b border-zinc-800 pb-4">
                    <span className="font-mono text-lg text-red-500">02</span>
                    <h4 className="font-black uppercase tracking-tighter">Shadow Identity</h4>
                  </div>
                  <p className="text-zinc-500 font-light leading-relaxed italic">
                    Every light casts a shadow. Using an inversion algorithm, the AI determines who you are in a reality where your traits were reversed. It is the <span className="text-white">Rejected Frequency</span>—the version of you that simply cannot exist.
                  </p>
                </section>
              </div>

              <div className="mt-20 flex justify-between items-end">
                <div className="space-y-1">
                  <p className="font-mono text-[9px] text-zinc-700 uppercase tracking-[0.3em]">Aura Morphos Lab // v1.0.9</p>
                  <p className="font-mono text-[9px] text-zinc-700 uppercase tracking-[0.3em]">Status: Confidential</p>
                </div>
                <div className="w-32 h-[1px] bg-zinc-800" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-0 left-0 w-full p-8 flex justify-between items-end pointer-events-none text-zinc-800">
        <div className="text-[8px] font-mono uppercase leading-tight">
          System_Access: Granted <br />
          Shahid_Labs // Session_09
        </div>
      </footer>

      <style jsx>{`
        .outline-text {
          -webkit-text-stroke: 1px #1a1a1a;
          color: transparent;
        }
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}