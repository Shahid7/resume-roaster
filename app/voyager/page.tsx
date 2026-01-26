"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers2, Search, Shell, ScrollText, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function VerseVoyager() {
  const [input, setInput] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const seekKnowledge = async (query?: string) => {
    const searchTarget = query || input;
    if (!searchTarget) return;
    
    setLoading(true);
    setData(null);
    try {
      const res = await fetch("/api/voyager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: searchTarget }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to retrieve");
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-[#d4af37] p-6 md:p-12 selection:bg-gold-500/30 font-sans">
      {/* BACKGROUND TEXTURE */}
      <div className="fixed inset-0 opacity-[0.07] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* TOP NAV */}
        <nav className="mb-20 flex justify-between items-center uppercase tracking-[0.4em] text-[10px] font-bold">
          <Link href="/" className="hover:text-white transition-all flex items-center gap-2 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Hub
          </Link>
          <div className="flex items-center gap-2 text-zinc-600">
            <ScrollText size={12} />
            <span>Session // 04</span>
          </div>
        </nav>

        {/* SEARCH HEADER */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="flex justify-center mb-6"
          >
            <div className="p-4 rounded-full border border-[#d4af37]/10 bg-[#d4af37]/5 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
              <Layers2 size={32} strokeWidth={1.2} />
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-serif italic mb-8 text-[#f4e4bc] tracking-tight">
            What weighs <span className="text-[#d4af37]">on your heart?</span>
          </h1>

          {/* QUICK REFLECTIONS */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 opacity-60">
            {["Gratefulness", "Anxiety", "Patience", "Purpose"].map((word) => (
              <button 
                key={word}
                onClick={() => { setInput(word); seekKnowledge(word); }}
                className="text-[9px] uppercase tracking-widest border border-[#d4af37]/30 px-4 py-1.5 rounded-full hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition-all cursor-pointer"
              >
                {word}
              </button>
            ))}
          </div>
          
          <div className="relative group max-w-lg mx-auto">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && seekKnowledge()}
              placeholder="Speak from the heart..."
              className="w-full bg-transparent border-b border-[#d4af37]/20 py-4 px-2 text-xl pr-12 pl-12 font-serif italic focus:outline-none focus:border-[#d4af37] transition-all placeholder:text-zinc-800 text-white text-center"
            />
            <button 
              onClick={() => seekKnowledge()}
              className="absolute right-0 bottom-4 text-[#d4af37] hover:scale-110 transition-transform cursor-pointer"
            >
              {loading ? <Shell className="animate-spin" /> : <Search size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* RESULT STAGE (The Scroll) */}
        <AnimatePresence mode="wait">
          {data && (
            <motion.div 
              key="scroll"
              initial={{ opacity: 0, clipPath: 'inset(50% 0 50% 0)' }}
              animate={{ opacity: 1, clipPath: 'inset(0% 0 0% 0)' }}
              exit={{ opacity: 0, clipPath: 'inset(50% 0 50% 0)' }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-[#080808] border border-[#d4af37]/20 p-8 md:p-16 rounded-sm shadow-[0_0_100px_rgba(212,175,55,0.05)] overflow-hidden"
            >
              {/* Shimmer Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#d4af37]/5 to-transparent pointer-events-none" />
              
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-10 h-10 border-t border-l border-[#d4af37]/30" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b border-r border-[#d4af37]/30" />

              {/* QURAN SECTION */}
              <div className="mb-16 relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d4af37]/20" />
                  <span className="text-[9px] uppercase tracking-[0.5em] text-[#d4af37]/60 font-bold whitespace-nowrap">Al-Qur'an Al-Kareem</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d4af37]/20" />
                </div>
                
                <p className="text-4xl md:text-6xl text-right font-serif leading-[1.8] text-white/90 mb-10 antialiased animate-ink" dir="rtl">
                  {data.ayah?.arabic}
                </p>
                
                <p className="text-xl md:text-2xl font-serif italic text-[#f4e4bc]/90 leading-relaxed text-center max-w-xl mx-auto animate-ink delay-500">
                  "{data.ayah?.translation}"
                </p>
                
                <div className="mt-8 flex justify-center items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">
                  <span>Surah {data.ayah?.surah}</span>
                  <div className="w-1 h-1 rounded-full bg-[#d4af37]/40" />
                  <span>Verse {data.ayah?.number}</span>
                </div>
              </div>

              {/* HADITH SECTION */}
              <div className="mb-16">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d4af37]/20" />
                  <span className="text-[9px] uppercase tracking-[0.5em] text-[#d4af37]/60 font-bold whitespace-nowrap">Prophetic Tradition</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d4af37]/20" />
                </div>
                <p className="text-lg font-serif italic text-white/80 leading-relaxed text-center max-w-xl mx-auto">
                  {data.hadith?.text}
                </p>
                <span className="text-[10px] text-zinc-600 uppercase tracking-widest block text-center mt-6">— Source: {data.hadith?.source}</span>
              </div>

              {/* REFLECTION */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 1 }}
                className="bg-[#d4af37]/5 p-8 border border-[#d4af37]/10 text-center rounded-sm"
              >
                
                <p className="text-sm font-serif italic text-[#d4af37]/80 leading-relaxed max-w-md mx-auto">
                  {data.reflection}
                </p>
              </motion.div>

              <button 
                onClick={() => setData(null)}
                className="mt-16 text-[9px] font-black tracking-[0.6em] uppercase text-zinc-600 hover:text-[#d4af37] transition-all block mx-auto cursor-pointer border-b border-transparent hover:border-[#d4af37]/40 pb-1"
              >
                Close the Scroll
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER ACCENT */}
      <footer className="mt-20 flex justify-center pb-12 opacity-20">
        <div className="h-12 w-px bg-gradient-to-b from-[#d4af37] to-transparent" />
      </footer>
    </main>
  );
}