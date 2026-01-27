"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCcw, Sparkles, History, X, Radio, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export default function Basirah() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('basirah_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const analyzeImage = async (base64: string, type: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/basirah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mimeType: type }),
      });
      const data = await res.json();
      setAnalysis(data);
      
      const newEntry = { ...data, img: base64, id: Date.now() };
      const updatedHistory = [newEntry, ...history].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem('basirah_history', JSON.stringify(updatedHistory));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        analyzeImage(reader.result as string, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="min-h-screen bg-[#02040a] text-zinc-400 p-4 md:p-8 font-sans overflow-hidden relative">
      
      {/* CREATIVE BACKGROUND: NEURAL MESH */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* TOP BAR: TACTICAL */}
        <header className="flex justify-between items-center mb-12">
          <Link href="/" className="group flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all">
            <X size={14} className="group-hover:rotate-90 transition-transform text-cyan-500" />
            <span className="text-[10px] font-black tracking-widest uppercase">Terminate_Session</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-bold text-cyan-500/50 tracking-[0.3em]">CORE_STATUS</span>
              <span className="text-[10px] font-mono text-white tracking-widest uppercase">Synced // v1.0.4</span>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-cyan-500/20 flex items-center justify-center relative">
               <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT: THE ORBITAL VIEWFINDER */}
          <div className="relative group">
            <motion.div 
              animate={loading ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border border-dashed border-cyan-500/20 rounded-full pointer-events-none"
            />
            
            <div className="relative aspect-square rounded-[2rem] md:rounded-[4rem] overflow-hidden border-4 border-zinc-900 bg-zinc-950 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
              <AnimatePresence mode="wait">
                {!image ? (
                  <motion.label 
                    key="upload"
                    whileHover={{ scale: 1.02 }}
                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)]"
                  >
                    <div className="p-8 rounded-full bg-zinc-900 border border-zinc-800 mb-6 group-hover:border-cyan-500/50 transition-colors">
                      <Camera size={40} strokeWidth={1} className="text-zinc-600 group-hover:text-cyan-400" />
                    </div>
                    <span className="text-[11px] font-black tracking-[0.5em] uppercase text-zinc-500">Engage Optical Feed</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </motion.label>
                ) : (
                  <motion.div key="image" className="relative h-full w-full">
                    <img src={image} className="h-full w-full object-cover" alt="Scan Target" />
                    
                    {/* NEURAL OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-transparent to-transparent opacity-60" />
                    
                    {/* THE SCANNER RIBBON */}
                    {loading && (
                      <motion.div 
                        initial={{ left: "-100%" }}
                        animate={{ left: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent skew-x-12 z-20"
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: THE DATA FLOW */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {analysis && !loading ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex gap-3">
                    <div className="px-4 py-2 bg-cyan-500 text-black text-[10px] font-black uppercase rounded-full tracking-widest">
                      {analysis.vibe}
                    </div>
                    <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-white text-[10px] font-black uppercase rounded-full tracking-widest">
                      {analysis.objectDetected}
                    </div>
                  </div>

                  <div className="relative p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] backdrop-blur-xl">
                    <BrainCircuit size={40} className="absolute -top-5 -right-5 text-cyan-500 opacity-20" />
                    <p className="text-[10px] font-black uppercase text-cyan-500 mb-4 tracking-[0.3em]">Neural Insight // 01</p>
                    <p className="text-2xl font-serif italic text-white leading-snug">
                      {analysis.insight}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 group cursor-help">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-black shrink-0">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Mission Parameter</h4>
                      <p className="text-white text-lg font-bold group-hover:text-cyan-400 transition-colors">{analysis.action}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setImage(null); setAnalysis(null); }}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 hover:text-white transition-all pt-4"
                  >
                    <RefreshCcw size={14} /> Clear_Buffer
                  </button>
                </motion.div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <Radio className={`text-zinc-800 ${loading ? 'animate-ping text-cyan-500' : ''}`} size={48} />
                  <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">
                    {loading ? "Decrypting Reality..." : "Awaiting Input Signal"}
                  </p>
                </div>
              )}
            </AnimatePresence>

            {/* MINIMAL HISTORY TAPE */}
            {history.length > 0 && (
              <div className="pt-10 border-t border-zinc-900">
                <div className="flex items-center gap-2 mb-6">
                  <History size={12} />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">Archived_Scans</span>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {history.map((item) => (
                    <motion.div 
                      key={item.id}
                      whileHover={{ y: -5, scale: 1.05 }}
                      onClick={() => { setImage(item.img); setAnalysis(item); }}
                      className="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 border-zinc-900 cursor-pointer grayscale hover:grayscale-0 hover:border-cyan-500/50 transition-all"
                    >
                      <img src={item.img} className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}