"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, Palette, Sparkles, ArrowRight, Github, Twitter, Lock, Cpu } from 'lucide-react';

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

// 2. PROJECT DATA (30 DAYS)
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
    desc: "Deep-learning color harmonies for designers and hackers.",
    path: "/palette",
    icon: <Palette />,
    vibe: "neutral",
    status: "locked",
    date: "JAN 24",
    color: "from-cyan-500/20 to-blue-500/20"
  },
  {
    title: "Naseeha AI",
    desc: "Finding peace in the digital age with spiritual wisdom.",
    path: "/naseeha",
    icon: <Sparkles />,
    vibe: "peace",
    status: "locked",
    date: "JAN 25",
    color: "from-emerald-500/20 to-teal-500/20"
  },
  ...Array.from({ length: 27 }).map((_, i) => {
    const dayNumber = 26 + i; // Start from Jan 24
    const isFeb = dayNumber > 31;
    const displayDate = isFeb ? `${dayNumber - 31} FEB` : `${dayNumber} JAN`;
    
    return {
      title: `Project ${i + 4}`,
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
  
  // SECRET GLITCH LOGIC
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
      }, 1500); // Glitch duration
    }
    // Reset counter if user stops clicking for 2 seconds
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
              ? "Enter the lab where resumes go to die and AI reigns supreme." 
              : "A sanctuary for spiritual growth and creative harmony."}
          </p>
        </header>

        {/* 3. THE 30-DAY GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, index) => {
            const isLocked = project.status === "locked";
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
                    <div className={`mb-4 p-3 rounded-xl w-fit border border-zinc-800 bg-zinc-900 transition-colors ${!isLocked && 'group-hover:border-orange-500/50'}`}>
                      {project.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                      {project.title} 
                      {!isLocked && <ArrowRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-orange-500" />}
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

        {/* 4. FOOTER WITH SCRAMBLE NAME + SECRET TRIGGER */}
        <footer className="mt-32 pt-10 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-zinc-600 text-sm font-mono">
            &copy; {new Date().getFullYear()} — Hand-coded by 
            <span 
              onClick={triggerSecret} 
              className="text-white font-bold cursor-pointer ml-1 hover:text-orange-500 transition-colors"
            >
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