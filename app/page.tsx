"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
// ADDED Database TO IMPORTS
import { Fingerprint, Camera, Database, Briefcase, Zap, Target, Flame, Palette, Sparkles, ArrowRight, Github, Twitter, Lock, Cpu, Wand2, ScrollText } from 'lucide-react';
import ActivityTicker from '@/components/ActivityTicker';

// 1. SCRAMBLE COMPONENT
const ScrambleText = ({ text, interval = 30 }: { text: string, interval?: number }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "!@#$%^&*()_+NKJHIU87654321";

  useEffect(() => {
    let iteration = 0;
    const trigger = setInterval(() => {
      setDisplayText(prev => 
        prev.split("").map((letter, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      if (iteration >= text.length) clearInterval(trigger);
      iteration += 1 / 3;
    }, interval);
    return () => clearInterval(trigger);
  }, [text, interval]);

  return <span className="font-mono">{displayText}</span>;
};

// 2. PROJECT DATA (REPLACE THE START OF ARRAY)
const PROJECTS = [
  {
    title: "Resume Roaster",
    desc: "Brutal AI feedback on your CV. Not for the faint of heart.",
    path: "/roast",
    icon: <Flame />,
    vibe: "chaos",
    status: "unlocked",
    date: "LIVE",
    color: "from-orange-500/20 to-red-500/20"
  },
  {
    title: "Palette Genie",
    desc: "Neural-linked harmonies. (Careful, the lamp is hot...)",
    path: "/palette",
    icon: <Palette />,
    vibe: "chaos",
    status: "unlocked",
    date: "LIVE",
    color: "from-purple-500/20 to-yellow-500/20"
  },
  {
    title: "Naseeha AI",
    desc: "Finding peace in the digital age with spiritual wisdom.",
    path: "/naseeha",
    icon: <Sparkles />,
    vibe: "peace",
    status: "unlocked",
    date: "JAN 25",
    color: "from-emerald-500/20 to-teal-500/20"
  },
  {
    title: "Verse Voyager",
    desc: "Ancient wisdom unrolled. Seek Quranic verses for the soul.",
    path: "/voyager",
    icon: <ScrollText />,
    vibe: "peace",
    status: "unlocked",
    date: "LIVE",
    color: "from-yellow-600/20 to-amber-900/20"
  },{
    title: "Basirah Vision",
    desc: "Neural-linked optical analysis. See the world through the AI eye.",
    path: "/basirah",
    icon: <Camera />,
    vibe: "peace",
    status: "unlocked",
    date: "LIVE",
    color: "from-cyan-500/20 to-blue-500/20"
  },
  {
    title: "Aura Strategy",
    desc: "Neural momentum strategist. Tiered daily execution protocols.",
    path: "/aura",
    icon: <Zap />, 
    vibe: "momentum",
    status: "unlocked",
    date: "LIVE",
    color: "from-purple-600/20 to-indigo-900/20"
  },
  {
    title: "ApplyFlow",
    desc: "ATS Optimizer & Interview Intelligence. Get through the filters.",
    path: "/applyflow",
    icon: <Briefcase />,
    vibe: "chaos",
    status: "unlocked",
    date: "JAN 29",
    color: "from-blue-600/20 to-indigo-900/20"
  },
  {
    title: "Hunter's Ledger",
    desc: "Smart Career CRM. AI lead extraction & outreach automation.",
    path: "/ledger",
    icon: <Database />,
    vibe: "chaos",
    status: "unlocked",
    date: "JAN 30",
    color: "from-emerald-600/20 to-zinc-900/20"
  },
  {
    title: "Aura Morphos",
    desc: "Neural identity mirror. Extract the visual frequency of your digital soul.",
    path: "/morphos",
    icon: <Fingerprint />, // Make sure to import Fingerprint from 'lucide-react'
    vibe: "peace",
    status: "unlocked",
    date: "LIVE",
    color: "from-[#bfff00]/20 to-zinc-900/20"
  },
  ...Array.from({ length: 22 }).map((_, i) => {
    const dayNumber = 31 + i;
    const isFeb = dayNumber > 31;
    const displayDate = isFeb ? `${dayNumber - 31} FEB` : `${dayNumber} JAN`;
    
    return {
      title: `Project ${i + 9}`,
      desc: "A classified AI experiment currently in development.",
      path: "#",
      icon: <Cpu />,
      vibe: "neutral",
      status: "locked",
      date: displayDate,
      color: "from-zinc-500/10 to-zinc-800/10"
    };
  })
];

export default function HomeHub() {
  const [vibe, setVibe] = useState<'chaos' | 'peace'>('chaos');
  const [scrambleName, setScrambleName] = useState("Shahid Ali Sethi");
  const [glitch, setGlitch] = useState(false);
  const clickCount = useRef(0);

  const playSound = (url: string, volume = 0.2) => {
    try {
      const audio = new Audio(url);
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const handleVibeChange = (newVibe: 'chaos' | 'peace') => {
    playSound("https://assets.mixkit.co/active_storage/sfx/1113/1113-preview.mp3", 0.3);
    setVibe(newVibe);
  };

  const triggerSecret = () => {
    clickCount.current += 1;
    if (clickCount.current >= 3) {
      playSound("https://assets.mixkit.co/active_storage/sfx/3116/3116-preview.mp3", 0.5);
      setGlitch(true);
      setTimeout(() => {
        setGlitch(false);
        clickCount.current = 0;
      }, 1500);
    }
    setTimeout(() => { if(!glitch) clickCount.current = 0; }, 2000);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setScrambleName("Shahid Ali Sethi"); 
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className={`min-h-screen transition-all duration-1000 ${
      vibe === 'chaos' ? 'bg-[#050505]' : 'bg-[#020617]'
    } ${glitch ? 'animate-pulse contrast-200 hue-rotate-90' : ''} text-white relative overflow-hidden cyber-grid py-20 px-6`}>
      
      {/* 1. THE TOGGLE */}
      <div className="relative z-50 flex bg-zinc-900/80 backdrop-blur-md p-1 rounded-full w-fit mx-auto mb-10 border border-zinc-800 shadow-2xl">
        <button 
          onClick={() => handleVibeChange('chaos')}
          className={`px-8 py-2.5 rounded-full text-xs font-black tracking-widest transition-all duration-300 ${
            vibe === 'chaos' ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          CHAOS
        </button>
        <button 
          onClick={() => handleVibeChange('peace')}
          className={`px-8 py-2.5 rounded-full text-xs font-black tracking-widest transition-all duration-300 ${
            vibe === 'peace' ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          PEACE
        </button>
      </div>

      {/* 2. AMBIENT BACKGROUND */}
      <motion.div 
        animate={{ 
          backgroundColor: vibe === 'chaos' ? "rgba(249, 115, 22, 0.15)" : "rgba(16, 185, 129, 0.15)",
          scale: [1, 1.1, 1],
        }}
        transition={{ backgroundColor: { duration: 1 }, scale: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] blur-[120px] rounded-full"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-20">
          <div className="inline-block px-4 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-500 text-[10px] font-black tracking-[0.4em] mb-6 uppercase">
          SHAHID_LABS // SESSION_01
          </div>

          <motion.h1 
            key={vibe}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-6 italic"
          >
            {vibe === 'chaos' ? (
               <span>BUILD <span className="text-orange-500">&</span> DESTROY.</span>
               ) : (
                 <span>SEEK <span className="text-emerald-500">&</span> REFLECT.</span>
               )}
          </motion.h1>

          <p className="text-zinc-400 max-w-xl mx-auto text-lg mb-12">
            {vibe === 'chaos' 
              ? "Experimental AI graveyard where ideas are born through destruction." 
              : "A digital sanctuary for spiritual tech and calm interfaces."}
          </p>
        </header>

        {/* <ActivityTicker /> */}
        
        {/* 3. THE 30-DAY GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECTS.map((project, index) => {
          const isLocked = project.status === "locked";
          const isGenie = project.title === "Palette Genie";
          const isNaseeha = project.title === "Naseeha AI";
          const isVoyager = project.title === "Verse Voyager"; 
          const isBasirah = project.title === "Basirah Vision"; 
          const isAura = project.title === "Aura Strategy";
          const isApplyFlow = project.title === "ApplyFlow";
          const isLedger = project.title === "Hunter's Ledger"; 
          const isMorphos = project.title === "Aura Morphos";
          const isHidden = (vibe === 'chaos' && project.vibe === 'peace') || (vibe === 'peace' && project.vibe === 'chaos');

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isHidden ? 0.1 : 1,
                scale: isHidden ? 0.95 : 1,
                filter: isHidden ? "grayscale(100%)" : "grayscale(0%)"
              }}
              className={`relative group rounded-3xl border transition-all duration-500 overflow-hidden ${
                isLocked ? 'border-zinc-900 bg-zinc-950/20' : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-600'
              }`}
            >
              {/* LEDGER DATA FLOW AURA (NEW) */}
              {!isLocked && isLedger && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full" />
                  <motion.div 
                    animate={{ y: [0, 40], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-10 left-10 text-[8px] font-mono text-emerald-500/40 rotate-90"
                  >
                    SQL_STREAM_ACTIVE
                  </motion.div>
                </div>
              )}

               {/* AURA MORPHOS LIQUID EFFECT (NEW) */}
              {!isLocked && isMorphos && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                  <motion.div 
                    animate={{
                      scale: [1, 1.5, 1.2, 1.4, 1],
                      rotate: [0, 90, 180, 270, 360],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-20 -right-20 w-64 h-64 bg-[#bfff00]/10 blur-[60px] rounded-[40%_60%_70%_30%]"
                  />
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
                </div>
              )}

              {/* ... Rest of your existing Auras (ApplyFlow, Aura, Basirah, etc.) ... */}
              {!isLocked && isApplyFlow && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                  <motion.div animate={{ translateY: ["-100%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} className="absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent z-10" />
                </div>
              )}

              {isLocked && (
                  <div className="absolute top-6 right-6 flex flex-col items-end gap-1 pointer-events-none">
                    <div className="p-1.5 bg-zinc-900 rounded border border-zinc-800">
                      <Lock size={12} className="text-zinc-600" />
                    </div>
                    <span className="text-[7px] font-bold text-zinc-600 tracking-widest">{project.date}</span>
                  </div>
                )}

              <Link href={isLocked ? "#" : project.path} className={`block p-8 h-full ${isLocked ? 'cursor-not-allowed' : ''}`}>
                <div className="relative z-10">
                  <div className={`mb-4 p-3 rounded-xl w-fit border border-zinc-800 bg-zinc-900 transition-all duration-500 ${
                    !isLocked && (
                      isLedger ? 'group-hover:bg-emerald-500/10 group-hover:border-emerald-500/40 group-hover:text-emerald-400' :
                      isApplyFlow ? 'group-hover:bg-blue-500/10 group-hover:border-blue-500/50 group-hover:text-blue-400' :
                      isMorphos ? 'group-hover:bg-[#bfff00]/10 group-hover:border-[#bfff00]/40 group-hover:text-[#bfff00]' :
                      'group-hover:border-orange-500/50'
                    )
                  }`}>
                    {project.icon}
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-3 flex items-center gap-2 transition-all duration-500 ${
                    !isLocked && (
                      isLedger ? 'group-hover:text-emerald-400' :
                      isMorphos ? 'group-hover:text-[#bfff00] font-serif italic' : 
                      isApplyFlow ? 'group-hover:text-blue-400' : '' 
                    )
                  }`}>
                    {project.title} 
                    {!isLocked && <ArrowRight size={18} className={`opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${
                      isMorphos ? 'text-[#bfff00]' :
                      isLedger ? 'text-emerald-500' : 'text-orange-500' 
                    }`} />}
                  </h3>

                  <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">
                    {project.desc}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
        </div>

        {/* 4. FOOTER */}
        <footer className="mt-32 pt-10 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-zinc-600 text-sm font-mono">
            &copy; {new Date().getFullYear()} — Hand-coded by 
            <span onClick={triggerSecret} className="text-white font-bold cursor-pointer ml-1 hover:text-orange-500 transition-colors">
              <ScrambleText text={scrambleName} />
            </span>
          </div>
          <div className="flex gap-4">
            <a href="https://github.com/Shahid7" className="p-2 text-zinc-500 hover:text-white transition-colors"><Github size={20} /></a>
            <a href="https://x.com/shahid_alisethi" className="p-2 text-zinc-500 hover:text-white transition-colors"><Twitter size={20} /></a>
          </div>
        </footer>
      </div>
    </main>
  );
}