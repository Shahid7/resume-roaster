"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart3, Users, Zap, Database } from 'lucide-react';

export default function LabPulse() {
  const [stats, setStats] = useState({ total: 0, avgScore: 0, latestProject: "" });

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase.from('lab_activity').select('*');
      if (data && data.length > 0) {
        const total = data.length;
        const avg = data.reduce((acc, curr) => {
            // Extract number from description if possible
            const score = curr.description.match(/\d+/);
            return score ? acc + parseInt(score[0]) : acc;
        }, 0) / total;
        
        setStats({
          total,
          avgScore: Math.round(avg),
          latestProject: data[data.length - 1].project_name
        });
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-2 tracking-tighter italic uppercase">Lab Pulse</h1>
        <p className="text-zinc-500 mb-12">Real-time system diagnostics & activity metrics.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat Card 1 */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
            <Users className="text-emerald-500 mb-4" />
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Total Operations</div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
            <Zap className="text-yellow-500 mb-4" />
            <div className="text-3xl font-bold">{stats.avgScore}%</div>
            <div className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Avg Match Score</div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
            <Database className="text-blue-500 mb-4" />
            <div className="text-3xl font-bold uppercase">{stats.latestProject}</div>
            <div className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Last Active Core</div>
          </div>
        </div>

        <div className="mt-12 p-8 border border-emerald-500/20 bg-emerald-500/5 rounded-3xl text-center">
            <BarChart3 className="mx-auto text-emerald-500 mb-4" size={48} />
            <h3 className="text-xl font-bold">Data Persistence Active</h3>
            <p className="text-zinc-400 text-sm mt-2">All Shahid-Labs activities are now being logged to a PostgreSQL cluster via Supabase.</p>
        </div>
      </div>
    </div>
  );
}