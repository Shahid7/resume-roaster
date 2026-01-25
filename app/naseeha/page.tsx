"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Moon, Compass, Wind, Heart } from 'lucide-react';
import Link from 'next/link';

export default function NaseehaPage() {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMeditating, setIsMeditating] = useState(false);
  const [showEntry, setShowEntry] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowEntry(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const getNaseeha = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/naseeha", { method: "POST" });
      const data = await res.json();
      setAdvice(data.advice);
    } catch (err) {
      setAdvice("He knows what is in every heart. Trust His timing.");
    }
    setLoading(false);
  };

  return (
    <main className="h-screen w-full bg-[#020617] text-emerald-50 relative overflow-hidden font-sans">
      
      {/* 1. BISMILLAH ENTRY */}
      <AnimatePresence>
        {showEntry && (
          <motion.div 
            key="entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[100] bg-[#020617] flex items-center justify-center"
          >
            <motion.h2 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-emerald-400/90 text-4xl md:text-6xl font-serif"
            >
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREMIUM BACKGROUND OVERLAYS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* 2. MAIN CONTENT */}
      {!showEntry && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 h-full w-full flex flex-col p-6 md:p-12"
        >
          {/* TOP NAV */}
          <nav className="flex justify-between items-center w-full relative z-20">
            <Link href="/" className="group flex items-center gap-2 text-emerald-900 hover:text-emerald-200 transition-all text-xs font-black tracking-widest uppercase cursor-pointer">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Return
            </Link>
            <div className="text-[10px] font-bold tracking-[0.4em] text-emerald-800 uppercase">
              Day 03 // Tranquility
            </div>
          </nav>

          {/* CENTERED STAGE */}
          <div className="flex-1 flex flex-col items-center justify-center -mt-16">
            
            <AnimatePresence mode="wait">
              {!advice ? (
                /* STATE A: THE SEEKING BUTTON */
                <motion.div 
                  key="seeking"
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-col items-center"
                >
                  <header className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-emerald-500/5 border border-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                        <Moon className="text-emerald-400" size={24} strokeWidth={1.5} />
                      </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif italic tracking-tight mb-2 text-emerald-100">
                      Naseeha <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">AI</span>
                    </h1>
                    <p className="text-emerald-800 font-mono text-[9px] tracking-[0.4em] uppercase font-bold">Divine Wisdom for the Heart</p>
                  </header>

                  <div className="relative mb-10">
                    <motion.div 
                      animate={isMeditating ? { scale: [1, 1.4, 1], opacity: [0.1, 0.4, 0.1] } : { scale: 1, opacity: 0 }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute inset-0 bg-emerald-400 blur-3xl rounded-full"
                    />

                    <button
                      onMouseDown={() => setIsMeditating(true)}
                      onMouseUp={() => { setIsMeditating(false); getNaseeha(); }}
                      className="relative z-10 w-44 h-44 rounded-full border border-emerald-900/40 bg-zinc-950/50 backdrop-blur-sm flex flex-col items-center justify-center gap-3 group transition-all duration-700 hover:border-emerald-500/30 cursor-pointer"
                    >
                      {loading ? (
                        <Wind className="animate-spin text-emerald-500/50" size={28} />
                      ) : (
                        <>
                          <Compass className={`transition-all duration-1000 ${isMeditating ? 'rotate-180 text-emerald-400' : 'text-emerald-900'}`} size={32} strokeWidth={1} />
                          <span className="text-[8px] font-black tracking-[0.5em] uppercase text-emerald-800 group-hover:text-emerald-500 transition-colors">
                            {isMeditating ? "Inhaling..." : "Hold to Seek"}
                          </span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-emerald-100/30 text-[10px] font-medium tracking-[0.3em] uppercase max-w-[220px] text-center leading-loose">
                    Reflect before seeking, <br /> for wisdom requires a still heart.
                  </p>
                </motion.div>
              ) : (
                /* STATE B: THE REVEALED ADVICE */
                <motion.div 
                  key="revealed"
                  initial={{ opacity: 0, filter: "blur(20px)", scale: 0.95 }}
                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                  exit={{ opacity: 0, filter: "blur(20px)" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-center max-w-2xl px-6 flex flex-col items-center relative z-20"
                >
                   <div className="mb-8 opacity-40">
                    <div className="h-px w-12 bg-emerald-500 mx-auto" />
                   </div>
                  
                  <p className="text-4xl md:text-4xl font-serif italic leading-[1.4] text-emerald-50/90 mb-12 drop-shadow-2xl">
                    {advice}
                  </p>
                  
                  <button 
                    onClick={() => setAdvice("")} 
                    className="group flex flex-col items-center gap-2 text-emerald-900 hover:text-emerald-400 transition-all duration-500 cursor-pointer relative z-30"
                  >
                    <span className="text-[9px] font-black tracking-[0.5em] uppercase">Return to Silence</span>
                    <div className="h-px w-0 group-hover:w-8 bg-emerald-500 transition-all duration-500" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <footer className="flex justify-center pb-4 opacity-10">
            <Heart size={12} className="text-emerald-500" />
          </footer>
        </motion.div>
      )}
    </main>
  );
}