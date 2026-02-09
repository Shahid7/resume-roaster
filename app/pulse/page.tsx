"use client";
import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import * as Ably from 'ably';
import { QRCodeSVG } from 'qrcode.react';
import { Zap, Fingerprint, Bird, CloudRain, RotateCcw, Monitor, Waves, Flame, Sliders, Moon, Sun, X, CheckCircle2 } from 'lucide-react';

const ABLY_KEY = process.env.NEXT_PUBLIC_ABLY_API_KEY || "";

const HAPTIC_PROFILES = {
  soft: [15],
  clicky: [35],
  heavy: [70],
  heartbeat: [30, 40, 30],
};

function MisbahaContent() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'selection' | 'display' | 'remote'>('selection');
  const [count, setCount] = useState(0);
  const [lifetime, setLifetime] = useState(0);
  const [bpm, setBpm] = useState(0);
  const [accentColor, setAccentColor] = useState("#bfff00");
  const [channel, setChannel] = useState<any>(null);
  const [syncCode, setSyncCode] = useState("");
  const [ambient, setAmbient] = useState<'none' | 'rain' | 'birds'>('none');

  // NEW FEATURES STATE
  const [hapticProfile, setHapticProfile] = useState<keyof typeof HAPTIC_PROFILES>('soft');
  const [showHaptics, setShowHaptics] = useState(false);
  const [isStealthMode, setIsStealthMode] = useState(false);
  
  const lastTapTime = useRef<number>(0);
  const tapIntervals = useRef<number[]>([]);

  const calculateBPM = () => {
    const now = Date.now();
    if (lastTapTime.current !== 0) {
      const interval = now - lastTapTime.current;
      tapIntervals.current = [...tapIntervals.current.slice(-5), interval];
      const avgInterval = tapIntervals.current.reduce((a, b) => a + b, 0) / tapIntervals.current.length;
      const currentBpm = Math.round(60000 / avgInterval);
      setBpm(currentBpm);

      if (currentBpm < 40) setAccentColor("#6366f1");
      else if (currentBpm < 80) setAccentColor("#10b981");
      else setAccentColor("#f59e0b");
    }
    lastTapTime.current = now;
  };

  useEffect(() => {
    const saved = localStorage.getItem('aura_total');
    if (saved) { setCount(parseInt(saved)); setLifetime(parseInt(saved)); }
    const urlMode = searchParams.get('mode');
    const urlCode = searchParams.get('code');
    if (urlMode === 'remote' && urlCode) joinSession(urlCode, true);
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem('aura_total', count.toString());
    setLifetime(count);

    // Milestone Buzz Logic (33, 66, 99)
    if (count > 0 && (count % 33 === 0 || count % 100 === 0)) {
      if ("vibrate" in navigator) navigator.vibrate([100, 50, 100, 50, 200]);
    }
  }, [count]);

  const joinSession = (code: string, isRemote: boolean) => {
    if (!ABLY_KEY) return;
    const ably = new Ably.Realtime({ key: ABLY_KEY });
    const myChannel = ably.channels.get(`misbaha-${code}`);
    setChannel(myChannel);
    setSyncCode(code);
    if (!isRemote) {
      myChannel.subscribe('TAP', () => {
        setCount(prev => prev + 1);
        calculateBPM();
      });
    }
    setMode(isRemote ? 'remote' : 'display');
  };

  const handleRemoteTap = () => {
    if (channel) channel.publish('TAP', { t: Date.now() });
    if ("vibrate" in navigator) navigator.vibrate(HAPTIC_PROFILES[hapticProfile]);
  };

  return (
    <div className={`min-h-screen font-mono flex flex-col items-center justify-center p-6 overflow-hidden transition-all duration-1000 ${isStealthMode ? 'bg-black' : 'bg-[#020202]'}`} style={{ boxShadow: isStealthMode ? 'none' : `inset 0 0 150px ${accentColor}20` }}>
      
      {/* 1. SELECTION SCREEN */}
      {mode === 'selection' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-12 max-w-sm w-full">
          <Zap style={{ color: accentColor }} className="mx-auto animate-pulse" size={60} />
          <div className="space-y-4">
            <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none text-white">Misbaha</h1>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Lifetime Pulse: {lifetime}</p>
          </div>
          <button onClick={() => joinSession(Math.random().toString(36).substring(7).toUpperCase(), false)}
            className="w-full py-6 font-black uppercase text-xs tracking-[0.3em] rounded-full border border-white/10 hover:border-white transition-all"
            style={{ backgroundColor: accentColor, color: '#000' }}>
            Enter Flow State
          </button>
        </motion.div>
      )}

      {/* 2. DISPLAY MODE */}
      {mode === 'display' && (
        <div className="text-center w-full h-screen flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 opacity-20 blur-[120px] transition-colors duration-1000" style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }} />
          <div className="z-10 relative">
            <motion.h1 key={count} initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="text-[18rem] md:text-[22rem] font-black italic leading-none tracking-tighter"
              style={{ color: accentColor, textShadow: `0 0 60px ${accentColor}40` }}>
              {count}
            </motion.h1>
            <div className="flex flex-col items-center gap-4 mt-8">
               <div className="flex items-center gap-3 px-6 py-2 bg-white/5 rounded-full border border-white/5 backdrop-blur-md">
                  <Waves size={14} style={{ color: accentColor }} />
                  <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Resonance: {bpm} BPM</span>
                  <Flame size={14} style={{ color: accentColor }} className={bpm > 70 ? "animate-bounce" : "opacity-20"} />
               </div>
            </div>
          </div>
          <div className="absolute bottom-10 right-10 bg-white p-2 rounded-xl"><QRCodeSVG value={`${window.location.protocol}//${window.location.host}${window.location.pathname}?mode=remote&code=${syncCode}`} size={80} /></div>
        </div>
      )}

      {/* 3. REMOTE MODE (Enhanced) */}
      {mode === 'remote' && (
        <div className="h-full w-full flex flex-col items-center justify-between py-10 max-w-md">
          {/* Controls Header */}
          <div className="w-full flex justify-between px-4 items-center">
            <button onClick={() => setIsStealthMode(!isStealthMode)} className="p-4 bg-zinc-900 rounded-2xl text-zinc-400 active:bg-zinc-800">
              {isStealthMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <div className="text-[10px] font-black tracking-widest text-zinc-700 uppercase">{isStealthMode ? 'STEALTH' : 'ACTIVE'}</div>
            <button onClick={() => setShowHaptics(true)} className="p-4 bg-zinc-900 rounded-2xl text-zinc-400">
              <Sliders size={22} />
            </button>
          </div>

          <motion.button 
            whileTap={{ scale: 0.85 }} 
            onClick={handleRemoteTap}
            className={`w-80 h-80 rounded-full border-4 flex items-center justify-center transition-all ${isStealthMode ? 'bg-black border-zinc-900' : 'bg-zinc-900 border-white/5'}`}
            style={{ color: isStealthMode ? '#111' : accentColor, boxShadow: isStealthMode ? 'none' : `0 0 80px ${accentColor}10` }}
          >
            <Fingerprint size={120} strokeWidth={0.5} />
          </motion.button>

          {/* Haptic Drawer */}
          <AnimatePresence>
            {showHaptics && (
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-x-0 bottom-0 bg-zinc-900 rounded-t-[3rem] p-10 z-[100] border-t border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Haptic Engine</h3>
                  <button onClick={() => setShowHaptics(false)} className="p-2 text-zinc-400"><X size={20} /></button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(HAPTIC_PROFILES).map((p) => (
                    <button key={p} 
                      onClick={() => { setHapticProfile(p as any); navigator.vibrate(HAPTIC_PROFILES[p as keyof typeof HAPTIC_PROFILES]); }}
                      className={`py-5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${hapticProfile === p ? 'border-[#bfff00] bg-[#bfff00] text-black' : 'border-white/5 text-zinc-500'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default function AuraFinalPage() {
  return <Suspense fallback={<div className="min-h-screen bg-black" />}><MisbahaContent /></Suspense>;
}