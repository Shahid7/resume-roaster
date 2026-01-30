"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

// Helper function to calculate relative time
const formatTime = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return past.toLocaleDateString();
};

export default function ActivityTicker() {
  const [logs, setLogs] = useState<any[]>([]);
  const [now, setNow] = useState(new Date()); // Used to force a re-render every minute

  useEffect(() => {
    const getInitialLogs = async () => {
      const { data } = await supabase
        .from('lab_activity')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setLogs(data);
    };
    getInitialLogs();

    // Refresh the "time ago" strings every 30 seconds
    const timer = setInterval(() => setNow(new Date()), 30000);

    const channel = supabase
      .channel('realtime-logs')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'lab_activity' }, 
        (payload) => {
          setLogs((prev) => [payload.new, ...prev].slice(0, 5));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      clearInterval(timer);
    };
  }, []);

  if (logs.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 p-6 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Live Lab Activity</h3>
      </div>
      
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {logs.map((log) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex justify-between items-start gap-4 group"
            >
              <div className="flex flex-col">
                <span className="text-[10px] text-emerald-500 font-mono font-bold uppercase tracking-tighter">
                  {log.project_name}
                </span>
                <span className="text-zinc-300 text-sm leading-tight">
                  {log.description}
                </span>
              </div>
              <span className="text-[10px] text-zinc-600 font-mono whitespace-nowrap pt-1">
                {formatTime(log.created_at)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}