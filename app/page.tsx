"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
// ADDED Database TO IMPORTS
import { HeartPulse, Activity, Terminal, ShieldCheck, Binary, Fingerprint, Camera, Database, Briefcase, Zap, Target, Flame, Palette, Sparkles, ArrowRight, Github, Twitter, Lock, Cpu, Wand2, ScrollText, Radio, Scan } from 'lucide-react';
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

// 2. PROJECT DATA
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
    icon: <Fingerprint />, 
    vibe: "peace",
    status: "unlocked",
    date: "LIVE",
    color: "from-[#bfff00]/20 to-zinc-900/20"
  },
  {
    title: "Vision Alchemist",
    desc: "Upload a UI screenshot. AI transmutates pixels into production Tailwind code.",
    path: "/vision",
    icon: <Binary />,
    vibe: "chaos",
    status: "unlocked",
    date: "DAY 10",
    color: "from-lime-400/20 to-cyan-500/20"
  },
  {
    title: "Focus-Aura",
    desc: "Neural-acoustic bio-hacking. Synchronize brainwaves through Brownian frequency loops.",
    path: "/focus-aura", 
    icon: <Radio />, 
    vibe: "peace",
    status: "unlocked",
    date: "DAY 11",
    color: "from-[#bfff00]/20 to-emerald-900/20"
  },
  {
    title: "Aura Gate",
    desc: "Neural firewall & system integrity audit. Track breaches and maintain peak cognitive momentum.",
    path: "/aura-gate", 
    icon: <ShieldCheck />,
    vibe: "momentum",
    status: "unlocked",
    date: "DAY 12",
    color: "from-[#bfff00]/20 to-zinc-900/20"
  },
  {
    title: "Lethal Eff",
    desc: "Command-line habit OS. Execute protocols, monitor logs, and maintain system discipline via CLI.",
    path: "/lethal-eff", 
    icon: <Terminal />,
    vibe: "momentum",
    status: "unlocked",
    date: "DAY 13",
    color: "from-[#bfff00]/20 to-zinc-900/20"
  },
  {
    title: "Pulse",
    desc: "Biometric momentum tracker. Sync your internal rhythm with project velocity.",
    path: "/pulse",
    icon: <HeartPulse />,
    vibe: "peace",
    status: "unlocked",
    date: "DAY 14",
    color: "from-[#bfff00]/20 to-rose-900/20"
  },
  {
    title: "Stress Smasher",
    desc: "Kinetic destruction lab. Smash geometry, slow down time, and erase your stress through physics-based chaos.",
    path: "/stress-smasher",
    icon: <Activity />, 
    vibe: "chaos",
    status: "unlocked",
    date: "DAY 15",
    color: "from-[#bfff00]/20 to-red-500/10"
  },
  {
    title: "Glitch Auth",
    desc: "Pattern encryption. A behavioral vault where your unique physics-signature is the only key.",
    path: "/glitch",
    icon: <Lock />, 
    vibe: "chaos",
    status: "unlocked",
    date: "DAY 16",
    color: "from-red-600/20 to-zinc-900/20"
  },
  {
    title: "Onyx Lens",
    desc: "Hardware-accelerated optical focus engine. Blueprint-sync reading for deep cognitive immersion.",
    path: "/onyx-lens",
    icon: <Scan />,
    vibe: "momentum",
    status: "unlocked",
    date: "DAY 17",
    color: "from-cyan-400/20 to-blue-900/20"
  },
  ...Array.from({ length: 13 }).map((_, i) => {
    const dayNumber = 14 + i;
    const displayDate = `${dayNumber + 3} FEB`;
    
    return {
      title: `Project ${i + 18}`,
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
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
          const isV10 = project.title === "Vision Alchemist";
          const isFocusAura = project.title === "Focus-Aura"; 
          const isAuraGate = project.title === "Aura Gate";
          const isLethalEff = project.title === "Lethal Eff";
          const isPulse = project.title === "Pulse";
          const isStressSmasher = project.title === "Stress Smasher";
          const isGlitchAuth = project.title === "Glitch Auth";
          const isOnyxLens = project.title === "Onyx Lens";
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
              {/* ONYX LENS FOCUS EFFECT (DAY 17) */}
              {!isLocked && isOnyxLens && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                  <div className="absolute inset-0 bg-cyan-500/5 backdrop-blur-[2px]" />
                  <motion.div 
                    animate={{ 
                      background: [
                        'radial-gradient(circle at 50% 50%, transparent 0%, rgba(2,6,23,0.8) 100%)',
                        'radial-gradient(circle at 60% 40%, transparent 0%, rgba(2,6,23,0.8) 100%)',
                        'radial-gradient(circle at 40% 60%, transparent 0%, rgba(2,6,23,0.8) 100%)',
                        'radial-gradient(circle at 50% 50%, transparent 0%, rgba(2,6,23,0.8) 100%)'
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 z-10"
                  />
                  <div className="absolute top-4 right-8 font-mono text-[7px] text-cyan-400 tracking-[0.4em] uppercase">Optic_Sync_Active</div>
                </div>
              )}

              {/* FOCUS-AURA FREQUENCY RIPPLE */}
              {!isLocked && isFocusAura && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  {[...Array(3)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                      className="absolute inset-0 border border-[#bfff00]/20 rounded-full"
                      style={{ transformOrigin: 'center' }}
                    />
                  ))}
                  <div className="absolute bottom-4 left-8 font-mono text-[7px] text-[#bfff00]/30 tracking-widest">HZ_SYNC_ENABLED</div>
                </div>
              )}

              {/* AURA-GATE SYSTEM INTEGRITY EFFECT (DAY 12) */}
              {!isLocked && isAuraGate && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                  <motion.div 
                    animate={{ y: ["0%", "400%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-0 h-[1px] bg-[#bfff00] shadow-[0_0_15px_#bfff00] z-20"
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(5,5,5,0.8)_100%)] z-10" />
                  <div className="absolute bottom-4 right-6 flex flex-col items-end gap-1">
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <motion.div 
                          key={i}
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                          className="w-1 h-3 bg-[#bfff00]"
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[7px] text-[#bfff00] tracking-tighter uppercase">Integrity_Secure</span>
                  </div>
                </div>
              )}

              {/* AURA TERMINAL CLI EFFECT (DAY 13) */}
              {!isLocked && project.title === "Lethal Eff" && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden bg-black/40">
                  <div className="absolute top-4 left-6 font-mono text-[6px] text-[#bfff00]/40 flex flex-col gap-1">
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>❯ executing_protocol_v1.3...</motion.span>
                    <span className="text-[#bfff00]/20">❯ aura_score: 9.8</span>
                    <span className="text-[#bfff00]/20">❯ shield_status: active</span>
                    <span className="text-[#bfff00]/20">❯ bypass_detected: false</span>
                    <motion.span 
                      animate={{ opacity: [1, 0] }} 
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="w-1.5 h-3 bg-[#bfff00] inline-block"
                    />
                  </div>
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />
                </div>
              )}

              {/* AURA-PULSE HEARTBEAT EFFECT (DAY 14) */}
              {!isLocked && isPulse && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <motion.div 
                    animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-rose-500/20 blur-3xl"
                  />
                </div>
              )}

              {/* STRESS SMASHER KINETIC SHATTER (DAY 15) */}
              {!isLocked && isStressSmasher && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
                  {[...Array(2)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.4 }}
                      className="absolute inset-0 border-2 border-[#bfff00]/30 rounded-full"
                    />
                  ))}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={`shard-${i}`}
                      initial={{ x: 0, y: 0, opacity: 0 }}
                      animate={{ 
                        x: (i % 2 === 0 ? 1 : -1) * (Math.random() * 100 + 50), 
                        y: (Math.random() - 0.5) * 200,
                        rotate: 360,
                        opacity: [0, 1, 0]
                      }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                      className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#bfff00] rounded-sm"
                    />
                  ))}
                  <div className="absolute bottom-4 left-8 font-mono text-[7px] text-red-500 tracking-[0.3em] uppercase animate-pulse">Impact_Detected</div>
                </div>
              )}

              {/* GLITCH AUTH EFFECT (DAY 16) */}
              {!isLocked && isGlitchAuth && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,0,0,0.05)_3px)]" />
                  <motion.div 
                    animate={{ x: [-2, 2, -1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.2 }}
                    className="absolute top-4 right-6 font-mono text-[8px] text-red-500 font-black uppercase"
                  >
                    UNAUTHORIZED_ACCESS_DETECTED
                  </motion.div>
                </div>
              )}

              {/* LEDGER DATA FLOW AURA */}
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

               {/* AURA MORPHOS LIQUID EFFECT*/}
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

              {/* DAY 10 NEURAL RAIN EFFECT */}
              {!isLocked && isV10 && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                  <motion.div 
                    animate={{ y: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-lime-400/20 to-transparent"
                  />
                  <div className="absolute top-4 right-8 font-mono text-[8px] text-lime-400/40">ALCH_V2.0</div>
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
                      isV10 ? 'group-hover:border-lime-400 group-hover:text-lime-400' :
                      isFocusAura ? 'group-hover:bg-[#bfff00]/10 group-hover:border-[#bfff00]/50 group-hover:text-[#bfff00]' :
                      isAuraGate ? 'group-hover:bg-[#bfff00]/10 group-hover:border-[#bfff00]/50 group-hover:text-[#bfff00]' : 
                      isPulse ? 'group-hover:bg-rose-500/10 group-hover:border-rose-500/50 group-hover:text-rose-400' :
                      isOnyxLens ? 'group-hover:bg-cyan-500/10 group-hover:border-cyan-500/50 group-hover:text-cyan-400' :
                      'group-hover:border-orange-500/50'
                    )
                  }`}>
                    {project.icon}
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-3 flex items-center gap-2 transition-all duration-500 ${
                    !isLocked && (
                      isLedger ? 'group-hover:text-emerald-400' :
                      isMorphos ? 'group-hover:text-[#bfff00] font-serif italic' : 
                      isV10 ? 'group-hover:text-lime-400' :
                      isFocusAura ? 'group-hover:text-[#bfff00]' :
                      isOnyxLens ? 'group-hover:text-cyan-400 font-black tracking-tight' :
                      isAuraGate ? 'group-hover:text-[#bfff00] font-black italic' : 
                      isLethalEff ? 'group-hover:text-[#bfff00] font-mono uppercase tracking-tighter' : 
                      isStressSmasher ? 'group-hover:bg-[#bfff00]/10 group-hover:border-[#bfff00]/50 group-hover:text-[#bfff00] group-hover:rotate-12' :
                      isApplyFlow ? 'group-hover:text-blue-400' : '' 
                    )
                  }`}>
                    {project.title} 
                    {!isLocked && <ArrowRight size={18} className={`opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${
                      isOnyxLens ? 'text-cyan-400' :
                      isMorphos || isFocusAura ? 'text-[#bfff00]' :
                      isAuraGate ? 'text-[#bfff00]' :
                      isPulse ? 'text-rose-500' :
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