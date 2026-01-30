"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {Zap, Plus, Briefcase, DollarSign, Code, ExternalLink } from 'lucide-react';

export default function HunterLedger() {
  const [input, setInput] = useState("");
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data } = await supabase.from('job_leads').select('*').order('created_at', { ascending: false });
    if (data) setLeads(data);
  };

  const addLead = async () => {
    if (!input) return;
    setLoading(true);
    
    try {
      // 1. Assign the fetch result to 'res'
      const res = await fetch('/api/ledger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: input, url: "" }),
      });
  
      // 2. Parse the JSON response
      const debugData = await res.json();
      
      // 3. Log to console so we can see the hidden score
      console.log("AI DATA RECEIVED:", debugData);
      console.log("SCORE EXTRACTED:", debugData.match_score);
  
      // 4. Refresh the list and clear input
      setInput("");
      await fetchLeads(); // Wait for the list to refresh from Supabase
      
    } catch (error) {
      console.error("Error adding lead:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateIntro = async (lead: any) => {
    try {
      const res = await fetch('/api/generate-intro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          jobTitle: lead.job_title, 
          company: lead.company_name, 
          skills: lead.top_skills 
        }),
      });
      
      if (!res.ok) throw new Error("Failed to generate");
      
      const data = await res.json();
      // For now, we use a browser alert to prove it works!
      alert(`🚀 AI INTRO FOR ${lead.company_name.toUpperCase()}:\n\n${data.intro}`);
      
    } catch (err) {
      console.error(err);
      alert("Error generating intro. Check console.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-300 p-8 font-mono">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-end mb-12 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tighter uppercase">Hunter's Ledger v1.0</h1>
            <p className="text-xs text-zinc-500">Automated Job Lead Extraction & Tracking</p>
          </div>
          <div className="text-right text-[10px] text-emerald-500">SYSTEM: ONLINE</div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* INPUT SIDE */}
          <div className="space-y-4">
            <textarea 
              placeholder="Paste Job Description here..."
              className="w-full h-64 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-sm focus:border-emerald-500/50 outline-none transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              onClick={addLead}
              disabled={loading}
              className="w-full py-4 bg-white text-black font-black uppercase text-xs rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? "Processing..." : <><Plus size={14}/> Index Lead</>}
            </button>
          </div>

          {/* LIST SIDE */}
          <div className="lg:col-span-2 space-y-4">
          {leads.map((lead) => (
  <div key={lead.id} className="mb-6 group">
    <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2rem] hover:border-emerald-500/50 transition-all backdrop-blur-md relative overflow-hidden">
      
      {/* Background Glow Effect */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-all" />

      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white tracking-tight">{lead.job_title}</h3>
            <div className="flex gap-1">
               <span className="text-[8px] px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full border border-zinc-700 uppercase font-black">Verified</span>
            </div>
          </div>
          <p className="text-emerald-500 font-mono text-sm uppercase tracking-wider">{lead.company_name}</p>
        </div>

        <div className="text-right">
          {/* DYNAMIC MATCH SCORE */}
          <div className={`text-3xl font-black italic ${lead.match_score > 70 ? 'text-emerald-400' : 'text-yellow-500'}`}>
            {lead.match_score || 0}%
          </div>
          <div className="text-[8px] text-zinc-600 uppercase font-bold tracking-[0.2em]">Compatibility</div>
        </div>
      </div>

      {/* UNIQUE FEATURE: CULTURE CHEAT SHEET */}
      <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/5">
        <p className="text-[11px] text-zinc-400 italic">
          <span className="text-zinc-200 font-bold not-italic mr-2">💡 INSIGHT:</span>
          {lead.culture_insight || "Analyze the lead to unlock culture tips."}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {lead.top_skills?.map((skill: string) => (
          <span key={skill} className="text-[10px] px-3 py-1 bg-black text-zinc-400 rounded-full border border-zinc-800 group-hover:border-emerald-500/20 transition-all">
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-800/50 flex justify-between items-center">
        <div className="flex gap-6">
          <button onClick={() => generateIntro(lead)} className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-500 hover:text-white transition-colors">
            <Zap size={14} fill="currentColor" /> Generate Outreach
          </button>
          <a href={lead.url} target="_blank" className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors">
            <ExternalLink size={14} /> Source Link
          </a>
        </div>
        <div className="text-[10px] text-zinc-700 font-mono">{new Date(lead.created_at).toLocaleDateString()}</div>
      </div>
    </div>
  </div>
))}
          </div>
        </div>
      </div>
    </div>
  );
}