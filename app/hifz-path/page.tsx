"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, RotateCcw, CheckCircle2, Waves, Play, Bookmark, Languages, BookmarkCheck, Filter, ArrowRight, BarChart3, Flame, Ghost, Trophy, Zap, CheckCircle } from 'lucide-react';

export default function HifzStudioUltra() {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<any>(null);
  const [activeAyah, setActiveAyah] = useState<number | null>(null);
  const [ayahData, setAyahData] = useState({ arabic: "", english: "", urdu: "", nextFirst: "", globalIndex: 0 });
  
  const [step, setStep] = useState<'read' | 'memorize' | 'test'>('read');
  const [lang, setLang] = useState<'en' | 'ur'>('ur');
  const [revealedIndex, setRevealedIndex] = useState(-1);
  const [masteredKeys, setMasteredKeys] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [filterHard, setFilterHard] = useState(false);
  
  const [noorPoints, setNoorPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [showSummary, setShowSummary] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  useEffect(() => {
    const savedNoor = localStorage.getItem('noor_points');
    const savedStreak = localStorage.getItem('hifz_streak');
    const savedMastered = localStorage.getItem('mastered_ayahs');
    setNoorPoints(Number(savedNoor) || 0);
    setStreak(Number(savedStreak) || 0);
    if (savedMastered) setMasteredKeys(JSON.parse(savedMastered));
    
    fetch("https://api.alquran.cloud/v1/surah").then(res => res.json()).then(data => setSurahs(data.data));
  }, []);

  useEffect(() => {
    localStorage.setItem('noor_points', noorPoints.toString());
    localStorage.setItem('hifz_streak', streak.toString());
    localStorage.setItem('mastered_ayahs', JSON.stringify(masteredKeys));
  }, [noorPoints, streak, masteredKeys]);

  const getAdaptiveClass = () => {
    const wordCount = ayahData.arabic.split(" ").length;
    const translationLength = lang === 'ur' ? ayahData.urdu.length : ayahData.english.length;
    // Mobile responsive text sizing using clamp
    if (wordCount > 40 || translationLength > 200) return { arabic: 'text-2xl md:text-4xl', trans: 'text-base md:text-lg', gap: 'gap-y-4' };
    if (wordCount > 20 || translationLength > 100) return { arabic: 'text-4xl md:text-6xl', trans: 'text-lg md:text-xl', gap: 'gap-y-8' };
    return { arabic: 'text-5xl md:text-8xl', trans: 'text-xl md:text-3xl', gap: 'gap-y-10 md:gap-y-16' };
  };
  const adaptive = getAdaptiveClass();

  useEffect(() => {
    if (activeAyah && selectedSurah) {
      setStep('read');
      setRevealedIndex(-1);
      setStartTime(Date.now());
      stopAudio();
      
      fetch(`https://api.alquran.cloud/v1/ayah/${selectedSurah.number}:${activeAyah}/ar.alafasy`).then(r => r.json())
        .then(res => setAyahData(prev => ({ ...prev, arabic: res.data.text, globalIndex: res.data.number })));
      fetch(`https://api.alquran.cloud/v1/ayah/${selectedSurah.number}:${activeAyah}/en.sahih`).then(r => r.json())
        .then(en => setAyahData(prev => ({ ...prev, english: en.data.text })));
      fetch(`https://api.alquran.cloud/v1/ayah/${selectedSurah.number}:${activeAyah}/ur.jalandhry`).then(r => r.json())
        .then(ur => setAyahData(prev => ({ ...prev, urdu: ur.data.text })));
    }
  }, [activeAyah, selectedSurah]);

  const stopAudio = () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; setIsPlaying(false); setAudioProgress(0); } };
  const playAudio = () => {
    const url = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahData.globalIndex}.mp3`;
    if (audioRef.current) { audioRef.current.src = url; audioRef.current.play(); setIsPlaying(true); }
  };

  const handleMastery = () => {
    const key = `${selectedSurah.number}-${activeAyah}`;
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('last_hifz_date');
  
    if (!masteredKeys.includes(key)) {
      setMasteredKeys(p => [...p, key]);
      setSessionCount(prev => prev + 1);
      const newNoor = noorPoints + 10;
      setNoorPoints(newNoor);
      localStorage.setItem('noor_points', newNoor.toString());
  
      if (lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastDate === yesterday.toDateString()) {
          const newStreak = streak + 1;
          setStreak(newStreak);
          localStorage.setItem('hifz_streak', newStreak.toString());
        } else {
          setStreak(1);
          localStorage.setItem('hifz_streak', "1");
        }
        localStorage.setItem('last_hifz_date', today);
      }
    }
  
    if (activeAyah! < selectedSurah.numberOfAyahs) setActiveAyah(activeAyah! + 1);
    else { setActiveAyah(null); setShowSummary(true); }
  };
  
  // 1. Updated Purchase logic with notifications
  const buyFreeze = () => {
    if (noorPoints >= 50) {
      const confirmPurchase = window.confirm("Use 50 Noor Points to protect your streak for 24 hours?");
      if (confirmPurchase) {
        setNoorPoints(prev => prev - 50);
        // Logic to set a 'freeze_active' flag in localStorage could go here
        alert("❄️ Streak Freeze Activated!");
      }
    }
  };

  // 2. Logic to check if user is at risk (Haven't practiced today)
  const isAtRisk = () => {
    // Check if we are running in the browser
    if (typeof window === 'undefined') return false; 
    
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('last_hifz_date');
    
    // If no date is found, they aren't "at risk" yet, they just started
    if (!lastDate) return false; 
    
    return lastDate !== today; 
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#EAD8C0] overflow-x-hidden relative font-sans">
      <style jsx global>{`
        @keyframes flicker {
            0%, 100% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 5px #f97316); }
            50% { transform: scale(1.15); opacity: 0.8; filter: drop-shadow(0 0 15px #ea580c); }
        }
        .animate-flicker { animation: flicker 2s infinite ease-in-out; }
        @import url('https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');
        .arabic { font-family: 'Amiri Quran', serif; direction: rtl; line-height: 1.6; }
        .urdu { font-family: 'Noto Nastaliq Urdu', serif; direction: rtl; line-height: 2.2; }
        .glass-dock { background: rgba(10, 10, 10, 0.85); backdrop-filter: blur(20px); border-top: 1px solid rgba(212, 163, 115, 0.15); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .noor-glow { text-shadow: 0 0 10px rgba(212, 163, 115, 0.8); }
      `}</style>

      <audio ref={audioRef} onTimeUpdate={() => setAudioProgress((audioRef.current!.currentTime / audioRef.current!.duration) * 100)} onEnded={() => setIsPlaying(false)} className="hidden" />

      {/* RESPONSIVE NAV */}
      {/* RESPONSIVE NAV: Optimized for Mobile & Desktop */}
{/* RESPONSIVE NAV: Optimized for Mobile & Desktop */}
<nav className="relative z-50 border-b border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-3 md:h-20 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
          
          {/* LEFT: Branding */}
          <div className="flex items-center justify-between w-full md:w-auto">
            {/* NEW CUSTOM BRANDING LOGO */}
<div className="flex items-center gap-4">
  <div className="flex flex-col">
    <h1 className="text-[12px] md:text-[14px] font-black tracking-[0.1em] uppercase text-[#D4A373] leading-none drop-shadow-md">
      AL-Quran <span className="text-white/90">Kareem</span>
    </h1>
    <span className="text-[7px] md:text-[8px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">
      by Shahid Ali Sethi
    </span>
  </div>
</div>

            {/* Mobile Streak Badge */}
            <div className="flex md:hidden items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[10px] font-bold text-orange-500">{isNaN(streak) ? 0 : streak}D</span>
              <Flame size={14} className={streak > 0 ? "text-orange-500 fill-orange-500" : "text-white/20"} />
            </div>
          </div>

          {/* RIGHT: Stats & Contextual Freeze Button */}
          <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 md:gap-8">
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[7px] md:text-[8px] font-black text-white/30 tracking-widest uppercase text-right md:text-left">Noor Points</span>
                <span className="text-[10px] md:text-xs font-bold text-[#D4A373] noor-glow tracking-widest">✧ {noorPoints}</span>
              </div>
              
              {/* SMART FREEZE BUTTON: Only shows if at risk AND can afford it */}
              <AnimatePresence>
                {isAtRisk() && noorPoints >= 50 && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={buyFreeze} 
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-lg text-[8px] font-black text-blue-300 hover:bg-blue-500/40 animate-pulse transition-all"
                  >
                    <Zap size={10} fill="currentColor"/> PROTECT STREAK (50✧)
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3">
              {/* Desktop Streak */}
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-right">
                      <span className="block text-[8px] font-black text-white/30 tracking-widest uppercase">Daily Streak</span>
                      <span className="text-xs font-bold text-orange-500">{isNaN(streak) ? 0 : streak} DAYS</span>
                  </div>
                  <Flame size={18} className={streak > 0 ? "text-orange-500 fill-orange-500 animate-flicker" : "text-white/20"} />
              </div>

              <button 
                onClick={() => setLang(lang === 'en' ? 'ur' : 'en')} 
                className="px-3 md:px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black"
              >
                {lang === 'en' ? 'URDU' : 'ENGLISH'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT GRID */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 md:gap-8 p-4 md:p-8 h-auto lg:h-[calc(100vh-80px)]">
        <aside className="overflow-y-auto pr-2 no-scrollbar space-y-2 max-h-[40vh] lg:max-h-full">
          {surahs.map(s => {
              const masteredCount = masteredKeys.filter(k => k.startsWith(`${s.number}-`)).length;
              const progressRatio = masteredCount / s.numberOfAyahs;
              const isMastered = progressRatio === 1;

              return (
                <button key={s.number} onClick={() => setSelectedSurah(s)} 
                        className={`w-full p-4 md:p-5 rounded-2xl md:rounded-3xl text-left transition-all relative overflow-hidden group ${selectedSurah?.number === s.number ? 'bg-[#D4A373] text-black shadow-lg' : 'bg-white/5 hover:bg-white/10'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2 truncate">
                        <h3 className="font-bold text-xs md:text-sm truncate uppercase tracking-tighter">{s.englishName}</h3>
                        {isMastered && <CheckCircle className="text-green-500 md:text-green-600" size={14} />}
                    </div>
                    {progressRatio > 0 && <span className="text-[8px] font-black opacity-40 shrink-0">{Math.round(progressRatio * 100)}%</span>}
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progressRatio * 100}%` }} className={`h-full ${selectedSurah?.number === s.number ? 'bg-black/40' : 'bg-[#D4A373]'}`} />
                  </div>
                </button>
              );
          })}
        </aside>

        <main className="bg-[#0A0A0A] rounded-2xl md:rounded-[3rem] p-4 md:p-10 overflow-y-auto no-scrollbar border border-white/5 relative min-h-[50vh]">
          {selectedSurah ? (
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest">{selectedSurah.englishName}</h2>
                <button onClick={() => setFilterHard(!filterHard)} className={`w-full sm:w-auto px-4 py-2 rounded-full text-[9px] md:text-[10px] font-black transition-all ${filterHard ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/40'}`}>
                    {filterHard ? "VIEWING BOOKMARKS" : "FILTER BOOKMARKS"}
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-4">
                {Array.from({ length: selectedSurah.numberOfAyahs }, (_, i) => i + 1).map(num => {
                  const key = `${selectedSurah.number}-${num}`;
                  if (filterHard && !bookmarks.includes(key)) return null;
                  return (
                    <button key={num} onClick={() => setActiveAyah(num)} 
                            className={`aspect-square rounded-xl md:rounded-2xl flex items-center justify-center text-xs md:text-base font-bold border-2 transition-all ${activeAyah === num ? 'bg-white text-black' : masteredKeys.includes(key) ? 'border-[#D4A373] text-[#D4A373] bg-[#D4A373]/5' : 'border-white/5 bg-white/5'} ${num === (masteredKeys.filter(k => k.startsWith(`${selectedSurah.number}-`)).length + 1) ? 'ring-2 ring-[#D4A373] animate-pulse' : ''}`}>
                      {num}
                      {bookmarks.includes(key) && <div className="absolute top-1.5 md:top-2 right-1.5 md:right-2 w-1 md:w-1.5 h-1 md:h-1.5 bg-orange-500 rounded-full"/>}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : <div className="inline-flex p-4 md:p-6 bg-[#D4A373]/10 rounded-full text-[#D4A373]">
          {/* We set a base size that looks good on both, or use a class to scale */}
          <BookOpen size={40} className="md:w-12 md:h-12" />
        </div>}
        </main>
      </div>

      {/* FULLSCREEN RECITATION VIEW */}
      <AnimatePresence>
        {activeAyah && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[100] bg-[#050505] flex flex-col overflow-hidden">
            <header className="h-16 md:h-20 px-4 md:px-8 flex justify-between items-center border-b border-white/5 bg-black/60 backdrop-blur-xl relative shrink-0">
                <div className="absolute bottom-0 left-0 h-[2px] bg-[#D4A373] transition-all" style={{ width: `${audioProgress}%` }} />
                <div className="flex items-center gap-2 md:gap-4">
                    <button onClick={() => {
                        const key = `${selectedSurah.number}-${activeAyah}`;
                        setBookmarks(p => p.includes(key) ? p.filter(k => k !== key) : [...p, key]);
                    }} className={`p-2.5 md:p-3 rounded-xl border ${bookmarks.includes(`${selectedSurah.number}-${activeAyah}`) ? 'bg-orange-500 border-orange-500 text-white' : 'border-white/10 text-white/20'}`}><Bookmark size={16}/></button>
                    <button onClick={playAudio} className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl flex items-center gap-2 ${isPlaying ? 'bg-[#D4A373] text-black' : 'bg-white/5 text-[#D4A373]'}`}>
                        {isPlaying ? <Waves size={14} className="animate-pulse"/> : <Play size={14}/>} <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Listen</span>
                    </button>
                </div>
                <button onClick={() => { setActiveAyah(null); stopAudio(); }} className="p-2.5 md:p-4 bg-white/5 rounded-full"><X size={18}/></button>
            </header>

            <div className={`flex-1 flex flex-col items-center justify-center px-6 md:px-8 py-4 overflow-y-auto no-scrollbar ${adaptive.gap}`}>
              <div className={`arabic leading-relaxed text-center transition-all duration-700 ${adaptive.arabic} flex flex-wrap justify-center gap-x-4 md:gap-x-6 gap-y-4 max-w-7xl`}>
                {ayahData.arabic.split(" ").map((word, i) => (
                  <motion.span key={i} className={`transition-all duration-1000 ${step === 'read' ? 'text-white' : step === 'memorize' && i > revealedIndex ? 'blur-2xl md:blur-3xl opacity-0 scale-90' : step === 'test' ? (i <= revealedIndex ? 'opacity-10 text-white' : 'opacity-0') : 'text-[#D4A373]'}`}>
                    {word}
                  </motion.span>
                ))}
              </div>
              
              <p className={`${lang === 'ur' ? `urdu ${adaptive.trans}` : `${adaptive.trans} font-light italic opacity-40`} text-center max-w-4xl px-4`}>
                {lang === 'ur' ? ayahData.urdu : ayahData.english}
              </p>
            </div>

            <footer className="glass-dock p-6 md:p-8 flex flex-col items-center gap-6 shrink-0">
                <div className="flex gap-4 w-full max-w-lg">
                    {step === 'read' ? (
                        <button onClick={() => { stopAudio(); setStep('memorize'); }} className="flex-1 py-4 md:py-5 bg-[#D4A373] text-black rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest">Start Memorizing</button>
                    ) : step === 'memorize' ? (
                        <button onClick={() => revealedIndex < ayahData.arabic.split(" ").length - 1 ? setRevealedIndex(v => v + 1) : setStep('test')} className="flex-1 py-4 md:py-5 bg-[#D4A373] text-black rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest">
                            {revealedIndex === ayahData.arabic.split(" ").length - 1 ? "Start Ghost Mode" : "Next Word"}
                        </button>
                    ) : (
                        <button onClick={handleMastery} className="flex-1 py-5 md:py-6 bg-white text-black rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                            <Trophy size={16}/> Perfect Recitation (+10)
                        </button>
                    )}
                </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUMMARY OVERLAY */}
      <AnimatePresence>
          {showSummary && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 backdrop-blur-2xl text-center">
                  <div className="bg-[#111] p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-[#D4A373]/30 max-w-md w-full space-y-6 md:space-y-8">
                  <div className="inline-flex p-4 md:p-6 bg-[#D4A373]/10 rounded-full text-[#D4A373]">
  {/* We set a base size that looks good on both, or use a class to scale */}
  <Trophy size={40} className="md:w-12 md:h-12" />
</div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-1">Session Victory</h2>
                        <p className="text-[8px] md:text-[10px] text-white/30 uppercase tracking-[0.4em]">Allah reward your efforts</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                          <div className="p-4 md:p-6 bg-white/5 rounded-2xl md:rounded-3xl"><p className="text-[8px] md:text-[10px] opacity-40 mb-1 uppercase tracking-tighter">Noor</p><p className="text-lg md:text-2xl font-bold text-[#D4A373]">+{sessionCount * 10}</p></div>
                          <div className="p-4 md:p-6 bg-white/5 rounded-2xl md:rounded-3xl"><p className="text-[8px] md:text-[10px] opacity-40 mb-1 uppercase tracking-tighter">Streak</p><p className="text-lg md:text-2xl font-bold text-orange-500">{streak}D</p></div>
                      </div>
                      <button onClick={() => setShowSummary(false)} className="w-full py-5 md:py-6 bg-[#D4A373] text-black rounded-2xl md:rounded-3xl font-black text-[10px] md:text-xs uppercase tracking-widest">Continue Journey</button>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}