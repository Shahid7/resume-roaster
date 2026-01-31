"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, BookOpen, Sparkles, ChevronRight, Loader2, Code2 } from 'lucide-react';

export default function AtomicTutor() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const startDeepDive = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      setExplanation(data.explanation);
    } catch (err) {
      alert("Qwen is offline. Check API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-300 font-sans p-6">
      <header className="max-w-7xl mx-auto mb-12 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-blue-500 font-mono text-xs uppercase tracking-[0.3em] mb-2">
            <Cpu size={14} /> Neural_Instruction_System
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tighter">Atomic <span className="text-blue-500">Tutor</span></h1>
        </div>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="typescript">TypeScript</option>
          <option value="rust">Rust</option>
        </select>
      </header>

      <main className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
        {/* INPUT BOX */}
        <section className="space-y-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition" />
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste the code you want to understand deeply..."
              className="relative w-full h-[500px] bg-zinc-950 border border-zinc-800 rounded-2xl p-6 font-mono text-sm leading-relaxed focus:outline-none focus:border-blue-500/50 transition-all shadow-2xl"
            />
          </div>
          
          <button 
            onClick={startDeepDive}
            disabled={loading || !code}
            className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? "DECONSTRUCTING..." : "START ATOMIC ANALYSIS"}
          </button>
        </section>

        {/* EXPLANATION PANEL */}
        <section className="h-[600px] lg:h-[570px] overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {!explanation && !loading ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-600"
              >
                <BookOpen size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-mono tracking-widest uppercase">Select code to begin synthesis</p>
              </motion.div>
            ) : loading ? (
              <div className="space-y-6">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="h-24 bg-zinc-900/50 rounded-xl animate-pulse" />
                 ))}
              </div>
            ) : (
              <motion.div 
                initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                className="prose prose-invert prose-blue max-w-none bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800"
              >
                <div className="flex items-center gap-2 text-blue-400 font-mono text-[10px] uppercase mb-6">
                  <ChevronRight size={12} /> Analysis_Complete
                </div>
                {/* Render the markdown here */}
                <div className="whitespace-pre-wrap font-sans leading-relaxed text-zinc-300">
                  {explanation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>
    </div>
  );
}