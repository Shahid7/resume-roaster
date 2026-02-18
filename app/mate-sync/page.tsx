"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Search, Copy, Check, X, Sparkles, Sun, Moon } from 'lucide-react';

interface City {
  id: string;
  name: string;
  tz: string;
}

// UPGRADED GLOBAL MAP: Expanded to include requested countries and more
const GLOBAL_ZONES: Record<string, string> = {
    "VIETNAM": "Asia/Ho_Chi_Minh",
    "SOUTH KOREA": "Asia/Seoul",
    "KOREA": "Asia/Seoul",
    "MALAYSIA": "Asia/Kuala_Lumpur",
    "SINGAPORE": "Asia/Singapore",
    "THAILAND": "Asia/Bangkok",
    "GERMANY": "Europe/Berlin",
    "DUBAI": "Asia/Dubai",
    "UAE": "Asia/Dubai",
    "NEW YORK": "America/New_York",
    "BOSTON": "America/New_York",
    "LONDON": "Europe/London",
    "TOKYO": "Asia/Tokyo",
    "PAKISTAN": "Asia/Karachi",
    "KARACHI": "Asia/Karachi",
    "PARIS": "Europe/Paris",
    "SYDNEY": "Australia/Sydney",
    "CALIFORNIA": "America/Los_Angeles",
    "CHINA": "Asia/Shanghai",
    "BEIJING": "Asia/Shanghai",
    "INDIA": "Asia/Kolkata",
    "MUMBAI": "Asia/Kolkata"
};

const AeroTimeMapper = () => {
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date();
  
  const [minutes, setMinutes] = useState((now.getHours() * 60) + now.getMinutes());
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const [cities, setCities] = useState<City[]>([
    { id: '1', name: 'LONDON', tz: 'Europe/London' },
    { id: '2', name: 'BOSTON', tz: 'America/New_York' },
    { id: '3', name: 'TOKYO', tz: 'Asia/Tokyo' },
    { id: '4', name: 'LOCAL', tz: localTz },
  ]);

  const getCityData = (tz: string) => {
    const date = new Date();
    date.setHours(Math.floor(minutes / 60));
    date.setMinutes(minutes % 60);
    date.setSeconds(0);

    const timeString = date.toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz
    });

    const [h, m] = timeString.split(':').map(Number);
    const localDay = date.getDate();
    const targetDay = parseInt(new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone: tz }).format(date));
    
    let dayLabel = "TODAY";
    if (targetDay > localDay) dayLabel = "TOMORROW";
    if (targetDay < localDay) dayLabel = "YESTERDAY";

    return { time: timeString, hour: h, dayLabel };
  };

  const getTheme = (hour: number) => {
    if (hour >= 22 || hour < 6) return "from-indigo-950 to-black text-indigo-200 border-indigo-500/20";
    if (hour >= 6 && hour < 9) return "from-orange-900/40 to-black text-orange-200 border-orange-500/20";
    if (hour >= 9 && hour < 17) return "from-emerald-950/40 to-black text-emerald-200 border-emerald-500/20";
    return "from-blue-900/40 to-black text-blue-200 border-blue-500/20";
  };

  const isGoldenHour = cities.every(city => {
    const { hour } = getCityData(city.tz);
    return hour >= 8 && hour <= 21;
  });

  const handleAddCity = (e: React.FormEvent) => {
    e.preventDefault();
    const query = search.toUpperCase().trim();
    
    // Check our database first, then check if it's already a valid IANA string
    const matchedTz = GLOBAL_ZONES[query] || (search.includes('/') ? search : null);

    if (!matchedTz) {
        alert(`Could not find "${search}". Try: Vietnam, South Korea, Malaysia, or London.`);
        return;
    }

    setCities([{ id: Date.now().toString(), name: query, tz: matchedTz }, ...cities]);
    setSearch("");
  };

  const copySync = () => {
    const text = cities.map(c => `${c.name}: ${getCityData(c.tz).time}`).join(' | ');
    navigator.clipboard.writeText(`🌍 SYNC: ${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#020203] text-zinc-400 font-sans p-6 md:p-12 relative overflow-hidden transition-colors duration-1000">
      
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none transition-opacity duration-1000 ${isGoldenHour ? 'opacity-20' : 'opacity-0'}`}>
        <div className="w-full h-full bg-amber-500 blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto flex flex-col gap-10 relative z-10">
        
        {/* TOP NAV */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black shadow-lg">
                <Clock size={20} />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-white italic uppercase">Mate Sync</h1>
          </div>

          <form onSubmit={handleAddCity} className="flex gap-2 w-full md:w-auto bg-zinc-900/50 p-1 rounded-full border border-white/5">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-3 text-zinc-600" size={14}/>
                <input 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Country (Vietnam, Malaysia...)"
                    className="w-full bg-transparent py-2.5 pl-10 pr-4 text-xs outline-none text-white"
                />
            </div>
            <button type="submit" className="px-4 text-[10px] font-black tracking-widest text-emerald-500 hover:text-white transition-colors uppercase">Add country</button>
          </form>
        </div>

        {/* MAIN SLIDER PANEL */}
        <div className={`bg-zinc-900/30 border p-12 rounded-[3rem] backdrop-blur-3xl relative transition-all duration-700 ${isGoldenHour ? 'border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.1)]' : 'border-white/5'}`}>
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center gap-2 mb-2">
               {isGoldenHour && <Sparkles size={12} className="text-amber-400 animate-pulse" />}
               <span className={`text-[10px] font-black tracking-[0.5em] uppercase italic transition-colors ${isGoldenHour ? 'text-amber-400' : 'text-emerald-500'}`}>
                   {isGoldenHour ? 'Perfect_Sync_Window' : 'Your_Local_Time'}
               </span>
            </div>
            <h2 className="text-9xl font-black tabular-nums tracking-tighter text-white italic">
                {Math.floor(minutes/60).toString().padStart(2, '0')}:{(minutes%60).toString().padStart(2, '0')}
            </h2>
          </div>
          
          <input 
            type="range" min="0" max="1439" step="1"
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value))}
            className={`w-full h-1.5 rounded-full appearance-none cursor-pointer transition-all ${isGoldenHour ? 'bg-amber-900/50 accent-amber-500' : 'bg-zinc-800 accent-white'}`}
          />
        </div>

        {/* CITY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {cities.map((city) => {
              const data = getCityData(city.tz);
              const theme = getTheme(data.hour);
              const isNight = data.hour >= 20 || data.hour < 6;

              return (
                <motion.div 
                  layout
                  key={city.id}
                  className={`relative overflow-hidden bg-gradient-to-br ${theme} border p-8 rounded-[2.5rem] flex flex-col justify-between h-72 group shadow-2xl transition-all duration-700`}
                >
                  <button 
                    onClick={() => setCities(cities.filter(c => c.id !== city.id))}
                    className="absolute top-6 right-6 p-2 bg-black/20 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 text-white"
                  >
                    <X size={14}/>
                  </button>

                  <div>
                    <h3 className="text-3xl font-black italic tracking-tighter mb-1 text-white">{city.name}</h3>
                    <div className="flex items-center gap-2">
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-60">
                            {data.dayLabel}
                        </p>
                        <div className="h-[1px] w-4 bg-white/20" />
                        {isNight ? <Moon size={12} className="opacity-40" /> : <Sun size={12} className="opacity-40" />}
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-6xl font-black tabular-nums tracking-tighter text-white leading-none">{data.time}</span>
                    <div className="w-12 h-12 rounded-full border border-current/20 flex items-center justify-center relative">
                        <motion.div 
                            animate={{ rotate: (data.hour * 30 + (parseInt(data.time.split(':')[1]) / 2)) }}
                            className="w-0.5 h-4 bg-current origin-bottom rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                        />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* FLOATING COPY BUTTON */}
        <button 
            onClick={copySync}
            className="fixed bottom-8 right-8 bg-white text-black px-6 py-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3 font-black text-[10px] tracking-widest z-50 uppercase"
        >
            {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            {copied ? "Copied" : "Export_Sync"}
        </button>
      </div>
    </div>
  );
};

export default AeroTimeMapper;