"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, Briefcase, CheckCircle, AlertCircle, Sparkles, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { extractTextFromPDF } from './pdf-util';

export default function ApplyFlow() {
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // 1. Safety check for browser environment
        if (typeof window === "undefined") return;
      
        const file = e.target.files?.[0];
        if (!file) return;
      
        setUploading(true);
        try {
          // 2. We can even dynamically import the util here so the server never sees it
          const { extractTextFromPDF } = await import('./pdf-util');
          const text = await extractTextFromPDF(file);
          setResume(text);
        } catch (error) {
          console.error("PDF Parsing Error:", error);
        } finally {
          setUploading(false);
        }
      };

    const file = e.target.files?.[0];
    if (!file) return;
  
    setUploading(true);
    try {
      const text = await extractTextFromPDF(file);
      setResume(text); // Automatically fill the resume box
    } catch (error) {
      console.error("PDF Parsing Error:", error);
      alert("Could not read PDF. Please ensure it's not password protected.");
    } finally {
      setUploading(false);
    }
  };


  const analyzeJob = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/applyflow", {
        method: "POST",
        body: JSON.stringify({ resume, jobDesc }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-900 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <nav className="mb-12 flex justify-between items-center">
          <Link href="/" className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">← Lab_Interface</Link>
          <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-blue-600 uppercase">Optimizer Active</span>
          </div>
        </nav>

        {!result && !loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black tracking-tighter mb-2">APPLY<span className="text-blue-600">FLOW.</span></h1>
            <p className="text-zinc-500 mb-10">Optimize your resume for any job description in seconds.</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* // ... In your JSX, inside the "Your Resume" box: */}
<div className="space-y-4">
  <div className="flex justify-between items-center">
    <label className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-400">
      <FileText size={14}/> Your Resume
    </label>
    
    <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black transition-colors flex items-center gap-2">
      <Upload size={12} /> {uploading ? "Reading..." : "Upload PDF"}
      <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} disabled={uploading} />
    </label>
  </div>
  
  <textarea 
    value={resume}
    placeholder="Paste resume or upload PDF..."
    className="w-full h-80 p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
    onChange={(e) => setResume(e.target.value)}
  />
</div>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-400"><Briefcase size={14}/> Job Description</label>
                <textarea 
                  placeholder="Paste the job requirements here..."
                  className="w-full h-80 p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  onChange={(e) => setJobDesc(e.target.value)}
                />
              </div>
            </div>
            <button 
              onClick={analyzeJob}
              className="mt-10 w-full py-5 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3"
            >
              Analyze Match <Sparkles size={18}/>
            </button>
          </motion.div>
        )}

        {loading && (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black text-zinc-400 tracking-widest uppercase animate-pulse">Scanning ATS Patterns...</p>
          </div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
            {/* SCORE HEADER */}
            <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-xl flex flex-col md:flex-row items-center gap-10">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full rotate-[-90deg]">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-zinc-100" />
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * result.matchScore) / 100} className="text-blue-600 transition-all duration-1000" />
                </svg>
                <span className="absolute text-4xl font-black">{result.matchScore}%</span>
              </div>
              <div>
                <h2 className="text-3xl font-black mb-2">Match Report</h2>
                <p className="text-zinc-500 mb-4 max-w-md">{result.verdict}</p>
                <button onClick={() => setResult(null)} className="text-xs font-bold text-blue-600 uppercase border-b border-blue-600 pb-1 hover:text-blue-800 transition-colors">Start New Analysis</button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* MISSING KEYWORDS */}
              <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100">
                <h3 className="flex items-center gap-2 text-amber-800 font-bold mb-4 uppercase text-xs tracking-widest"><AlertCircle size={14}/> Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((kw: string, i: number) => (
                    <span key={i} className="px-4 py-2 bg-white rounded-full text-xs font-bold text-amber-900 border border-amber-200">{kw}</span>
                  ))}
                </div>
              </div>

              {/* STRENGTHS */}
              <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100">
                <h3 className="flex items-center gap-2 text-emerald-800 font-bold mb-4 uppercase text-xs tracking-widest"><CheckCircle size={14}/> Profile Strengths</h3>
                <ul className="space-y-2">
                  {result.strengths.map((s: string, i: number) => (
                    <li key={i} className="text-sm font-medium text-emerald-900 flex gap-2">
                      <span className="text-emerald-500">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* UPGRADED BULLETS */}
            <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-xl">
              <h3 className="flex items-center gap-2 text-zinc-400 font-bold mb-8 uppercase text-xs tracking-widest"><Zap size={14}/> AI Bullet Point Optimizer</h3>
              <div className="space-y-6">
                {result.upgradedBullets.map((b: any, i: number) => (
                  <div key={i} className="group p-6 hover:bg-zinc-50 rounded-2xl transition-all border-b border-zinc-100 last:border-0">
                    <p className="text-xs text-zinc-400 mb-2 line-through">"{b.original}"</p>
                    <p className="text-lg font-bold text-zinc-900 flex items-start gap-3 italic">
                      <ArrowRight className="mt-1 text-blue-600 shrink-0" size={18}/> 
                      {b.improved}
                    </p>
                  </div>
                ))}
              </div>
            </div>

{/* NEW INTERVIEW PREP SECTION */}
<div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-10 rounded-[3rem] text-white shadow-xl mt-12">
  <div className="flex items-center gap-3 mb-8">
    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
      <Sparkles size={24} />
    </div>
    <div>
      <h3 className="text-xl font-black tracking-tight">Predicted Interview Prep</h3>
      <p className="text-indigo-100 text-xs">Based on your specific match profile</p>
    </div>
  </div>
  
  <div className="grid gap-4">
    {result.interviewPrep.map((item: any, i: number) => (
      <div key={i} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
        <p className="font-bold text-lg mb-2">"{item.question}"</p>
        <p className="text-sm text-indigo-100 opacity-80 mb-4"><span className="font-black text-[10px] uppercase mr-2 text-white">The Why:</span> {item.why}</p>
        <div className="bg-indigo-900/40 p-3 rounded-lg text-xs border border-indigo-400/30 font-medium">
          <span className="text-blue-300 font-bold mr-2 uppercase">Pro-Tip:</span> {item.tip}
        </div>
      </div>
    ))}
  </div>
</div>

          </motion.div>
        )}
      </div>
    </main>
  );
}