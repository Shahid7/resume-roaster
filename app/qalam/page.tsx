"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Feather, BookOpen, Sparkles, Wind, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Qalam() {
  const [content, setContent] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'write' | 'focus'>('write');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Auto-save to LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('qalam_draft');
    if (saved) setContent(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('qalam_draft', content);

    // 2. Add the key handler function
    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Check if Tab is pressed and we have a suggestion
        if (e.key === 'Tab' && suggestion) {
          e.preventDefault(); // This stops the "jumping to next button" behavior
          acceptSuggestion();
        }
      };

      // 4. Update the JSX for the textarea
<textarea
  ref={textareaRef} // Attach the ref
  value={content}
  onChange={(e) => setContent(e.target.value)}
  onKeyDown={handleKeyDown} // Attach the key listener
  className={`w-full h-[70vh] bg-transparent resize-none focus:outline-none text-2xl leading-relaxed ${mode === 'focus' ? 'text-zinc-900' : 'text-zinc-300'} placeholder:text-zinc-800`}
  placeholder="Begin the manuscript..."
/>

      // 3. Update your acceptSuggestion to handle cursor position
const acceptSuggestion = () => {
    if (!textareaRef.current) return;
  
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
  
    // Insert the suggestion at the current cursor position
    const newContent = text.substring(0, start) + (start > 0 && text[start-1] !== " " ? " " : "") + suggestion + text.substring(end);
    
    setContent(newContent);
    setSuggestion("");
  
    // Optional: Put the cursor back at the end of the new text after React re-renders
    setTimeout(() => {
      textarea.focus();
      const newPos = start + suggestion.length + 1;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

    // Auto-trigger suggestion after 2 seconds of inactivity
    if (timerRef.current) clearTimeout(timerRef.current);
    if (content.length > 20 && !suggestion) {
      timerRef.current = setTimeout(() => {
        getSuggestion();
      }, 2000);
    }
  }, [content]);

  const getSuggestion = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const lastSnippet = content.slice(-300);
      const res = await fetch("/api/qalam", {
        method: "POST",
        body: JSON.stringify({ text: lastSnippet, mode: "continue" }),
      });
      const data = await res.json();
      setSuggestion(data.suggestion);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const acceptSuggestion = () => {
    setContent(prev => prev + " " + suggestion);
    setSuggestion("");
  };

  return (
    <main className={`min-h-screen transition-colors duration-1000 ${mode === 'focus' ? 'bg-[#fcfaf2]' : 'bg-[#121212]'} p-8 md:p-24 font-serif`}>
      
      <div className="max-w-2xl mx-auto relative">
        {/* TOP NAV */}
        <nav className="fixed top-8 left-8 right-8 flex justify-between items-center pointer-events-none">
          <Link href="/" className="pointer-events-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors">
            <ArrowLeft size={12} /> The_Lab
          </Link>
          <div className="flex gap-4 pointer-events-auto">
             <button onClick={() => setMode(mode === 'focus' ? 'write' : 'focus')} className="p-2 rounded-full hover:bg-zinc-200 transition-colors text-zinc-400 hover:text-black">
                {mode === 'focus' ? <Feather size={18} /> : <Wind size={18} />}
             </button>
          </div>
        </nav>

        {/* WRITING AREA */}
        <div className="mt-20 relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full h-[70vh] bg-transparent resize-none focus:outline-none text-2xl leading-relaxed ${mode === 'focus' ? 'text-zinc-900' : 'text-zinc-300'} placeholder:text-zinc-800`}
            placeholder="Begin the manuscript..."
          />
          
          {/* GHOST SUGGESTION */}
          <AnimatePresence>
            {suggestion && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute bottom-[-40px] left-0 right-0 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between"
              >
                <p className="text-indigo-900 text-sm italic font-sans">
                  <span className="font-bold uppercase text-[9px] mr-2 opacity-50">Suggestion:</span>
                  "{suggestion}"
                </p>
                <button 
                  onClick={acceptSuggestion}
                  className="bg-indigo-600 text-white text-[10px] px-3 py-1 rounded-md font-bold uppercase tracking-tighter"
                >
                  Tab to Accept
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* STATUS FOOTER */}
        <footer className="mt-12 flex justify-between items-center border-t border-zinc-200 pt-6 opacity-30">
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
            <span>Words: {content.split(/\s+/).filter(Boolean).length}</span>
            <span>Ink: {loading ? "Refilling..." : "Full"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-indigo-500 animate-ping' : 'bg-green-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Live_Draft</span>
          </div>
        </footer>
      </div>
    </main>
  );
}