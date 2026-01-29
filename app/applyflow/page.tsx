"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Briefcase, CheckCircle, AlertCircle, Sparkles, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

// NOTE: We REMOVED the top-level import of extractTextFromPDF to fix the build error.

export default function ApplyFlow() {
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Guard to ensure we only run browser code when mounted
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // DYNAMIC IMPORT: This is the magic. 
      // It only loads the PDF library in the browser when the user clicks upload.
      const { extractTextFromPDF } = await import('./pdf-util');
      const text = await extractTextFromPDF(file);
      setResume(text); 
    } catch (error) {
      console.error("PDF Parsing Error:", error);
      alert("Could not read PDF. Please ensure it's not password protected.");
    } finally {
      setUploading(false);
    }
  };

  const analyzeJob = async () => {
    if (!resume || !jobDesc) {
      alert("Please provide both a resume and a job description.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/applyflow", {
        method: "POST",
        body: JSON.stringify({ resume, jobDesc }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  // If not mounted, return a simple loader or null to prevent hydration mismatch
  if (!isMounted) return null;

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
            <h1 className="text-4xl font-black tracking-tighter mb-2 italic text-zinc-900">QUBUL<span className="text-blue-600">.</span></h1>
            <p className="text-zinc-500 mb-10 text-sm">Align your profile with the recruiter's secret checklist.</p>
            
            <div className="grid md:grid-cols-2 gap-8">
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
                  className="w-full h-80 p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm leading-relaxed"
                  onChange={(e) => setResume(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-400"><Briefcase size={14}/> Job Description</label>
                <textarea 
                  placeholder="Paste the job requirements here..."
                  className="w-full h-80 p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm leading-relaxed"
                  onChange={(e) => setJobDesc(e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={analyzeJob}
              disabled={loading}
              className="mt-10 w-full py-5 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              Scan for Match <Sparkles size={18}/>
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
            {/* MATCH SCORE */}
            <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-xl flex flex-col md:flex-row items-center gap-10">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full rotate-[-90deg]">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-zinc-100" />
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * (result.matchScore || 0)) / 100} className="text-blue-600 transition-all duration-1000" />
                </svg>
                <span className="absolute text-4xl font-black">{result.matchScore}%</span>
              </div>
              <div>
                <h2 className="text-3xl font-black mb-2 italic">Analysis Complete</h2>
                <p className="text-zinc-500 mb-4 max-w-md text-sm">{result.verdict}</p>
                <button onClick={() => setResult(null)} className="text-[10px] font-bold text-blue-600 uppercase border-b border-blue-600 pb-0.5 hover:text-blue-800 transition-colors">Analyze New Role</button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* KEYWORDS */}
              <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100">
                <h3 className="flex items-center gap-2 text-amber-800 font-bold mb-4 uppercase text-[10px] tracking-widest"><AlertCircle size={14}/> Keyword Gaps</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords?.map((kw: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-white rounded-full text-[10px] font-bold text-amber-900 border border-amber-200">{kw}</span>
                  ))}
                </div>
              </div>

              {/* STRENGTHS */}
              <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100">
                <h3 className="flex items-center gap-2 text-emerald-800 font-bold mb-4 uppercase text-[10px] tracking-widest"><CheckCircle size={14}/> Key Strengths</h3>
                <ul className="space-y-2">
                  {result.strengths?.map((s: string, i: number) => (
                    <li key={i} className="text-xs font-medium text-emerald-900 flex gap-2">
                      <span className="text-emerald-500">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* BULLETS */}
            <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-xl">
              <h3 className="flex items-center gap-2 text-zinc-400 font-bold mb-8 uppercase text-[10px] tracking-widest"><Zap size={14}/> Upgraded Experience Bullets</h3>
              <div className="space-y-6">
                {result.upgradedBullets?.map((b: any, i: number) => (
                  <div key={i} className="group p-6 hover:bg-zinc-50 rounded-2xl transition-all border-b border-zinc-100 last:border-0">
                    <p className="text-[10px] text-zinc-400 mb-2 line-through italic">"{b.original}"</p>
                    <p className="text-base font-bold text-zinc-900 flex items-start gap-3 italic">
                      <ArrowRight className="mt-1 text-blue-600 shrink-0" size={16}/> 
                      {b.improved}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* INTERVIEW PREP */}
            <div className="bg-zinc-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                <h3 className="flex items-center gap-2 text-blue-400 font-bold mb-8 uppercase text-[10px] tracking-[0.2em]"><Sparkles size={14}/> Predicted Interview Prep</h3>
                <div className="grid gap-4">
                  {result.interviewPrep?.map((item: any, i: number) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                      <p className="font-bold text-lg mb-3">"{item.question}"</p>
                      <p className="text-xs text-zinc-400 mb-4 leading-relaxed"><span className="text-blue-400 font-black mr-2">LOGIC:</span> {item.why}</p>
                      <div className="bg-blue-600/20 p-3 rounded-lg text-[11px] font-medium text-blue-200 border border-blue-500/30">
                        <span className="font-black mr-2 uppercase">Protocol:</span> {item.tip}
                      </div>
                    </div>
                  ))}
                </div>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}