"use client";
import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, RefreshCcw, Cpu, Globe, UserPlus, LogIn, CheckCircle2, Terminal, ShieldAlert, ChevronRight, Activity, Volume2 } from 'lucide-react';

export default function SonicUltraVault() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Matter.Engine.create());
  const audioCtx = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  
  const [status, setStatus] = useState<'IDLE' | 'RECORDING' | 'VERIFYING' | 'GRANTED' | 'DENIED' | 'LOCKED_OUT'>('IDLE');
  const [showSanctum, setShowSanctum] = useState(false);
  const [vaultTension, setVaultTension] = useState<number | null>(null);
  const [currentTension, setCurrentTension] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState("AUDIO_DRIVER_INITIALIZED...");
  const [showRegSuccess, setShowRegSuccess] = useState(false);

  const anchor = { x: 400, y: 220 };

  // --- SYNTH LOGIC ---
  const initAudio = () => {
    if (audioCtx.current) return;
    audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    gainNode.current = audioCtx.current.createGain();
    gainNode.current.connect(audioCtx.current.destination);
    gainNode.current.gain.value = 0;
  };

  const playTone = (freq: number, type: OscillatorType = 'sine', vol = 0.1) => {
    if (!audioCtx.current) initAudio();
    const osc = audioCtx.current!.createOscillator();
    const g = audioCtx.current!.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.current!.currentTime);
    osc.connect(g);
    g.connect(audioCtx.current!.destination);
    g.gain.setValueAtTime(vol, audioCtx.current!.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.current!.currentTime + 0.5);
    osc.start();
    osc.stop(audioCtx.current!.currentTime + 0.5);
  };

  // Start continuous drone when dragging
  const startDrone = () => {
    if (!audioCtx.current) initAudio();
    oscillator.current = audioCtx.current!.createOscillator();
    oscillator.current.type = 'sawtooth';
    oscillator.current.connect(gainNode.current!);
    oscillator.current.start();
  };

  const stopDrone = () => {
    if (oscillator.current) {
      oscillator.current.stop();
      oscillator.current = null;
      gainNode.current!.gain.setTargetAtTime(0, audioCtx.current!.currentTime, 0.05);
    }
  };

  // Update drone pitch based on tension
  useEffect(() => {
    if (oscillator.current && audioCtx.current) {
      const pitch = 100 + (currentTension * 2);
      oscillator.current.frequency.setTargetAtTime(pitch, audioCtx.current.currentTime, 0.05);
      gainNode.current!.gain.setTargetAtTime(0.05, audioCtx.current.currentTime, 0.05);
    }
  }, [currentTension]);

  const generateWavePath = () => {
    const points = [];
    const amplitude = Math.min(currentTension / 4, 50);
    const frequency = currentTension / 50;
    for (let x = 0; x <= 800; x += 10) {
      const y = 220 + Math.sin(x * frequency * 0.05) * amplitude;
      points.push(`${x === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    return points.join(' ');
  };

  useEffect(() => {
    if (!sceneRef.current) return;
    const engine = engineRef.current;
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: { width: 800, height: 440, wireframes: false, background: 'transparent' },
    });

    const handle = Matter.Bodies.circle(anchor.x, anchor.y, 22, {
      restitution: 0.5, frictionAir: 0.08,
      render: { fillStyle: '#bfff00', strokeStyle: '#fff', lineWidth: 4 }
    });

    const elastic = Matter.Constraint.create({
      pointA: anchor, bodyB: handle, stiffness: 0.1, damping: 0.1,
      render: { strokeStyle: '#bfff00', lineWidth: 1 }
    });

    Matter.Composite.add(engine.world, [handle, elastic]);
    const mouse = Matter.Mouse.create(render.canvas);
    const mc = Matter.MouseConstraint.create(engine, {
      mouse, constraint: { stiffness: 0.2, render: { visible: false } }
    });
    Matter.Composite.add(engine.world, mc);

    Matter.Events.on(engine, 'afterUpdate', () => {
      setCurrentTension(Matter.Vector.magnitude(Matter.Vector.sub(handle.position, anchor)));
    });

    Matter.Events.on(mc, 'startdrag', () => startDrone());

    Matter.Events.on(mc, 'enddrag', (e: any) => {
      stopDrone();
      if (e.body === handle) handleReleaseLogic(Matter.Vector.magnitude(Matter.Vector.sub(handle.position, anchor)));
    });

    Matter.Runner.run(Matter.Runner.create(), engine);
    Matter.Render.run(render);
    return () => { Matter.Render.stop(render); Matter.Engine.clear(engine); render.canvas.remove(); };
  }, []);

  const stateRef = useRef({ status, vaultTension, attempts });
  useEffect(() => { stateRef.current = { status, vaultTension, attempts }; }, [status, vaultTension, attempts]);

  const handleReleaseLogic = (dist: number) => {
    const { status: s, vaultTension: target, attempts: att } = stateRef.current;
    const currentHz = Math.round(dist);

    if (s === 'RECORDING') {
      setVaultTension(currentHz);
      setStatus('IDLE');
      setFeedbackMsg(`ENCRYPTED: ${currentHz}Hz`);
      setShowRegSuccess(true);
      playTone(440, 'sine', 0.2); // Success blip
      setTimeout(() => setShowRegSuccess(false), 2000);
    } else if (s === 'VERIFYING' && target !== null) {
      if (Math.abs(currentHz - target) <= 3) {
        setStatus('GRANTED');
        playTone(880, 'sine', 0.3); // High win tone
      } else {
        const nextAtt = att + 1;
        setAttempts(nextAtt);
        playTone(100, 'square', 0.2); // Error buzz
        if (nextAtt >= 3) setStatus('LOCKED_OUT');
        else {
          setStatus('DENIED');
          setFeedbackMsg(`OFFSET: ${Math.abs(currentHz - target)}Hz`);
          setTimeout(() => setStatus('VERIFYING'), 2000);
        }
      }
    }
  };

  return (
    <div className="h-screen w-full bg-[#050505] text-[#bfff00] p-4 font-mono overflow-hidden flex flex-col items-center justify-between" onClick={initAudio}>
      
      {/* 1. CYBER HUD */}
      <div className="w-full max-w-5xl flex justify-between items-end h-[80px] border-b border-[#bfff00]/10 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Volume2 size={18} className="animate-pulse" />
            <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">Glitch <span className="text-[#bfff00] text-xs">v.2.0_SONIC</span></h1>
          </div>
          <div className="flex gap-1.5">
            {[...Array(3)].map((_, i) => (
              <motion.div key={i} animate={{ backgroundColor: attempts > i ? '#ff0033' : '#1a1a1a' }} className="h-1 w-6 rounded-full shadow-[0_0_10px_rgba(255,0,0,0.2)]" />
            ))}
          </div>
        </div>

        <AnimatePresence>
          {showRegSuccess && (
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] font-bold bg-[#bfff00] text-black px-3 py-1 rounded-sm">
              [SONIC_KEY_SAVED]
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-right">
          <p className="text-[9px] text-zinc-500 font-bold uppercase">Acoustic_Load</p>
          <div className="text-3xl font-black italic tabular-nums">{Math.round(currentTension)}Hz</div>
        </div>
      </div>

      {/* 2. THE CHAMBER */}
      <div className="relative w-full max-w-5xl flex-1 bg-black border border-white/5 rounded-[2rem] overflow-hidden my-4 shadow-2xl group">
        <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
        
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
          <path d={generateWavePath()} fill="none" stroke="#bfff00" strokeWidth="1" />
        </svg>

        <div ref={sceneRef} className="absolute inset-0 z-10" />

        <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center text-center">
          <AnimatePresence mode="wait">
            {!audioCtx.current ? (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-[10px] text-zinc-600 animate-pulse">CLICK ANYWHERE TO ENGAGE NEURAL_AUDIO</motion.div>
            ) : feedbackMsg && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-[#bfff00] text-black px-6 py-2 font-black italic text-xs uppercase shadow-[0_0_20px_#bfff0055]">
                {feedbackMsg}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SANCTUM REVEAL */}
        <AnimatePresence>
          {showSanctum && (
            <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-[100] bg-[#050505] p-10 flex flex-col">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-4 text-white">
                  <Terminal className="text-[#bfff00]" />
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter">Inner_Sanctum</h2>
                </div>
                <button onClick={() => window.location.reload()} className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">[Logout]</button>
              </div>
              <div className="grid grid-cols-3 gap-6 flex-1">
                <div className="bg-zinc-900/20 border border-white/5 rounded-3xl p-8"><p className="text-[10px] text-zinc-600 font-bold">Uptime</p><p className="text-3xl font-black italic text-white">99.9%</p></div>
                <div className="bg-zinc-900/20 border border-white/5 rounded-3xl p-8"><p className="text-[10px] text-zinc-600 font-bold">Node</p><p className="text-3xl font-black italic text-white">Active</p></div>
                <div className="bg-zinc-900/20 border border-white/5 rounded-3xl p-6 font-mono text-[10px] text-[#bfff00]/40 overflow-hidden">
                    &gt; sonic_match_confirmed<br/>
                    &gt; freq: {vaultTension}Hz<br/>
                    &gt; auth_token: valid
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SUCCESS PORTAL */}
        <AnimatePresence>
          {status === 'GRANTED' && !showSanctum && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-[90] bg-[#bfff00] flex flex-col items-center justify-center text-black">
              <Unlock size={100} strokeWidth={3} />
              <h2 className="text-8xl font-black italic uppercase tracking-tighter mt-4 leading-none text-center">Access<br/>Unlocked</h2>
              <button onClick={() => setShowSanctum(true)} className="mt-10 px-12 py-5 bg-black text-[#bfff00] font-black uppercase italic rounded-full hover:scale-105 transition-transform flex items-center gap-4">
                Enter Network <ChevronRight />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOCKOUT */}
        {status === 'LOCKED_OUT' && (
          <div className="absolute inset-0 z-[110] bg-red-600 flex flex-col items-center justify-center text-white text-center p-10">
            <ShieldAlert size={100} className="mb-6 animate-bounce" />
            <h2 className="text-7xl font-black italic uppercase leading-tight">Terminal<br/>Lockdown</h2>
            <button onClick={() => window.location.reload()} className="mt-10 px-10 py-4 bg-black rounded-full font-bold uppercase tracking-widest">Reboot</button>
          </div>
        )}
      </div>

      {/* 3. CONTROL HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl h-[100px] mb-4">
        <ControlBtn label="Register" icon={<UserPlus />} active={status === 'RECORDING'} onClick={() => { setStatus('RECORDING'); setFeedbackMsg("MAPPING_SONIC_KEY"); }} />
        <ControlBtn label="Login" icon={<LogIn />} active={status === 'VERIFYING'} disabled={!vaultTension} onClick={() => { setStatus('VERIFYING'); setFeedbackMsg("VERIFYING_RESONANCE"); }} />
        <ControlBtn label="Wipe" icon={<RefreshCcw />} onClick={() => window.location.reload()} />
      </div>
    </div>
  );
}

function ControlBtn({ label, icon, onClick, active, disabled }: any) {
  return (
    <button disabled={disabled} onClick={onClick} className={`flex items-center justify-between px-10 py-5 rounded-2xl border transition-all duration-300 ${
      disabled ? 'opacity-10 grayscale cursor-not-allowed' : 
      active ? 'bg-[#bfff00] border-[#bfff00] text-black shadow-[0_0_30px_rgba(191,255,0,0.3)]' : 
      'bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-[#bfff00] hover:text-[#bfff00]'
    }`}>
      <span className="font-black italic uppercase text-lg tracking-tighter">{label}</span>
      {icon}
    </button>
  );
}