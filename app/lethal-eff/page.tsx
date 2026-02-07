"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ArrowRight, Shield, AlertTriangle, Timer, Activity } from 'lucide-react';

// --- BACKGROUND COMPONENT ---
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const letters = "01010101SYSTEMAURA_BREACH_DETECTION";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#bfff00";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-[0.12] z-0" />;
};

// --- MAIN TERMINAL PAGE ---
export default function AuraTerminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(["AURA_SYSTEM_v1.13_INITIALIZED...", "NEURAL_LINK_STABLE. Type /help for protocols."]);
  const [focusTime, setFocusTime] = useState<number | null>(null);
  const [isLinkStable, setIsLinkStable] = useState(true);
  const hasPlayedSound = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. STARTUP SOUND LOGIC
  const playStartupSound = () => {
    if (hasPlayedSound.current) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(60, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
      hasPlayedSound.current = true;
    } catch (e) { console.error("Audio blocked"); }
  };

  // 2. EXTENSION HEARTBEAT (Detect Disabling)
  useEffect(() => {
    // const EXTENSION_ID = "ombhpldfkdlnbhlgoflejijbhoiiomff"; // Get this from chrome://extensions
  
    const checkLink = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).chrome?.runtime) {
        // Try to send a "Ping" to the extension
        (window as any).chrome.runtime.sendMessage(EXTENSION_ID, { action: "ping" }, (response: any) => {
          if ((window as any).chrome.runtime.lastError) {
            setIsLinkStable(false); // No response = Link Severed
          } else if (response) {
            setIsLinkStable(true); // Response = Link Stable
          }
        });
      } else {
        setIsLinkStable(false);
      }
    }, 5000);
  
    return () => clearInterval(checkLink);
  }, [isLinkStable]);

  // 3. FOCUS TIMER & SCORE SYNC
  useEffect(() => {
    if (focusTime === null) return;
    if (focusTime <= 0) {
      const saved = localStorage.getItem('aura_history');
      const historyData = saved ? JSON.parse(saved) : {};
      const today = new Date().toISOString().split('T')[0];
      
      historyData[today] = Math.min((historyData[today] || 5) + 0.2, 10);
      localStorage.setItem('aura_history', JSON.stringify(historyData));
      
      setHistory(prev => [...prev, "PROTOCOL_COMPLETE: Aura score increased by +0.2. Data Synced."]);
      setFocusTime(null);
      return;
    }
    const timer = setInterval(() => setFocusTime(prev => (prev ? prev - 1 : null)), 1000);
    return () => clearInterval(timer);
  }, [focusTime]);

  // 4. AUTO-SCROLL
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.toLowerCase().trim();
    let response = "";

    const data = JSON.parse(localStorage.getItem('aura_history') || "{}");
    const today = new Date().toISOString().split('T')[0];
    const score = data[today] || 5.0;

    if (cmd === "/help") {
      response = "CMDS: /focus [min], /logs, /status, /clear, /lock [site]";
    } else if (cmd === "/status") {
      response = `REPORT: Aura_${score.toFixed(1)}/10 | Link_${isLinkStable ? 'ACTIVE' : 'OFFLINE'}`;
    } else if (cmd === "/logs") {
      const breaches = JSON.parse(localStorage.getItem('aura_breaches') || "[]");
      response = breaches.length > 0 ? `LOGS: ${breaches.slice(-3).join(" | ")}` : "SYSTEM_CLEAN: No breaches.";
    } else if (cmd.startsWith("/focus")) {
      const mins = parseInt(cmd.split(" ")[1]) || 25;
      setFocusTime(mins * 60);
      response = `NEURAL_LOCK_START: Timer set to ${mins}m. Access Restricted.`;
    } else if (cmd.startsWith("/lock")) {
      const site = cmd.split(" ")[1];
      if (!site) response = "ERR: Usage /lock [site.com]";
      else {
        window.postMessage({ type: "AURA_LOCK_CMD", site }, "*");
        response = `SIGNAL_SENT: Firewall locking ${site}`;
      }
    } else if (cmd === "/clear") {
      setHistory([]); setInput(''); return;
    } else {
      response = `ERR: Unknown command '${cmd}'`;
    }

    setHistory(prev => [...prev, `> ${input}`, response]);
    setInput('');
  };

  return (
    <main 
      onClick={playStartupSound} 
      onKeyDown={playStartupSound}
      className="min-h-screen bg-black text-[#bfff00] font-mono p-4 flex flex-col items-center justify-center relative overflow-hidden"
    >
      <MatrixRain />
      <div className="absolute inset-0 z-1 pointer-events-none bg-[rgba(18,16,16,0.02)] opacity-50 animate-pulse" />

      {/* FOCUS TIMER BAR */}
      <AnimatePresence>
        {focusTime !== null && focusTime > 0 && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
            className="w-full max-w-3xl mb-4 bg-red-500/10 border border-red-500/50 p-3 rounded-lg flex items-center justify-between z-20"
          >
            <div className="flex items-center gap-2 text-red-500 text-[10px] font-black italic">
              <AlertTriangle size={14} className="animate-pulse" /> NEURAL_LOCKDOWN_ACTIVE
            </div>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Timer size={14} className="text-red-500" />
              {Math.floor(focusTime / 60)}:{(focusTime % 60).toString().padStart(2, '0')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`relative z-10 max-w-3xl w-full flex flex-col h-[75vh] border transition-all duration-700 rounded-xl overflow-hidden shadow-2xl ${
        isLinkStable ? 'border-[#bfff00]/20 bg-black/90' : 'border-red-600/50 bg-red-950/20'
      }`}>
        {/* HEADER */}
        <div className="px-4 py-3 border-b border-[#bfff00]/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
            <Activity size={14} className={isLinkStable ? 'text-[#bfff00]' : 'text-red-500'} />
            <span className="text-[10px] tracking-[0.3em] uppercase">System_Aura_v1.13</span>
          </div>
          {!isLinkStable && <div className="text-red-500 text-[9px] font-bold animate-pulse">LINK_SEVERED</div>}
        </div>

        {/* OUTPUT */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-3 text-sm scrollbar-hide">
          {history.map((line, i) => (
            <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} key={i} 
              className={line.startsWith(">") ? "text-zinc-600 italic" : line.includes("ERR") || line.includes("BREACH") ? "text-red-400" : ""}>
              {line}
            </motion.div>
          ))}
        </div>

        {/* INPUT */}
        <form onSubmit={handleCommand} className="p-6 bg-white/5 border-t border-[#bfff00]/10 flex items-center gap-4">
          <ArrowRight size={18} className={isLinkStable ? "text-[#bfff00]" : "text-red-500"} />
          <input 
            autoFocus
            className="flex-1 bg-transparent outline-none text-[#bfff00] placeholder:text-zinc-800"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="awaiting_protocol..."
          />
        </form>
      </div>

      <p className="mt-8 text-[9px] uppercase tracking-[0.6em] text-zinc-700 animate-pulse">
        Persistence is the only protocol.
      </p>
    </main>
  );
}