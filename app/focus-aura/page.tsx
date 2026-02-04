"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Zap, Timer, Lock, Unlock, Download, Cpu, Sparkles, Activity, ExternalLink } from 'lucide-react';

const MODES = [
  { name: 'Deep', filter: 150, color: '#818cf8', iris: 'M 50 20 Q 80 50 50 80 Q 20 50 50 20', desc: 'Architecture & Systems' },
  { name: 'Flow', filter: 400, color: '#38bdf8', iris: 'M 50 10 A 40 40 0 1 1 49.9 10', desc: 'Creative Execution' },
  { name: 'Terminal', filter: 1200, color: '#bfff00', iris: 'M 20 20 L 80 20 L 80 80 L 20 80 Z', desc: 'Logic & Debugging' },
];

export default function NeuralLab() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMode, setActiveMode] = useState(MODES[1]);
  const [seconds, setSeconds] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showDebrief, setShowDebrief] = useState(false);
  
  const audioCtx = useRef<AudioContext | null>(null);
  const sourceNode = useRef<AudioBufferSourceNode | null>(null);
  const filterNode = useRef<BiquadFilterNode | null>(null);

  // --- PiP REFS ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // --- STREAK LOGIC (CALENDAR VALIDATED) ---
  useEffect(() => {
    const savedStreak = localStorage.getItem('freq-streak-val') || "0";
    const lastDate = localStorage.getItem('freq-streak-date');
    const today = new Date().toDateString();

    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastDate !== yesterday.toDateString() && lastDate !== null) {
        localStorage.setItem('freq-streak-val', '0');
        setStreak(0);
      } else {
        setStreak(parseInt(savedStreak));
      }
    } else {
      setStreak(parseInt(savedStreak));
    }
  }, []);

  // --- PiP WIDGET RENDERER ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderWidget = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw Timer
      ctx.fillStyle = activeMode.color;
      ctx.font = 'bold 75px monospace';
      ctx.textAlign = 'center';
      const timeStr = `${Math.floor(seconds/60).toString().padStart(2, '0')}:${(seconds%60).toString().padStart(2, '0')}`;
      ctx.fillText(timeStr, canvas.width / 2, canvas.height / 2 + 25);
      
      // Draw Mode Tag
      ctx.font = '12px Arial';
      ctx.fillStyle = '#444';
      ctx.fillText(`IRIS_SYNC // ${activeMode.name.toUpperCase()}`, canvas.width / 2, 40);
      
      requestAnimationFrame(renderWidget);
    };
    renderWidget();
  }, [seconds, activeMode]);

  const togglePiP = async () => {
    try {
      if (!videoRef.current) {
        const video = document.createElement('video');
        video.muted = true;
        video.srcObject = canvasRef.current!.captureStream(10);
        videoRef.current = video;
      }
      await videoRef.current.play();
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.error("PiP Widget Error:", err);
    }
  };

  const handleStreakUpdate = () => {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('freq-streak-date');
    if (lastDate !== today) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('freq-streak-val', newStreak.toString());
      localStorage.setItem('freq-streak-date', today);
    }
  };

  const downloadReport = () => {
    const content = `NEURAL SESSION LOG\nDate: ${new Date().toLocaleDateString()}\nMode: ${activeMode.name}\nDuration: ${Math.floor(seconds/60)}m\nStreak: Day ${streak}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `Neural_Report_Day_${streak}.txt`;
    a.click();
  };

  const toggleFrequency = () => {
    if (isPlaying) {
      sourceNode.current?.stop();
      setIsPlaying(false);
      setShowDebrief(true);
      handleStreakUpdate();
    } else {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const buffer = audioCtx.current.createBuffer(1, audioCtx.current.sampleRate * 2, audioCtx.current.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const source = audioCtx.current.createBufferSource();
      source.buffer = buffer; source.loop = true;
      const filter = audioCtx.current.createBiquadFilter();
      filter.type = 'lowpass'; filter.frequency.value = activeMode.filter;
      const gain = audioCtx.current.createGain(); gain.gain.value = 0.1;
      source.connect(filter); filter.connect(gain); gain.connect(audioCtx.current.destination);
      source.start();
      sourceNode.current = source; filterNode.current = filter;
      setIsPlaying(true);
      if (audioCtx.current.state === 'suspended') audioCtx.current.resume();
    }
  };

  useEffect(() => {
    let int: any;
    if (isPlaying) int = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(int);
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 font-sans overflow-hidden">
      
      {/* Hidden Canvas for PiP Generation */}
      <canvas ref={canvasRef} width="300" height="200" className="hidden" />

      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 50%, ${activeMode.color}22 0%, transparent 70%)` }}
          />
        )}
      </AnimatePresence>

      <div className="w-full max-w-6xl grid lg:grid-cols-[1fr_400px] gap-12 relative z-10">
        
        <div className="relative flex flex-col items-center justify-center bg-zinc-900/10 border border-white/5 rounded-[4rem] p-12 min-h-[700px] backdrop-blur-3xl shadow-2xl">
          
          {/* Top Bar with Widget Toggle */}
          <div className="absolute top-12 left-12 right-12 flex justify-between items-center">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#bfff00] animate-ping" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">Core_Resonance_Sync</span>
             </div>
             <button onClick={togglePiP} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white">Float_Widget</span>
                <ExternalLink size={12} className="text-zinc-600 group-hover:text-white" />
             </button>
          </div>

          <div className="relative w-96 h-96 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full absolute">
              <motion.path 
                d={activeMode.iris} fill="none" stroke={activeMode.color} strokeWidth="0.2" opacity="0.3"
                animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              <motion.path 
                d={activeMode.iris} fill="none" stroke={activeMode.color} strokeWidth="1"
                animate={{ scale: isPlaying ? [1, 1.2, 1] : 1, opacity: isPlaying ? [0.2, 0.8, 0.2] : 0.3 }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </svg>
            
            <div className="text-center">
                <p className="text-6xl font-mono font-black tracking-tighter mb-2">
                    {Math.floor(seconds/60).toString().padStart(2, '0')}:{(seconds%60).toString().padStart(2, '0')}
                </p>
                <div className="flex justify-center gap-1 h-4">
                  {[...Array(isPlaying ? 8 : 0)].map((_, i) => (
                    <motion.div key={i} animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.5, delay: i*0.1 }} className="w-1 rounded-full bg-white/20" />
                  ))}
                </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-6xl font-black italic uppercase tracking-tighter" style={{ color: activeMode.color }}>{activeMode.name}</h2>
            <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[9px] mt-2 mb-10 italic">Sub-Neural_Frequencies_Active</p>
            
            <button 
                onClick={toggleFrequency}
                className="group relative px-24 py-8 rounded-[3rem] font-black uppercase tracking-widest text-[11px] transition-all active:scale-95 overflow-hidden"
                style={{ backgroundColor: isPlaying ? '#ffffff' : activeMode.color, color: '#000000' }}
            >
                <span className="relative z-10 flex items-center gap-3">
                  {isPlaying ? <><Activity size={16} /> Breaking_Sync</> : <><Sparkles size={16} /> Initialize_Link</>}
                </span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-8 relative overflow-hidden">
             <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Resonance_Streak</p>
                <div className="text-[10px] font-mono text-zinc-700">LVL_0{Math.floor(streak/7) + 1}</div>
             </div>
             <div className="flex gap-2 mb-4">
               {[...Array(7)].map((_, i) => (
                 <motion.div 
                    key={i} 
                    animate={{ 
                      backgroundColor: i < (streak % 8) ? activeMode.color : "#18181b",
                      boxShadow: i < (streak % 8) ? `0 0 15px ${activeMode.color}` : "none"
                    }}
                    className="h-1.5 flex-1 rounded-full transition-all duration-1000" 
                  />
               ))}
             </div>
             <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Day_{streak} <span className="text-zinc-700">/ 07_Sequence</span></p>
          </div>

          <div className="grid gap-3">
            {MODES.map((m) => (
              <button 
                key={m.name} 
                onClick={() => { setActiveMode(m); if(filterNode.current) filterNode.current.frequency.value = m.filter; }}
                className={`group p-8 rounded-[2.5rem] border text-left transition-all relative overflow-hidden ${activeMode.name === m.name ? 'border-white bg-white/5' : 'border-white/5 text-zinc-600'}`}
              >
                <div className="flex justify-between items-start">
                   <div>
                     <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: activeMode.name === m.name ? m.color : 'inherit' }}>{m.name}_Frequency</span>
                     <p className="text-sm font-bold mt-1 italic">{m.desc}</p>
                   </div>
                   <Cpu size={16} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDebrief && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6">
            <div className="bg-zinc-900 border border-white/10 w-full max-w-md rounded-[4rem] p-12 text-center shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-[#bfff00]/10 border border-[#bfff00]/20 flex items-center justify-center mx-auto mb-6 text-[#bfff00]">
                 <CheckCircle2 size={30} />
              </div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Session_Log</h2>
              <div className="bg-black/40 rounded-3xl p-6 mb-8 text-left border border-white/5">
                 <p className="text-zinc-500 text-[10px] font-black uppercase mb-4 tracking-widest">Neural_Data_Captured</p>
                 <div className="space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between"><span>Duration:</span><span>{Math.floor(seconds/60)}m</span></div>
                    <div className="flex justify-between"><span>Mode:</span><span>{activeMode.name}</span></div>
                    <div className="flex justify-between"><span>Resonance:</span><span className="text-[#bfff00]">STABLE</span></div>
                 </div>
              </div>
              <button onClick={downloadReport} className="w-full bg-white text-black py-6 rounded-3xl font-black uppercase tracking-widest text-[10px] mb-4 flex items-center justify-center gap-2 hover:bg-[#bfff00] transition-colors">
                <Download size={16} /> Get_Neural_Report
              </button>
              <button onClick={() => { setShowDebrief(false); setSeconds(0); }} className="text-zinc-600 font-black uppercase tracking-widest text-[9px] hover:text-white">Exit_Terminal</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const CheckCircle2 = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
);