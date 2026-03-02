"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  ArrowRight, AlertCircle, Check, LogOut, X, Sunrise, Sunset, 
  Moon, Volume2, VolumeX, BookOpen, Quote, Search, Info, AlertTriangle, ScrollText, CheckCircle2
} from 'lucide-react';
import AlKhatm from '../diary/page';
import { createClient } from '@supabase/supabase-js';


// --- MINGORA 2026 FULL CALENDAR (Feb 19 - Mar 19) ---
const MINGORA_TIMINGS: Record<string, { sehar: string; iftar: string }> = {
  "2026-02-19": { sehar: "05:26", iftar: "18:02" },
  "2026-02-20": { sehar: "05:25", iftar: "18:02" },
  "2026-02-21": { sehar: "05:24", iftar: "18:03" },
  "2026-02-22": { sehar: "05:23", iftar: "18:04" },
  "2026-02-23": { sehar: "05:22", iftar: "18:05" },
  "2026-02-24": { sehar: "05:21", iftar: "18:06" },
  "2026-02-25": { sehar: "05:20", iftar: "18:07" },
  "2026-02-26": { sehar: "05:19", iftar: "18:08" },
  "2026-02-27": { sehar: "05:18", iftar: "18:09" },
  "2026-02-28": { sehar: "05:17", iftar: "18:10" },
  "2026-03-01": { sehar: "05:16", iftar: "18:10" },
  "2026-03-02": { sehar: "05:15", iftar: "18:11" },
  "2026-03-03": { sehar: "05:13", iftar: "18:12" },
  "2026-03-04": { sehar: "05:12", iftar: "18:13" },
  "2026-03-05": { sehar: "05:11", iftar: "18:14" },
  "2026-03-06": { sehar: "05:09", iftar: "18:15" },
  "2026-03-07": { sehar: "05:08", iftar: "18:15" },
  "2026-03-08": { sehar: "05:07", iftar: "18:16" },
  "2026-03-09": { sehar: "05:05", iftar: "18:17" },
  "2026-03-10": { sehar: "05:04", iftar: "18:18" },
  "2026-03-11": { sehar: "05:03", iftar: "18:19" },
  "2026-03-12": { sehar: "05:01", iftar: "18:19" },
  "2026-03-13": { sehar: "05:00", iftar: "18:20" },
  "2026-03-14": { sehar: "04:58", iftar: "18:21" },
  "2026-03-15": { sehar: "04:57", iftar: "18:22" },
  "2026-03-16": { sehar: "04:55", iftar: "18:22" },
  "2026-03-17": { sehar: "04:54", iftar: "18:23" },
  "2026-03-18": { sehar: "04:52", iftar: "18:24" },
  "2026-03-19": { sehar: "04:51", iftar: "18:25" },
};

const ALL_DUAS = [
  // --- RAMADAN SPECIFIC ---
  { cat: "Ramadan", title: "Suhoor Intention", arabic: "وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ", trans: "I intend to keep the fast for tomorrow in the month of Ramadan." },
  { cat: "Ramadan", title: "Iftar Completion", arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ", trans: "Thirst has gone, veins are moistened, and reward is certain, Allah willing." },
  { cat: "Ramadan", title: "Breaking Fast (Alt)", arabic: "اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ", trans: "O Allah, for You I have fasted and with Your provision I have broken my fast." },
  { cat: "Ramadan", title: "Night of Power", arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي", trans: "O Allah, You are Forgiving and love forgiveness, so forgive me." },

  // --- PROPHETIC (MASNOON) ---
  { cat: "Prophetic", title: "Morning Protection", arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ", trans: "In the name of Allah with whose name nothing can harm on earth or in heaven." },
  { cat: "Prophetic", title: "Relief from Anxiety", arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ", trans: "O Allah, I seek refuge in You from anxiety and sorrow." },
  { cat: "Prophetic", title: "Seeking Guidance", arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى", trans: "O Allah, I ask You for guidance, piety, chastity, and self-sufficiency." },
  { cat: "Prophetic", title: "Steadfast Heart", arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ", trans: "O Turner of hearts, keep my heart firm upon Your religion." },
  { cat: "Prophetic", title: "Beneficial Knowledge", arabic: "اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي", trans: "O Allah, benefit me with what You have taught me and teach me what will benefit me." },
  { cat: "Prophetic", title: "Protection from Evil", arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", trans: "I seek refuge in the perfect words of Allah from the evil of what He has created." },
  { cat: "Prophetic", title: "Gratitude", arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ", trans: "O Allah, help me to remember You, thank You, and worship You in the best way." },
  { cat: "Prophetic", title: "Ease of Affairs", arabic: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا", trans: "O Allah, there is no ease except in that which You have made easy." },
  { cat: "Prophetic", title: "Soundness of Character", arabic: "اللَّهُمَّ اهْدِنِي لِأَحْسَنِ الْأَخْلَاقِ", trans: "O Allah, guide me to the best of character." },
  { cat: "Prophetic", title: "Atonement of Assembly", arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ", trans: "Glory be to You O Allah, I bear witness that there is no god but You." },
  { cat: "Prophetic", title: "Entering Home", arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ", trans: "O Allah, I ask You for the best entrance and the best exit." },
  { cat: "Prophetic", title: "Seeking Well-being", arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ", trans: "O Allah, I ask You for well-being in this world and the Hereafter." },
  { cat: "Prophetic", title: "Burden Removal", arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ", trans: "There is no deity except You; Glory be to You, I was indeed among the wrongdoers." },
  { cat: "Prophetic", title: "Purity of Soul", arabic: "اللَّهُمَّ آتِ نَفْسِي تَقْوَاهَا وَزَكِّهَا أَنْتَ خَيْرُ مَنْ زَكَّاهَا", trans: "O Allah, give my soul its piety and purify it; You are the best to purify it." },
  { cat: "Prophetic", title: "Trust in Allah", arabic: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ", trans: "Allah is sufficient for me; there is no deity except Him. In Him I trust." },
  { cat: "Prophetic", title: "Abundant Provision", arabic: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ", trans: "O Allah, suffice me with Your lawful instead of Your forbidden." },

  // --- QURANIC (RABBANA) ---
  { cat: "Quranic", title: "Success in Both Worlds", arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً", trans: "Our Lord, give us in this world that which is good and in the Hereafter that which is good." },
  { cat: "Quranic", title: "Patience and Strength", arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا", trans: "Our Lord, pour upon us patience and plant firmly our feet." },
  { cat: "Quranic", title: "Mercy for Parents", arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", trans: "My Lord, have mercy upon them as they brought me up when I was small." },
  { cat: "Quranic", title: "Acceptance of Deeds", arabic: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ", trans: "Our Lord, accept [this] from us. Indeed You are the Hearing, the Knowing." },
  { cat: "Quranic", title: "Family Comfort", arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ", trans: "Our Lord, grant us from among our wives and offspring comfort to our eyes." },
  { cat: "Quranic", title: "Protection from Fire", arabic: "رَبَّنَا اصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ", trans: "Our Lord, avert from us the punishment of Hell." },
  { cat: "Quranic", title: "Forgiveness for Believers", arabic: "رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ", trans: "Our Lord, forgive us and our brothers who preceded us in faith." },
  { cat: "Quranic", title: "Ease of Speech", arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي", trans: "My Lord, expand for me my breast and ease for me my task." },
  { cat: "Quranic", title: "Increase in Knowledge", arabic: "رَّبِّ زِدْنِي عِلْمًا", trans: "My Lord, increase me in knowledge." },
  { cat: "Quranic", title: "Seeking a Good Outcome", arabic: "تَوَفَّنِي مُسْلِمًا وَأَلْحِقْنِي بِالصَّالِحِينَ", trans: "Cause me to die a Muslim and join me with the righteous." },
  { cat: "Quranic", title: "Light and Forgiveness", arabic: "رَبَّنَا أَتْمِمْ لَنَا نُورَنَا وَاغْفِرْ لَنَا", trans: "Our Lord, perfect for us our light and forgive us." },
  { cat: "Quranic", title: "Firmness in Faith", arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا", trans: "Our Lord, let not our hearts deviate after You have guided us." },
  { cat: "Quranic", title: "Refuge from Evil Whispers", arabic: "رَّبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ", trans: "My Lord, I seek refuge in You from the incitements of the devils." },
  { cat: "Quranic", title: "Mercy from the Lord", arabic: "رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً", trans: "Our Lord, grant us from Yourself mercy." },
  { cat: "Quranic", title: "Safety and Security", arabic: "رَبِّ اجْعَلْ هَٰذَا الْبَلَدَ آمِنًا", trans: "My Lord, make this city secure." },
  { cat: "Quranic", title: "Victory over Disbelief", arabic: "رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِّلَّذِينَ كَفَرُوا", trans: "Our Lord, make us not [objects of] trial for the disbelievers." },
  { cat: "Quranic", title: "True Reliance", arabic: "رَبَّنَا عَلَيْكَ تَوَكَّلْنَا وَإِلَيْكَ أَنَبْنَا", trans: "Our Lord, upon You we have relied, and to You we have returned." },
  { cat: "Quranic", title: "Healing", arabic: "رَبِّ أَنِّي مَسَّنِيَ الضُّرُّ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ", trans: "Indeed, adversity has touched me, and you are the Most Merciful." },
  { cat: "Quranic", title: "Solitude Relief", arabic: "رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنْتَ خَيْرُ الْوَارِثِينَ", trans: "My Lord, do not leave me alone [with no heir], while you are the best of inheritors." },
  { cat: "Quranic", title: "Seeking Just Decision", arabic: "رَبَّنَا افْتَحْ بَيْنَنَا وَبَيْنَ قَوْمِنَا بِالْحَقِّ", trans: "Our Lord, judge between us and our people in truth." },

  // --- GENERAL SPIRITUAL ---
  { cat: "General", title: "Seeking Sincerity", arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أُشْرِكَ بِكَ وَأَنَا أَعْلَمُ", trans: "O Allah, I seek refuge in You from shirk while I am aware." },
  { cat: "General", title: "Protection from Debt", arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْمَأْثَمِ وَالْمَغْرَمِ", trans: "O Allah, I seek refuge in You from sin and heavy debt." },
  { cat: "General", title: "Ease of Difficulty", arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ", trans: "O Ever-Living, O Sustainer, in Your mercy I seek relief." },
  { cat: "General", title: "Inner Peace", arabic: "اللَّهُمَّ اجْعَلْ نَفْسِي مُطْمَئِنَّةً", trans: "O Allah, make my soul peaceful." },
  { cat: "General", title: "Good Ending", arabic: "اللَّهُمَّ اجْعَلْ خَيْرَ عُمْرِي آخِرَهُ", trans: "O Allah, make the best of my life the end of it." },
  { cat: "General", title: "Shield from Greed", arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبُخْلِ وَالْجُبْنِ", trans: "O Allah, I seek refuge in You from stinginess and cowardice." },
  { cat: "General", title: "Closeness to Allah", arabic: "اللَّهُمَّ حَبِّبْ إِلَيْنَا الْإِيمَانَ", trans: "O Allah, make faith dear to us." },
  { cat: "General", title: "Protection from Laziness", arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ", trans: "O Allah, I seek refuge in You from disability and laziness." },
  { cat: "General", title: "Guidance of Hearts", arabic: "اللَّهُمَّ اهْدِ قَلْبِي وَسَدِّدْ لِسَانِي", trans: "O Allah, guide my heart and straighten my tongue." },
  { cat: "General", title: "Seeking Paradise", arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ", trans: "O Allah, I ask You for Paradise and seek refuge in You from Fire." }
];

const DAILY_AYATS = [
  { arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ", ref: "Al-Baqarah 2:152", trans: "So remember Me; I will remember you." },
  { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", ref: "Ash-Sharh 94:6", trans: "Indeed, with hardship [will be] ease." },
  { arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا", ref: "Ta-Ha 20:114", trans: "And say, 'My Lord, increase me in knowledge.'" }
];


export default function QamarFinal() {
  const [localTime, setLocalTime] = useState("");
  const [user, setUser] = useState<{name: string} | null>(null);
  const [isLoginView, setIsLoginView] = useState(true);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [tempName, setTempName] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ayah, setAyah] = useState(DAILY_AYATS[0]);
  const [showIftarMubarak, setShowIftarMubarak] = useState(false);
  const [showSeharMubarak, setShowSeharMubarak] = useState(false);
  const [city, setCity] = useState("Mingora");
  const [timings, setTimings] = useState<any>(null);
  const [cityInput, setCityInput] = useState("");
  const [isExternalCity, setIsExternalCity] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [theme, setTheme] = useState({ bg: "#F5F5F0", text: "#2D2D2A", mode: "Day" });
  const [cd, setCd] = useState({ h: "00", m: "00", s: "00", label: "", progress: 0, sehar: "--:--", iftar: "--:--", timezone: "Asia/Karachi" });
  const [count, setCount] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const controls = useAnimation();
  const [ramadanDay, setRamadanDay] = useState(0);
  const [quranProgress, setQuranProgress] = useState(0);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [fastingLog, setFastingLog] = useState<string[]>([]); // Array of dates like ["2026-02-19"]
  const orbControls = useAnimation();
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [showSuggestionPopup, setShowSuggestionPopup] = useState(false);
  const [tempPass, setTempPass] = useState(""); 
  const [celebrated, setCelebrated] = useState(false);
  const [access, setAccess] = useState(false); // or true if you want it open by default for testing
  const INITIAL_FASTING_DAYS = ["2026-02-19", "2026-02-20", "2026-02-21", "2026-02-22", "2026-02-23", "2026-02-24", "2026-02-25"];
  const [activeTab, setActiveTab] = useState<'tracker' | 'sunnah'>('tracker');
  const supabase = createClient('https://rqcbplnanidhqiwpgzrn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxY2JwbG5hbmlkaHFpd3BnenJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NDEzNzEsImV4cCI6MjA4NTMxNzM3MX0.aikDCClbrh7F5V68uyjUlCuZotedUkeYwdzv8fnvEbA');
  const logout = () => {
    localStorage.removeItem('q_active_session');
    setUser(null);
    setCount(0); // Reset UI state
    setFastingLog([]); // Reset UI state
    setIsLoginView(true);
  };

  const isSunnahDay = () => {
    const day = new Date().getDay();
    return day === 1 || day === 4; // 1 = Monday, 4 = Thursday
  };
  
  const getDayName = () => new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

  // 1. Define the function
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return;
  
  if (Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Permission secured');
    }
  }
};



 
  const [holdProgress, setHoldProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showResetRing, setShowResetRing] = useState(false);
  const startPress = () => {
    setHoldProgress(0);
    setShowResetRing(false);

  // 1. Delay the appearance of the red ring to prevent flickering on taps
  timerRef.current = setTimeout(() => {
    setShowResetRing(true);
  }, 200);


    // 1. Handle the actual Reset Logic
    timerRef.current = setTimeout(() => {
      setCount(0);
      sync({ count: 0 });
      setHoldProgress(0); // Reset ring after pop
      controls.start({ scale: [1, 1.2, 1], transition: { duration: 0.3 } });
    }, 1500);
  
    // 2. Handle the Visual Ring Animation (Updates every 10ms for smoothness)
    const startTime = Date.now();
    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / 1500) * 100, 100);
      setHoldProgress(progress);
      if (progress >= 100) clearInterval(holdIntervalRef.current!);
    }, 10);
  };
  
  const endPress = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    setHoldProgress(0); // Snap ring back to 0 if they let go
  };
// this is for offline loading of the app
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((registration) => {
          console.log('SW registered:', registration);
        }).catch((error) => {
          console.log('SW registration failed:', error);
        });
      });
    }
  }, []);



  const [isNightTime, setIsNightTime] = useState(false);

useEffect(() => {
  const checkTime = () => {
    const currentHour = new Date().getHours();
    // 18 is 6:00 PM. This will be true from 6:00 PM to 11:59 PM.
    // If you want it to show until Fajr (e.g., 5 AM), use: (currentHour >= 18 || currentHour < 5)
    setIsNightTime(currentHour >= 18);
  };

  checkTime();
  // Optional: Check every minute in case the user leaves the page open
  const interval = setInterval(checkTime, 60000); 
  return () => clearInterval(interval);
}, []);

useEffect(() => {
  if (!user) return; // Guard clause inside the hook instead of outside

  const handleOnline = () => {
    const raw = localStorage.getItem('qamar_vault_cache');
    if (raw) {
      const data = JSON.parse(raw);
      if (data.unsynced) {
        sync({
          count: data.tasbeeh_count,
          log: data.fasting_days,
          quran: data.quran_progress,
          checks: data.ritual_checks
        });
      }
    }
  };

  window.addEventListener('online', handleOnline);
  return () => window.removeEventListener('online', handleOnline);
}, [user]); // ✅ Always keep [user] here, even if user is null

  const handleAuth = async () => {
    if (!tempName || !tempPass) return alert("Fill all fields");
    const cleanName = tempName.toLowerCase().trim();
    setAuthLoading(true);
  
    // 1. IMPROVED GEO-FETCH
    let userCity = "Unknown City";
    try {
      // Try primary service
      const geoRes = await fetch('https://ipapi.co/json/').catch(() => null);
      if (geoRes && geoRes.ok) {
        const geoData = await geoRes.json();
        userCity = geoData.city || "Unknown City";
      } else {
        // Fallback service if first one fails
        const backupRes = await fetch('http://ip-api.com/json/').catch(() => null);
        if (backupRes && backupRes.ok) {
          const backupData = await backupRes.json();
          userCity = backupData.city || "Unknown City";
        }
      }
    } catch (err) {
      userCity = "Mingora (Est)"; // Default fallback for your region
    }
  
    if (isRegistering) {
      // --- REGISTRATION LOGIC ---
  
      // 2. CHECK IF NAME IS TAKEN BY ANYONE (Regardless of Password)
      const { data: similarUsers } = await supabase
        .from('user_vaults')
        .select('user_name')
        .ilike('user_name', `${cleanName}%`);
  
      const nameExists = similarUsers?.find(u => u.user_name === cleanName);
  
      if (nameExists) {
        // 3. GENERATE UNIQUE SUGGESTION (Checks against all existing names)
        const existingNames = similarUsers?.map(u => u.user_name) || [];
        let counter = 1;
        let newSug = `${cleanName}${counter}`;
        
        // Keep incrementing until we find a name NOT in the list
        while (existingNames.includes(newSug)) {
          counter++;
          newSug = `${cleanName}${counter}`;
        }
  
        setSuggestion(newSug);
        setShowSuggestionPopup(true);
        setAuthLoading(false);
        return;
      }
  
      // 4. CREATE NEW VAULT
      const { error: insertError } = await supabase.from('user_vaults').insert([{
        user_name: cleanName,
        password: tempPass,
        tasbeeh_count: 0,
        fasting_days: INITIAL_FASTING_DAYS,
        last_active: new Date().toISOString(),
        last_location: userCity
      }]);
  
      if (!insertError) {
        await loadUserData(cleanName, tempPass);
      } else {
        alert("Registration failed. Please try a different name.");
        setAuthLoading(false);
      }
  
    } else {
      // --- LOGIN LOGIC ---
      const { data: vault } = await supabase
        .from('user_vaults')
        .select('*')
        .eq('user_name', cleanName)
        .eq('password', tempPass)
        .single();
  
      if (!vault) {
        alert("Invalid Identity or Pass-Key.");
        setAuthLoading(false);
      } else {
        // Update location and time on login
        await supabase.from('user_vaults')
          .update({ last_active: new Date().toISOString(), last_location: userCity })
          .eq('id', vault.id);
          
        await loadUserData(cleanName, tempPass);
      }
    }
  };
  
  useEffect(() => {
    // This runs ONCE when the app first opens
    if (city === "Mingora") {
      fetchCityTimings("Mingora");
    }
  }, []); // Empty brackets mean "run on load"


  // useEffect(() => {
  //   // Guard: Only proceed if timings is an OBJECT and has Maghrib
  //   if (!timings || typeof timings !== 'object' || !timings.Maghrib) return;
  
  //   const interval = setInterval(() => {
  //     try {
  //       if (!timings?.Maghrib || typeof timings.Maghrib !== 'string') return;
  
  //       const now = new Date();
  //       const maghribValue = timings.Maghrib;
  //       const [h, m] = maghribValue.split(':');
        
  //       const iftarTime = new Date();
  //       iftarTime.setHours(parseInt(h), parseInt(m), 0);
  
  //       const diffInMins = Math.floor((iftarTime.getTime() - now.getTime()) / 60000);
  
  //       if (diffInMins === 5) {
  //         if (Notification.permission === 'granted') {
  //           navigator.serviceWorker.ready.then(reg => {
  //             reg.showNotification("Iftar Approaching 🌙", {
  //               body: "5 minutes until Iftar. Get prepared.",
  //               vibrate: [200, 100, 200]
  //             });
  //           });
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Timer error:", err);
  //     }
  //   }, 60000);
  
  //   return () => clearInterval(interval);
  // }, [timings]);

  useEffect(() => {
    if (!timings || typeof timings !== 'object' || !timings.Maghrib || !timings.Fajr) return;
  
    const interval = setInterval(() => {
      try {
        const now = new Date();
        
        // --- 1. IFTAR CALCULATION ---
        const [iH, iM] = timings.Maghrib.split(':');
        const iftarTime = new Date();
        iftarTime.setHours(parseInt(iH), parseInt(iM), 0);
        const iftarDiff = Math.floor((iftarTime.getTime() - now.getTime()) / 60000);
  
        // --- 2. SUHOOR CALCULATION ---
        const [sH, sM] = timings.Fajr.split(':');
        const suhoorTime = new Date();
        suhoorTime.setHours(parseInt(sH), parseInt(sM), 0);
        const suhoorDiff = Math.floor((suhoorTime.getTime() - now.getTime()) / 60000);
  
        // DEBUG: See the minutes in your console (F12)
        console.log(`Minutes until Iftar: ${iftarDiff} | Minutes until Suhoor ends: ${suhoorDiff}`);
  
        if (Notification.permission === 'granted') {
          // Iftar Alert (5 mins before)
          if (iftarDiff === 2) {
            sendNotification("Iftar Approaching 🌙", "5 minutes until Iftar. Get prepared!");
          }
          
          // Suhoor Alert (5 mins before Fajr)
          if (suhoorDiff === 5) {
            sendNotification("Suhoor Ending ⏳", "5 minutes until Suhoor ends. Finish your meal!");
          }
  
          // --- TESTING MODE: Trigger immediately if diff is positive ---
          // Change the '5' to '> 0' only for a quick 1-minute test
          if (iftarDiff > 0 && iftarDiff < 1440) { 
             console.log("Test: Iftar is in the future today.");
          }
        }
      } catch (e) {
        console.error("Timer error:", e);
      }
    }, 60000);
  
    return () => clearInterval(interval);
  }, [timings]);
  
  // Helper function to keep code clean
  const sendNotification = (title: string, body: string) => {
    if (!('serviceWorker' in navigator)) return;
  
    navigator.serviceWorker.ready.then(reg => {
      reg.showNotification(title, {
        body,
        icon: "/icon.png",
        tag: title.toLowerCase().replace(/\s/g, '-'),
        // Casting 'as any' fixes the TypeScript error while keeping the vibration on mobile
        vibrate: [200, 100, 200],
      } as any); 
    });
  };

  const hasInitialized = useRef(false);
  const audioCtx = useRef<AudioContext | null>(null);

  const playTone = (freq: number, type: OscillatorType, duration: number) => {
    if (!soundEnabled) return;
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
    osc.connect(gain); gain.connect(audioCtx.current.destination);
    gain.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.current.currentTime + duration);
    osc.start(); osc.stop(audioCtx.current.currentTime + duration);
  };
    
  // 1. HEARTBEAT LOGIC: Only active when NOT tapping
  useEffect(() => {
    const startHeartbeat = async () => {
      await controls.start({
        scale: [1, 1.05, 1],
        opacity: [0.4, 0.7, 0.4],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      });
    };
    startHeartbeat();
  }, [controls]);

  useEffect(() => {
    const checkIftarAutoMark = () => {
      const today = new Date().toISOString().split('T')[0];
      
      // 1. Only proceed if today isn't already marked
      if (!fastingLog.includes(today)) {
        
        // 2. Parse current time and Iftar time
        const [iftarH, iftarM] = cd.iftar.split(':').map(Number);
        const now = new Date();
        const nowH = now.getHours();
        const nowM = now.getMinutes();
  
        // 3. Logic: If current time is past Iftar time
        if (nowH > iftarH || (nowH === iftarH && nowM >= iftarM)) {
          const newLog = [...fastingLog, today];
          setFastingLog(newLog);
          sync({ log: newLog }); // Save to Supabase
          
          // Show the celebration!
          if (typeof setShowIftarMubarak === 'function') {
             setShowIftarMubarak(true);
          }
        }
      }
    };
  
    // Check every minute
    const timer = setInterval(checkIftarAutoMark, 60000); 
    return () => clearInterval(timer);
  }, [cd.iftar, fastingLog]);

  // 2. DHIKR HANDLER: Color Shift + Burst + Growth
  const handleDhikr = async () => {
    const nextCount = count + 1;
    setCount(nextCount);
    sync({ count: nextCount });
    // Pulse the orb on every tap
    controls.start({
      scale: 1.2,
      transition: { type: "spring", stiffness: 300, damping: 15 }
    });

    // MILESTONE BURST (33, 100, etc.)
    if (nextCount % 33 === 0) {
      const newParticles = Array.from({ length: 12 }).map((_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 300,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 800);
      playTone(880, 'sine', 0.2); // Success tone
    } else {
      playTone(440, 'sine', 0.1);
    }
  };

  // 3. COLOR LOGIC: Dim Amber to Brilliant Gold
  const getOrbColor = () => {
    const progress = (count % 100) / 100;
    // Interpolating between Amber (#FFBF00) and White-Gold (#FFF9E3)
    if (progress < 0.5) return "rgba(255, 191, 0, 0.3)";
    return "rgba(255, 249, 227, 0.9)";
  };

  // const getOrbColor = () => {
  //   if (count >= 30) return '#a855f7'; // Royal Purple for 10k+
  //   if (count >= 20) return '#3b82f6';  // Deep Blue for 5k+
  //   if (count >= 10) return '#f59e0b';  // Golden Amber for 1k+
  //   return theme.accent; // Default (Emerald/Green)
  // };
  const [detectedRegion, setDetectedRegion] = useState(""); // NEW: Stores the actual location found
  const [isSearching, setIsSearching] = useState(false);

  const fetchCityTimings = async (targetCity: any) => {
    setErrorMsg("");
    setIsSearching(true);
    const sanitized = targetCity.trim().toLowerCase();
  
    // --- SPECIAL CASE: MINGORA HARDCODED TRUTH ---
    if (sanitized === "mingora") {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0]; // "2026-02-22"
      const localTimings = MINGORA_TIMINGS[dateStr] || MINGORA_TIMINGS["2026-02-22"];
      
      // FIX HERE: Save the localTimings object, not the sanitized string
    setTimings({
      Maghrib: localTimings.iftar, // Map your 'iftar' to 'Maghrib' for the notification
      Fajr: localTimings.sehar,
      ...localTimings
    });

      // Calculate Day 4 (Feb 22 - 18 = 4)
      const dayOfMonth = now.getDate();
      const month = now.getMonth(); // 1 = Feb, 2 = March
      const day = now.getDate();

      let ramadanDayCalc = 0;

      if (month === 1) { 
        // February Logic: Starts Feb 19 (Day 1)
        ramadanDayCalc = day - 18; 
      } else if (month === 2) { 
        // March Logic: Feb had 28 days. (28 - 18) = 10 days in Feb.
        // So Day 1 of March is Day 11 of Ramadan.
        ramadanDayCalc = day + 10; 
      }

      setRamadanDay(ramadanDayCalc);
      
      setCity("Mingora");
      setIsExternalCity(false); // Tell engine to use local logic
      setCd(prev => ({
        ...prev,
        sehar: localTimings.sehar,
        iftar: localTimings.iftar,
        timezone: "Asia/Karachi"
      }));
      setDetectedRegion("Mingora, Swat (Local)");
      setIsSearching(false);
      return;
    }
  
    // --- GLOBAL CASE: API TRUTH ---
    try {
      const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${targetCity}&country=&method=3`);
      const data = await res.json();
      
      if (data.status === "OK") {
        setRamadanDay(parseInt(data.data.date.hijri.day));
        setCity(targetCity);
        setIsExternalCity(true);
        setCd(prev => ({ 
          ...prev, 
          sehar: data.data.timings.Fajr, 
          iftar: data.data.timings.Maghrib,
          timezone: data.data.meta.timezone 
        }));
        setDetectedRegion(data.data.meta.timezone);
      }
    } catch (e) {
      setErrorMsg("City not found");
    } finally {
      setIsSearching(false);
    }
  };
  const updateEngine = useCallback(() => {
    // 1. Get current time in the TARGET city (or local if Mingora)
  const cityTimeStr = new Date().toLocaleString("en-US", { 
    timeZone: isExternalCity ? cd.timezone : "Asia/Karachi",
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true

  });
  setLocalTime(cityTimeStr); // This updates the small clock
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: cd.timezone }));
      

    
    const dateStr = now.toISOString().split('T')[0];
    let timings = MINGORA_TIMINGS[dateStr] || MINGORA_TIMINGS["2026-03-19"];

  // 2. Get Timings
  let seharStr, iftarStr;
  if (isExternalCity) {
    seharStr = cd.sehar;
    iftarStr = cd.iftar;
  } else {
    const t = MINGORA_TIMINGS[dateStr] || MINGORA_TIMINGS["2026-03-19"];
    seharStr = t.sehar;
    iftarStr = t.iftar;
  }

    const [sH, sM] = (isExternalCity ? cd.sehar : timings.sehar).split(':').map(Number);
    const [iH, iM] = (isExternalCity ? cd.iftar : timings.iftar).split(':').map(Number);
    
    const seharDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sH, sM);
    const iftarDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), iH, iM);


    
    const hr = now.getHours();
    if (hr >= 18 || hr < 5) setTheme({ bg: "#F5F5F0", text: "#2D2D2A", mode: "Night" });
    else setTheme({ bg: "#F5F5F0", text: "#2D2D2A", mode: "Day" });

    let diff = 0;
    let label = "";

    if (now < seharDate) {
      diff = seharDate.getTime() - now.getTime();
      label = "UNTIL SEHAR";
    } else if (now < iftarDate) {
      diff = iftarDate.getTime() - now.getTime();
      label = "UNTIL IFTAR";
    } else {
      const nextSeharDate = new Date(seharDate.getTime() + 24 * 60 * 60 * 1000);
      diff = nextSeharDate.getTime() - now.getTime();
      label = "UNTIL NEXT SEHAR";
    }

    if (diff <= 2000 && diff > -2000 && label === "UNTIL IFTAR") {
      const today = new Date().toISOString().split('T')[0];
      
      if (!fastingLog.includes(today)) {
          const newLog = [...fastingLog, today];
          setFastingLog(newLog);
          sync({ log: newLog }); // Save to your LocalStorage vault
      }

      // Inside your updateEngine useCallback:

const nowInCity = new Date(new Date().toLocaleString("en-US", { timeZone: cd.timezone }));
const [sH, sM] = cd.sehar.split(':').map(Number);
const [iH, iM] = cd.iftar.split(':').map(Number);

const seharDate = new Date(nowInCity.getFullYear(), nowInCity.getMonth(), nowInCity.getDate(), sH, sM);
const iftarDate = new Date(nowInCity.getFullYear(), nowInCity.getMonth(), nowInCity.getDate(), iH, iM);

    
if (diff <= 2000 && diff > -2000 && !celebrated) {
  if (label === "UNTIL IFTAR") {
    setCelebrated(true);
    setShowIftarMubarak(true);
    setTimeout(() => { setShowIftarMubarak(false); setCelebrated(false); }, 8000);
    playTone(523, 'sine', 1);
  } else if (label === "UNTIL SEHAR") {
    setCelebrated(true);
    setShowSeharMubarak(true);
    setTimeout(() => { setShowSeharMubarak(false); setCelebrated(false); }, 8000);
    playTone(659, 'sine', 1);
  }
}}

    setCd(prev => ({
      ...prev,
      h: Math.floor(diff / 3600000).toString().padStart(2, '0'),
      m: Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0'),
      s: Math.floor((diff % 60000) / 1000).toString().padStart(2, '0'),
      label,
      sehar: isExternalCity ? prev.sehar : timings.sehar,
      iftar: isExternalCity ? prev.iftar : timings.iftar
    }));
  }, [isExternalCity, cd.sehar, cd.iftar, cd.timezone]);

  useEffect(() => {
    if (!soundEnabled) return;
  
    // Audio nodes
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
  
    // Create a low-frequency drone for atmosphere
    osc.type = 'sine';
    osc.frequency.setValueAtTime(cd.label === "UNTIL SEHAR" ? 110 : 174, audioCtx.currentTime);
    
    // Very soft volume (atmospheric background)
    gain.gain.setValueAtTime(0.02, audioCtx.currentTime); 
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
  
    return () => {
      osc.stop();
      audioCtx.close();
    };
  }, [cd.label, soundEnabled]);

  useEffect(() => {
    const timer = setInterval(updateEngine, 1000);
    // updateEngine();
    if (!hasInitialized.current) {
      const session = localStorage.getItem('q_active_session');
      const savedPass = localStorage.getItem('q_active_pass'); // Get the password too
      if (session && savedPass) loadUserData(session, savedPass);
      // Only auto-login if both exist
    if (session && savedPass) {
      loadUserData(session, savedPass); 
    }
      hasInitialized.current = true;
    }
    return () => clearInterval(timer);
  }, [updateEngine]);

  const [authLoading, setAuthLoading] = useState(false);

  const loadUserData = async (name: string, passwordInput: string) => {
    setAuthLoading(true);
    const cleanName = name.toLowerCase().trim();
    
    // 1. LOOK FOR EXACT MATCH
    let { data: vault, error } = await supabase
      .from('user_vaults')
      .select('*')
      .eq('user_name', cleanName)
      .eq('password', passwordInput)
      .single();
  
    if (!vault) {
      // 2. CHECK IF NAME IS TAKEN
      let { data: nameCheck } = await supabase
        .from('user_vaults')
        .select('user_name')
        .eq('user_name', cleanName)
        .single();
  
      if (nameCheck) {
        alert("This name is already registered. Please use your correct password or a different name.");
        setAuthLoading(false);
        return;
      }
  
      // 3. REGISTER NEW USER
      const { data: newUser } = await supabase
        .from('user_vaults')
        .insert([{ 
          user_name: cleanName, 
          password: passwordInput,
          tasbeeh_count: 0,
          fasting_days: INITIAL_FASTING_DAYS
        }])
        .select().single();
      vault = newUser;
    }
  
    // 4. PREPARE DATA
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    let updatedLog = [...(vault.fasting_days || [])];
  
    const timings = MINGORA_TIMINGS[dateStr];
    if (timings) {
      const [iH, iM] = timings.iftar.split(':').map(Number);
      const iftarTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), iH, iM);
      if (now > iftarTime && !updatedLog.includes(dateStr)) {
        updatedLog.push(dateStr);
      }
    }
  
    const missingDays = INITIAL_FASTING_DAYS.filter(day => !updatedLog.includes(day));
    if (missingDays.length > 0) {
        updatedLog = [...updatedLog, ...missingDays];
    }
  
    // 5. FINALIZE UI STATE
    setCount(vault.tasbeeh_count || 0);
    setFastingLog(updatedLog);
    setQuranProgress(vault.quran_progress || 0);
    setCheckedItems(vault.ritual_checks || []); // Load your sunnah checks too!
    setUser({ name: cleanName }); // Setting state as an object so user.name works in UI
  
    // 6. NOTIFICATIONS & PWA
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted' && 'serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js');
        }
      });
    }
    
    // 7. STORAGE MANAGEMENT
    // Keep the session key as a simple string so it doesn't break your UI
    localStorage.setItem('q_active_session', cleanName);
    localStorage.setItem('q_active_pass', passwordInput);
  
    // Initialize the Offline Cache with a clean object
    const offlineCache = {
      user_name: cleanName,
      tasbeeh_count: vault.tasbeeh_count || 0,
      fasting_days: updatedLog,
      quran_progress: vault.quran_progress || 0,
      ritual_checks: vault.ritual_checks || [],
      unsynced: false
    };
    localStorage.setItem('qamar_vault_cache', JSON.stringify(offlineCache));
  
    setAuthLoading(false);
    setIsLoginView(false);
    setShowWelcome(true);
    setTimeout(() => setShowWelcome(false), 2500);
  
    // Trigger one sync to ensure the "Bonus Days" or Iftar auto-marks are saved to DB
    sync({ log: updatedLog }); 
  };

const sync = async (payload: any) => {
  const sessionName = localStorage.getItem('q_active_session');
  if (!sessionName) return;

  // 1. GET CURRENT LOCAL DATA (to avoid overwriting other fields)
  let localData: any = {};
  try {
    const raw = localStorage.getItem('qamar_vault_cache');
    localData = raw ? JSON.parse(raw) : {};
  } catch (e) {
    localData = {};
  }

  // 2. PREPARE THE UPDATE PAYLOAD
  const updatePayload: any = {
    ...localData, // Keep existing cached data
    last_active: new Date().toISOString(),
    unsynced: !navigator.onLine // Flag to track if cloud is behind
  };

  // Map incoming payload to Database columns
  if (payload.count !== undefined) updatePayload.tasbeeh_count = payload.count;
  if (payload.log !== undefined) updatePayload.fasting_days = payload.log;
  if (payload.quran !== undefined) updatePayload.quran_progress = payload.quran;
  if (payload.checks !== undefined) updatePayload.ritual_checks = payload.checks;
  
  if (payload.sunnah_completed !== undefined) {
    updatePayload.last_nightly_sunnah = payload.sunnah_completed;
    updatePayload.tahajjud_intent = payload.tahajjud_intent;
  }

  // 3. SAVE TO LOCAL STORAGE IMMEDIATELY (Offline Safety)
  localStorage.setItem('qamar_vault_cache', JSON.stringify(updatePayload));

  // 4. PUSH TO SUPABASE (Only if Online)
  if (navigator.onLine) {
    try {
      // Update Main Vault
      const { error: vaultError } = await supabase
        .from('user_vaults')
        .update({
           tasbeeh_count: updatePayload.tasbeeh_count,
           fasting_days: updatePayload.fasting_days,
           quran_progress: updatePayload.quran_progress,
           ritual_checks: updatePayload.ritual_checks,
           last_nightly_sunnah: updatePayload.last_nightly_sunnah,
           tahajjud_intent: updatePayload.tahajjud_intent,
           last_active: updatePayload.last_active
        })
        .eq('user_name', sessionName.toLowerCase().trim());

      // If sunnah data exists, upsert to the Registry too
      if (payload.sunnah_completed !== undefined) {
        const today = new Date().toISOString().split('T')[0];
        await supabase
          .from('nightly_registry')
          .upsert({ 
              user_name: sessionName.toLowerCase().trim(), 
              date: today, 
              intent: payload.tahajjud_intent,
              completed_items: payload.sunnah_completed,
            }, 
            { onConflict: 'user_name,date' }
          );
      }

      if (!vaultError) {
        console.log("Cloud Synchronized Successfully ✅");
        // Mark as synced locally
        updatePayload.unsynced = false;
        localStorage.setItem('qamar_vault_cache', JSON.stringify(updatePayload));
      }
    } catch (err) {
      console.error("Network request failed. Data remains cached locally.");
    }
  } else {
    console.log("Offline: Changes saved to local cache. Will sync when online.");
  }
};

// const sync = async (payload: any) => {
//   const sessionName = localStorage.getItem('q_active_session');
//   if (!sessionName) return;

  // 1. Prepare the data for the 'user_vaults' table
  // const updatePayload: any = {
  //   last_active: new Date().toISOString()
  // };

  // if (payload.count !== undefined) updatePayload.tasbeeh_count = payload.count;
  // if (payload.log !== undefined) updatePayload.fasting_days = payload.log;
  // if (payload.quran !== undefined) updatePayload.quran_progress = payload.quran;
  
  // ADDED: Handle the Rituals (Tahajjud, Sadaqah, etc.)
  // if (payload.checks !== undefined) updatePayload.ritual_checks = payload.checks;

  // ADDED: Handle the Sunnatul Layl (Nightly Diary) 
  // We store the most recent night's data in the vault
  // if (payload.sunnah_completed !== undefined) {
  //   updatePayload.last_nightly_sunnah = payload.sunnah_completed;
  //   updatePayload.tahajjud_intent = payload.tahajjud_intent;

    // This is the part that fills the History/Registry
  //   const { error: regError } = await supabase
  //     .from('nightly_registry')
  //     .insert([{
  //       user_name: sessionName.toLowerCase(), // Ensure this matches user_vaults user_name
  //       completed_items: payload.sunnah_completed,
  //       intent: payload.tahajjud_intent,
  //       date: new Date().toISOString().split('T')[0] // explicitly set the date
  //     }]);
  // }

  // const saveToRegistry = async () => {
  //   const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  //   const { error } = await supabase
  //     .from('nightly_registry')
  //     .upsert({ 
  //         user_name: user, 
  //         date: today, 
  //         intent: payload.tahajjud_intent,
  //         completed_items: payload.sunnah_completed,
  //       }, 
  //       { onConflict: 'user_name,date' } // This prevents duplicates!
  //     );
  // };

  // 2. Push to Supabase
//   const { error } = await supabase
//     .from('user_vaults')
//     .update(updatePayload)
//     .eq('user_name', sessionName.toLowerCase());

//   if (error) {
//     console.error("Sync Error:", error.message);
//   } else {
//     console.log("Vault Synchronized Successfully");
//   }
// };

  if (isLoginView) return (
    <div className="min-h-screen bg-[#EBE7D9] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#B4C2A8] opacity-20 blur-3xl" />
      
      <div className="max-w-md w-full relative">
        <header className="mb-12">
          {/* The "Barakah" Glow - only appears when authLoading is true */}
  {authLoading && (
    <motion.div 
      layoutId="glow"
      className="absolute -inset-8 bg-[#B4C2A8]/20 blur-3xl rounded-full"
      animate={{ 
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.6, 0.3] 
      }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  )}

  <div className="relative">
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-7xl font-serif italic text-[#2D3328] tracking-tighter leading-[0.8]">
        Ramadan
        <motion.span 
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block ml-2 text-[#B4C2A8]"
        >
          <Moon size={32} fill="currentColor" />
        </motion.span>
      </h1>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="flex items-center gap-3 mt-2"
    >
      <div className="h-[1px] w-8 bg-[#2D3328]/20" />
      <span className="text-xl font-sans font-light text-[#2D3328]/60 uppercase tracking-[0.6em]">
        Tracker
      </span>
      <div className="flex gap-1">
        {[...Array(3)].map((_, i) => (
          <motion.div 
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ delay: i * 0.2, repeat: Infinity, duration: 1.5 }}
            className="w-1 h-1 rounded-full bg-[#B4C2A8]"
          />
        ))}
      </div>
    </motion.div>
  </div>
    
  {isSunnahDay() && (
  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-3 rounded-xl text-sm mb-4 flex items-center gap-2">
    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
    Today is {getDayName()} — A Sunnah Day for Fasting.
  </div>
)}

          {/* UNIQUE ANIMATED TOGGLE */}
<div className="relative mt-12 w-[220px] bg-[#2D3328]/5 p-1 rounded-full flex items-center cursor-pointer border border-[#2D3328]/5 overflow-hidden">
  <motion.div 
    className="absolute h-[calc(100%-8px)] bg-white rounded-full shadow-sm"
    initial={false}
    animate={{ 
      x: isRegistering ? "102px" : "4px", // Precise pixel tracking
      width: isRegistering ? "110px" : "100px" 
    }}
    transition={{ type: "spring", stiffness: 350, damping: 30 }}
  />
  <button 
    type="button"
    onClick={() => setIsRegistering(false)}
    className={`relative z-10 w-[105px] py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${!isRegistering ? 'text-[#2D3328]' : 'text-[#2D3328]/30'}`}
  >
    Login
  </button>
  <button 
    type="button"
    onClick={() => setIsRegistering(true)}
    className={`relative z-10 w-[115px] py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${isRegistering ? 'text-[#2D3328]' : 'text-[#2D3328]/30'}`}
  >
    Register
  </button>
</div>
        </header>
  
        <form onSubmit={(e) => { e.preventDefault(); handleAuth(); }} className="space-y-12">
          <div className="relative group">
            <input 
              className="w-full bg-transparent border-b border-[#2D3328]/20 py-4 outline-none text-2xl font-light text-[#2D3328] placeholder:opacity-20 transition-all focus:border-[#2D3328]" 
              placeholder="Identity" 
              value={tempName} 
              onChange={(e) => setTempName(e.target.value)} 
            />
          </div>
  
          <div className="relative group">
            <input 
              type="password"
              className="w-full bg-transparent border-b border-[#2D3328]/20 py-4 outline-none text-2xl font-light text-[#2D3328] placeholder:opacity-20 transition-all focus:border-[#2D3328]" 
              placeholder="Pass-Key" 
              value={tempPass} 
              onChange={(e) => setTempPass(e.target.value)} 
            />
          </div>
  
          <button className="group flex items-center gap-6 pt-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full border border-[#2D3328] flex items-center justify-center group-hover:bg-[#2D3328] group-hover:text-[#EBE7D9] transition-all duration-500"
            >
              <ArrowRight size={24} />
            </motion.div>
            <div className="text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#2D3328]">
                 {isRegistering ? "Establish Vault" : "Verify Access"}
              </span>
            </div>
          </button>
        </form>
      </div>
      <AnimatePresence>
  {showSuggestionPopup && (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#2D3328]/20 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-[#FCFBF7] p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full border border-[#2D3328]/10 text-center"
      >
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="text-amber-600" size={24} />
        </div>
        
        <h3 className="text-xl font-serif italic text-[#2D3328] mb-2">Identity Exists</h3>
        <p className="text-[10px] text-[#2D3328] font-black uppercase tracking-widest opacity-50 mb-8 leading-relaxed">
          This username is already taken. Would you like to use this unique identity instead?
        </p>

        <button 
          onClick={() => {
            if(suggestion) setTempName(suggestion);
            setShowSuggestionPopup(false);
          }}
          className="w-full bg-[#2D3328] text-[#EBE7D9] py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] mb-4 hover:bg-[#3d4536] transition-colors"
        >
          Use "{suggestion}"
        </button>

        <button 
          onClick={() => setShowSuggestionPopup(false)}
          className="text-[12px] text-[#2d3328] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );

  if (authLoading) return (
    <div className="min-h-screen bg-[#EBE7D9] flex items-center justify-center">
      <motion.div 
        animate={{ opacity: [0.4, 1, 0.4] }} 
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-[10px] font-black uppercase tracking-[0.5em] text-[#2D3328]"
      >
        Unlocking Vault...
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen transition-colors duration-1000 font-sans relative overflow-hidden" style={{ backgroundColor: theme.bg, color: theme.text }}>
      <AnimatePresence mode="wait">
        {activeTab === 'tracker' ? (
          /* DAY TRACKER VIEW */
          <motion.div 
            key="tracker" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="p-4 md:p-12 pb-24"
          >
            <header className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-current/10 pb-8">
              <div>
                <h1 className="text-3xl font-black italic uppercase leading-none">{user?.name}</h1>
                <p className="text-[9px] font-black opacity-20 uppercase tracking-[0.3em] mt-2">The Basirah Companion</p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-3 opacity-40 hover:opacity-100">
                  {soundEnabled ? <Volume2 size={18}/> : <VolumeX size={18}/>}
                </button>
                
                <button 
                  onClick={() => setArchiveOpen(true)} 
                  className="group px-6 py-2 font-black text-[10px] uppercase border-2 border-current hover:bg-current transition-all overflow-hidden relative"
                >
                  <span className="relative z-10 transition-colors duration-200 group-hover:text-[var(--bg)]" style={{ '--bg': theme.bg } as any}>Archives</span>
                </button>
  
                <button onClick={() => { 
                  localStorage.removeItem('q_active_session'); 
                  localStorage.removeItem('q_active_pass');
                  window.location.reload(); }} 
                  className="p-3 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all">
                  <LogOut size={18}/>
                </button>
              </div>
            </header>
  
            <div className="max-w-6xl mx-auto mb-6 flex flex-col gap-2 mt-16 md:mt-0">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 max-w-xs">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isSearching ? 'animate-pulse' : 'opacity-40'}`} size={14} />
                  <input 
                    className="w-full bg-[#2D3328]/10 border-2 border-[#2D3328]/5 focus:border-[#2D3328]/20 rounded-full py-2.5 pl-10 pr-4 text-xs font-bold outline-none transition-all placeholder:text-[#2D3328]/30" 
                    placeholder="Search City or Region..." 
                    value={cityInput} 
                    style={{ color: theme.text }}
                    onChange={(e) => setCityInput(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && fetchCityTimings(cityInput)} 
                  />
                </div>
  
                <AnimatePresence>
                  {detectedRegion && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 bg-green-500/10 text-green-500 px-4 py-2 rounded-full border border-green-500/20 text-[10px] font-black uppercase"
                    >
                      <CheckCircle2 size={12} />
                      Mapped to: {detectedRegion}
                    </motion.div>
                  )}
                </AnimatePresence>
  
                {errorMsg && (
                  <div className="text-red-500 text-[10px] font-black uppercase flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
                    <AlertTriangle size={12}/> {errorMsg}
                  </div>
                )}
              </div>
            </div>
  
            <div className="max-w-6xl mx-auto mb-12 grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 border-2 p-8 md:p-12 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8" style={{ borderColor: theme.text + "15" }}>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black tracking-[0.4em] opacity-30 italic uppercase">
                      {cd.label} @ {city.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 bg-current/5 rounded-full text-[9px] font-bold opacity-60">
                      Local: {localTime}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-7xl md:text-9xl font-black italic tracking-tighter tabular-nums">{cd.h}</span>
                    <span className="text-3xl opacity-20 font-light">:</span>
                    <span className="text-7xl md:text-9xl font-black italic tracking-tighter tabular-nums">{cd.m}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-6 text-right w-full md:w-auto">
                  <div className="flex items-center justify-between md:justify-end gap-6 border-b border-current/10 pb-2">
                    <Sunrise size={18} className="opacity-30" />
                    <div className="text-right leading-none"><span className="text-[8px] font-black opacity-30 block mb-1">SUHOOR</span><span className="text-2xl font-black italic">{cd.sehar}</span></div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <Sunset size={18} className="opacity-30" />
                    <div className="text-right leading-none"><span className="text-[8px] font-black opacity-30 block mb-1">IFTAR</span><span className="text-2xl font-black italic">{cd.iftar}</span></div>
                  </div>
                </div>
              </div>
              <div className="border-2 p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center bg-current/[0.02]" style={{ borderColor: theme.text + "15" }}>
                <Moon size={28} className="opacity-40 mb-4" />
                <span className="text-[9px] font-black opacity-30 uppercase tracking-widest mb-1">Ramadan_Day</span>
                <span className="text-4xl font-black italic">{ramadanDay.toString().padStart(2, '0')}<span className="text-lg opacity-20">/30</span></span>
              </div>
            </div>
  
            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
            <section className="lg:col-span-7">
  <div className="border-2 p-16 text-center rounded-[3rem] relative flex flex-col items-center justify-center min-h-[500px]" style={{ borderColor: theme.text }}>

    <div 
      className="relative cursor-pointer" 
      onClick={handleDhikr} // Single tap to count
      onMouseDown={startPress} // Desktop hold
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress} // Mobile hold
      onTouchEnd={endPress}
    >
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div key={p.id} initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }} exit={{ opacity: 0 }} className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full z-10" style={{ backgroundColor: getOrbColor() }} />
        ))}
      </AnimatePresence>

      <motion.div 
        animate={controls}
        className="w-64 h-64 rounded-full relative flex flex-col items-center justify-center transition-transform active:scale-95"
        style={{ 
          background: `radial-gradient(circle, ${getOrbColor()} 0%, transparent 70%)`,
          boxShadow: `0 0 ${20 + (count % 33) * 2}px ${getOrbColor()}`,
          border: `1px solid ${theme.text}20`
        }}
      >
        <motion.span key={count} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-6xl font-black italic z-20">
          {count}
        </motion.span>
        
        <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40 mt-4">Tasbeeh</p>

        {/* Circular Progress (Visualizing the 33-count cycle) */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <motion.circle 
            cx="128" cy="128" r="120" 
            fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="753" 
            animate={{ strokeDashoffset: 753 - (753 * (count % 33)) / 33 }}
            className="opacity-20"
          />
          {/* NEW: Reset Hold Progress Ring */}

    {/* Inside your SVG */}
{showResetRing && holdProgress > 0 && (
  <motion.circle 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    cx="128" cy="128" r="120" 
    fill="none" 
    stroke="#ef4444" 
    strokeWidth="4" 
    strokeDasharray="753" 
    strokeDashoffset={753 - (753 * holdProgress) / 100}
    strokeLinecap="round"
    className="drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
  />
)}
        </svg>
      </motion.div>
    </div>

    {/* Guidance Text */}
    <motion.p 
      initial={{ opacity: 0.2 }}
      whileHover={{ opacity: 0.6 }}
      className="mt-8 text-[7px] font-black uppercase tracking-[0.5em] opacity-20"
    >
      Tap to count • Hold to reset
    </motion.p>
  </div>
  {/* Add this near your Tasbeeh counter or Clock */}
{!navigator.onLine && (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }}
    className="flex items-center gap-2 text-amber-500/80 text-xs mt-2"
  >
    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
    Offline Mode: Data saved locally
  </motion.div>
)}
</section>
  
              <aside className="lg:col-span-5">
                <div className="border-2 p-10 rounded-[2.5rem] bg-current/[0.02]" style={{ borderColor: theme.text + "15" }}>
                  <h3 className="text-xs font-black uppercase mb-8 opacity-40 italic tracking-widest">Rituals</h3>
                  <div className="space-y-6">
                    {["Tahajjud", "Surah Mulk", "Morning Adhkar", "Sadaqah"].map(item => (
                      <div key={item} onClick={() => { const u = checkedItems.includes(item) ? checkedItems.filter(i => i !== item) : [...checkedItems, item]; setCheckedItems(u); sync({checks: u}); }} className="flex items-center gap-6 cursor-pointer group">
                        <div className={`w-6 h-6 border-2 flex items-center justify-center transition-all ${checkedItems.includes(item) ? 'bg-current shadow-lg shadow-current/20' : ''}`} style={{ borderColor: theme.text }}>
                          {checkedItems.includes(item) && <Check size={14} className="invert" />}
                        </div>
                        <span className={`text-xs font-black uppercase ${checkedItems.includes(item) ? 'opacity-20 line-through' : ''}`}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
  
                {/* BEAUTIFUL NIGHTLY SUNNAH CALL-TO-ACTION */}
                {isNightTime && (
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-8 p-8 rounded-[2.5rem] bg-gradient-to-br from-[#1a1c1e] to-[#020403] border border-white/10 shadow-2xl relative overflow-hidden group cursor-pointer"
                  onClick={() => setActiveTab('sunnah')}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-amber-500/20 transition-colors" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-500/10 rounded-lg">
                        <Moon size={18} className="text-amber-500" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/80">Evening Transition</span>
                    </div>
                    <h3 className="text-xl font-serif italic text-white mb-2">The night is falling...</h3>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed mb-6">
                      Would you like to fulfill your nightly <br/> Sunnah rituals now?
                    </p>
                    <div className="flex items-center gap-2 text-white group-hover:gap-4 transition-all">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em]">Enter Sunnatul Layl</span>
                      <ArrowRight size={14} className="text-amber-500" />
                    </div>
                  </div>
                </motion.div>
                )}
                <div className="mt-8 mb-12 p-6 bg-black/[0.03] rounded-[2rem] border border-black/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#FFBF00] animate-pulse" />
                      <h4 className="text-[9px] font-black uppercase tracking-widest opacity-40">Roza Tracker</h4>
                    </div>
                    <span className="text-[10px] font-black opacity-30">{fastingLog.length}/30 DAYS</span>
                  </div>
                  <div className="grid grid-cols-10 gap-1.5">
                  {Object.keys(MINGORA_TIMINGS).map((dateKey, index) => {
  // A day is "completed" if it's in our log (which now includes the 6 days)
  const isCompleted = fastingLog.includes(dateKey);
  const isToday = new Date().toISOString().split('T')[0] === dateKey;
  
  return (
    <div 
      key={dateKey}
      className={`h-6 rounded-md flex items-center justify-center text-[8px] font-bold transition-all ${
        isCompleted 
        ? 'bg-[#FFBF00] text-black shadow-[0_0_10px_rgba(255,191,0,0.3)] opacity-100' 
        : isToday ? 'border-2 border-black/40 opacity-100' : 'bg-black/10 opacity-20'
      }`}
    >
      {isCompleted ? <Check size={10} strokeWidth={4} /> : index + 1}
    </div>
  );
})}
                  </div>
                </div>
              </aside>
            </main>
          </motion.div>
        ) : (
          /* SUNNATUL LAYL (DIARY) VIEW */
          <motion.div 
            key="sunnah" 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen"
          >
            <AlKhatm user={user} sync={sync} />
            
            {/* FLOATING RETURN BUTTON */}
            
            <button 
  onClick={() => setActiveTab('tracker')}
  className="
    /* Positioning & Layering */
    fixed top-6 left-6 z-[200] 
    
    /* MOBILE: Compact Styles */
    px-2 py-2 gap-1.5 
    
    /* DESKTOP: Your Original Styles */
    md:px-5 md:py-4 md:gap-3 
    
    /* Aesthetics (Unchanged) */
    bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full flex items-center group hover:bg-white/20 transition-all shadow-2xl"
>
  <ArrowRight 
    size={14} 
    className="rotate-180 text-amber-500 md:size-4" 
  />
  <span className="
    /* Font size (Unchanged) */
    text-[10px] font-black uppercase text-white
    
    /* MOBILE: Tighter letters to save space */
    tracking-tighter 
    
    /* DESKTOP: Your original wide tracking */
    md:tracking-[0.3em]
  ">
    Return to Tracker
  </span>
</button>
          </motion.div>
        )}
      </AnimatePresence>
  
      {/* SHARED MODALS & OVERLAYS (Accessible from both views) */}
      <AnimatePresence>
        {archiveOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div className="bg-[#F5F5F0] text-[#2D2D2A] w-full max-w-5xl max-h-[85vh] overflow-hidden rounded-[3rem] relative shadow-2xl flex flex-col">
              <div className="p-8 border-b border-black/10 flex justify-between items-center bg-white/50">
                <h3 className="text-xl font-black uppercase italic flex items-center gap-3"><ScrollText size={24}/> The Great Archive</h3>
                <button onClick={() => setArchiveOpen(false)} className="p-3 border-2 border-[#2D2D2A] rounded-full hover:bg-[#2D2D2A] hover:text-white transition-all"><X size={20}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 md:p-12">
                <div className="mb-20">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 border-b border-black/10 pb-2 flex-1">Quran Completion Journey</h4>
                    <div className="text-right">
                       <span className="text-4xl font-black italic">{Math.round((quranProgress/30)*100)}%</span>
                       <span className="text-[8px] font-bold opacity-30 block">COMPLETED</span>
                    </div>
                  </div>
                  <div className="w-full h-4 bg-black/5 rounded-full mb-8 overflow-hidden border border-black/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(quranProgress/30)*100}%` }} className="h-full bg-[#2D2D2A]" />
                  </div>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                    {[...Array(30)].map((_, i) => (
                      <div key={i} onClick={() => {setQuranProgress(i+1); sync({quran: i+1});}} className={`aspect-square border-2 border-[#2D2D2A] rounded-xl flex items-center justify-center font-black cursor-pointer text-xs transition-all ${i < quranProgress ? 'bg-[#2D2D2A] text-white' : 'hover:bg-black/5 opacity-40'}`}>
                        {i < quranProgress ? <CheckCircle2 size={12}/> : i+1}
                      </div>
                    ))}
                  </div>
                </div>
                {["Ramadan", "Prophetic", "Quranic"].map(cat => (
                  <div key={cat} className="mb-16">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 opacity-30 border-b border-black/10 pb-2">{cat} Supplications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {ALL_DUAS.filter(d => d.cat === cat).map((d, i) => (
                        <div key={i} className="p-8 bg-white border border-black/5 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <span className="px-3 py-1 bg-black/5 rounded-full text-[7px] font-black uppercase tracking-widest">{d.title}</span>
                          </div>
                          <p className="text-2xl font-serif text-right leading-relaxed mb-6">{d.arabic}</p>
                          <p className="text-[10px] font-bold opacity-50 uppercase italic leading-tight tracking-tighter">{d.trans}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  
      <AnimatePresence>
        {showWelcome && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[600] bg-[#F5F5F0] flex flex-col items-center justify-center text-[#2D2D2A]">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-center">أهلاً، <br/><span className="text-3xl opacity-40">{user?.name}</span></h1>
          </motion.div>
        )}
      </AnimatePresence>
  
      <AnimatePresence>{showIftarMubarak && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#FFBF00]">
          <motion.div initial={{ scale: 0.5, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} className="text-center p-12 bg-white rounded-[4rem] shadow-[0_0_100px_rgba(255,255,255,0.5)]">
            <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl mb-6">🌙</motion.div>
            <h2 className="text-6xl font-black italic uppercase text-[#2D2D2A] tracking-tighter">Iftar Mubarak</h2>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 p-8 bg-black/5 rounded-[2.5rem] border border-black/10 backdrop-blur-sm max-w-md mx-auto">
              <p className="text-3xl font-serif mb-4 text-[#2D2D2A]">ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ</p>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-tight">"Thirst has gone, the veins are moistened, and the reward is certain, if Allah wills."</p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
  
      <AnimatePresence>{showSeharMubarak && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0F0F0E]">
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
            <div className="relative">
              <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
              <h2 className="text-7xl font-black italic uppercase text-[#F5F5F0] relative z-10 tracking-tighter">Suhoor Ends</h2>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.8 }} className="mt-10 p-8 border-2 border-white/10 rounded-[2.5rem] bg-white/5 backdrop-blur-lg max-w-md mx-auto">
                <span className="text-[9px] font-black text-blue-400 tracking-[0.4em] block mb-4">NIYYAH</span>
                <p className="text-3xl font-serif mb-4 text-[#F5F5F0]">وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ</p>
              </motion.div>
              <Sunrise className="mx-auto mt-8 text-white opacity-20" size={48} />
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
  
      <div className="absolute bottom-6 right-6 pointer-events-none select-none">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-end pointer-events-auto group">
          <div className="flex items-center gap-2 overflow-hidden">
            <motion.div initial={{ x: 50 }} whileInView={{ x: 0 }} className="h-[1px] w-6 bg-amber-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#2D2D2A] opacity-40">Built By <span className="text-[#2D2D2A] opacity-100">Shahid ALI</span></span>
          </div>
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
            <div className="w-[2px] h-[2px] rounded-full bg-amber-500 animate-pulse" />
            <div className="w-[2px] h-[2px] rounded-full bg-[#2D2D2A]/20" />
            <div className="w-[2px] h-[2px] rounded-full bg-[#2D2D2A]/20" />
          </div>
        </motion.div>
      </div>
    </div>
  );}