"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  Sparkles, Check, LogOut, X, Sunrise, Sunset, 
  Moon, Volume2, VolumeX, BookOpen, Quote, Search, Info, AlertTriangle, ScrollText, CheckCircle2
} from 'lucide-react';

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
  const [cityInput, setCityInput] = useState("");
  const [isExternalCity, setIsExternalCity] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
  
  const logout = () => {
    localStorage.removeItem('q_active_session');
    setUser(null);
    setCount(0); // Reset UI state
    setFastingLog([]); // Reset UI state
    setIsLoginView(true);
  };
  
  useEffect(() => {
    // This runs ONCE when the app first opens
    if (city === "Mingora") {
      fetchCityTimings("Mingora");
    }
  }, []); // Empty brackets mean "run on load"
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
      
      // Calculate Day 4 (Feb 22 - 18 = 4)
      const dayOfMonth = now.getDate();
      setRamadanDay(dayOfMonth - 18); 
      
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

    if (diff <= 1000 && diff > 0 && label === "UNTIL IFTAR") {
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

    
  if (diff <= 1000 && diff > 0) {
    if (label === "UNTIL IFTAR") {
      setShowIftarMubarak(true);
      setTimeout(() => setShowIftarMubarak(false), 8000); // Show for 8 seconds
      playTone(523, 'sine', 1); // Celebration tone
    } else if (label === "UNTIL SEHAR") {
      setShowSeharMubarak(true);
      setTimeout(() => setShowSeharMubarak(false), 8000);
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
      if (session) loadUserData(session);
      hasInitialized.current = true;
    }
    return () => clearInterval(timer);
  }, [updateEngine]);

  const loadUserData = (name: string) => {
    const key = `q_vault_${name.toLowerCase().trim()}`;
    const data = localStorage.getItem(key);
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    
    // 1. Parse existing data or create default
    let p = data ? JSON.parse(data) : { count: 0, quran: 0, checks: [], log: [] };
    
    // 2. Handle the Log (Days checked)
    const launchBonusDays = ["2026-02-19", "2026-02-20", "2026-02-21"];
    const existingLog = Array.isArray(p.log) ? p.log : [];
    
    // Merge bonus days + existing days
    let updatedLog = Array.from(new Set([...existingLog, ...launchBonusDays]));
  
    // 3. AUTO-CHECK DAY 4 (If after Iftar)
    const timings = MINGORA_TIMINGS[dateStr];
    if (timings) {
      const [iH, iM] = timings.iftar.split(':').map(Number);
      const iftarTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), iH, iM);
  
      if (now > iftarTime && !updatedLog.includes(dateStr)) {
        updatedLog.push(dateStr);
        console.log("Day 4 Auto-Logged: Iftar has passed.");
      }
    }
  
    // 4. Update the Count based on the Log length
    const newCount = updatedLog.length;
  
    // 5. Update States
    setCount(newCount); 
    setQuranProgress(p.quran || 0);
    setCheckedItems(p.checks || []);
    setFastingLog(updatedLog);
    setUser({ name });
  
    // 6. Persist to LocalStorage immediately
    const finalData = { 
      ...p, 
      count: newCount, 
      log: updatedLog 
    };
    localStorage.setItem(key, JSON.stringify(finalData));
    localStorage.setItem('q_active_session', name);
  
    // 7. UI Transitions
    setIsLoginView(false);
    setShowWelcome(true);
    setTimeout(() => setShowWelcome(false), 2500);
  };

  const sync = (payload: any) => {
    if (!user) return;
    const key = `q_vault_${user.name.toLowerCase().trim()}`;
    const current = JSON.parse(localStorage.getItem(key) || '{}');
    localStorage.setItem(key, JSON.stringify({ ...current, ...payload }));
  };

  if (isLoginView) return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-6 text-[#2D2D2A]">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border-2 border-[#2D2D2A] p-12 w-full max-w-md shadow-[12px_12px_0px_#2D2D2A]">
        <h2 className="text-2xl font-black italic uppercase mb-8">Vault_Gate</h2>
        <form onSubmit={(e) => { e.preventDefault(); if(tempName) loadUserData(tempName); }}>
          <input className="w-full bg-transparent border-b-2 border-[#2D2D2A] p-3 outline-none font-black text-3xl uppercase mb-8" placeholder="NAME" value={tempName} onChange={(e) => setTempName(e.target.value)} />
          <button className="w-full bg-[#2D2D2A] text-white py-4 font-black uppercase text-xs">Connect</button>
        </form>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen transition-colors duration-1000 font-sans p-4 md:p-12 pb-24 relative overflow-hidden" style={{ backgroundColor: theme.bg, color: theme.text }}>

<header className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-current/10 pb-8">
        <div><h1 className="text-3xl font-black italic uppercase leading-none">{user?.name}</h1><p className="text-[9px] font-black opacity-20 uppercase tracking-[0.3em] mt-2">The Basirah Companion</p></div>
        <div className="flex items-center gap-4">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-3 opacity-40 hover:opacity-100">{soundEnabled ? <Volume2 size={18}/> : <VolumeX size={18}/>}</button>
          
          <button 
            onClick={() => setArchiveOpen(true)} 
            className="group px-6 py-2 font-black text-[10px] uppercase border-2 border-current hover:bg-current transition-all overflow-hidden relative"
          >
            <span className="relative z-10 transition-colors duration-200 group-hover:text-[var(--bg)]" style={{ '--bg': theme.bg } as any}>Archives</span>
          </button>

          <button onClick={() => { 
            localStorage.removeItem('q_active_session'); 
            window.location.reload(); }} 
            className="p-3 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"><LogOut size={18}/></button>
        </div>
      </header>

          {/* UPDATED CITY SEARCH & FEEDBACK */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col gap-2 mt-16 md:mt-0">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isSearching ? 'animate-pulse' : 'opacity-20'}`} size={14} />
            <input 
              className="w-full bg-current/[0.05] border-2 border-transparent focus:border-current/20 rounded-full py-2 pl-10 pr-4 text-xs font-bold outline-none" 
              placeholder="Search City or Region..." 
              value={cityInput} 
              onChange={(e) => setCityInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && fetchCityTimings(cityInput)} 
            />
          </div>

          {/* DETECTED LOCATION BADGE */}
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

      {/* HUD */}
      <div className="max-w-6xl mx-auto mb-12 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 border-2 p-8 md:p-12 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8" style={{ borderColor: theme.text + "15" }}>
        <div>
    <div className="flex items-center gap-3 mb-2">
      <span className="text-[10px] font-black tracking-[0.4em] opacity-30 italic uppercase">
        {cd.label} @ {city.toUpperCase()}
      </span>
      {/* THE LOCAL CLOCK BADGE */}
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

<div className="fixed bottom-4 left-4 z-[1000] flex gap-2">
  <button 
    onClick={() => setShowIftarMubarak(true)} 
    className="bg-orange-500 text-white p-2 text-[8px] font-black uppercase rounded"
  >
    Test Iftar
  </button>
  <button 
    onClick={() => setShowSeharMubarak(true)} 
    className="bg-blue-500 text-white p-2 text-[8px] font-black uppercase rounded"
  >
    Test Sehar
  </button>

  <button 
  onClick={() => setFastingLog([...fastingLog, new Date().toISOString().split('T')[0]])}
  className="bg-green-600 text-white p-2 text-[8px] font-black uppercase rounded"
>
  Force Checkmark
</button>
</div>
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
      <section className="lg:col-span-7">
        <div className="border-2 p-16 text-center rounded-[3rem] relative flex items-center justify-center min-h-[500px]" style={{ borderColor: theme.text }}>
           
          {/* THE NUR ORB CONTAINER */}
          <div className="relative cursor-pointer" onClick={handleDhikr}>
            
            {/* PARTICLE EXPLOSION LAYER */}
            <AnimatePresence>
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full z-10"
                  style={{ backgroundColor: getOrbColor() }}
                />
              ))}
            </AnimatePresence>

            {/* MAIN ORB */}
            <motion.div 
              animate={controls}
              className="w-64 h-64 rounded-full relative flex flex-col items-center justify-center"
              style={{ 
                background: `radial-gradient(circle, ${getOrbColor()} 0%, transparent 70%)`,
                boxShadow: `0 0 ${20 + (count % 33) * 2}px ${getOrbColor()}`,
                border: `1px solid ${theme.text}20`
              }}
            >
              <motion.span 
                key={count}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl font-black italic z-20"
              >
                {count}
              </motion.span>
              
              <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40 mt-4">Tasbeeh</p>

              {/* ROTATING PROGRESS RING */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <motion.circle 
                  cx="128" cy="128" r="120" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeDasharray="753" 
                  animate={{ strokeDashoffset: 753 - (753 * (count % 33)) / 33 }}
                  className="opacity-20"
                />
              </svg>
            </motion.div>
          </div>
        </div>
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
            {/* COMPACT BARAKAH LOG */}
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
  // FORCE CHECK for the first two days, otherwise check the actual log
  const isBonusDay = ["2026-02-19", "2026-02-20", "2026-02-21"].includes(dateKey);
  const isCompleted = isBonusDay || fastingLog.includes(dateKey);
  
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

       

      {/* ARCHIVE MODAL */}
      <AnimatePresence>
        {archiveOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div className="bg-[#F5F5F0] text-[#2D2D2A] w-full max-w-5xl max-h-[85vh] overflow-hidden rounded-[3rem] relative shadow-2xl flex flex-col">
              <div className="p-8 border-b border-black/10 flex justify-between items-center bg-white/50">
                <h3 className="text-xl font-black uppercase italic flex items-center gap-3"><ScrollText size={24}/> The Great Archive</h3>
                <button onClick={() => setArchiveOpen(false)} className="p-3 border-2 border-[#2D2D2A] rounded-full hover:bg-[#2D2D2A] hover:text-white transition-all"><X size={20}/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 md:p-12">

                {/* 1. QURAN TRACKER (TOP) */}
                <div className="mb-20">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 border-b border-black/10 pb-2 flex-1">Quran Completion Journey</h4>
                    <div className="text-right">
                       <span className="text-4xl font-black italic">{Math.round((quranProgress/30)*100)}%</span>
                       <span className="text-[8px] font-bold opacity-30 block">COMPLETED</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-4 bg-black/5 rounded-full mb-8 overflow-hidden border border-black/5">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${(quranProgress/30)*100}%` }} 
                      className="h-full bg-[#2D2D2A]"
                    />
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                    {[...Array(30)].map((_, i) => (
                      <div key={i} onClick={() => {setQuranProgress(i+1); sync({quran: i+1});}} className={`aspect-square border-2 border-[#2D2D2A] rounded-xl flex items-center justify-center font-black cursor-pointer text-xs transition-all ${i < quranProgress ? 'bg-[#2D2D2A] text-white' : 'hover:bg-black/5 opacity-40'}`}>
                        {i < quranProgress ? <CheckCircle2 size={12}/> : i+1}
                      </div>
                    ))}
                  </div>
                </div>



                {/* 2. CATEGORIZED DUAS (BOTTOM) */}
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
            {/* <Sparkles className="mb-8 opacity-20" size={48} /> */}
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-center">
              أهلاً، <br/>
              <span className="text-3xl opacity-40">{user?.name}</span>
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* IFTAR CELEBRATION OVERLAY */}
<AnimatePresence>
  {showIftarMubarak && (


    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#FFBF00]"
    >
             
      <motion.div 
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        className="text-center p-12 bg-white rounded-[4rem] shadow-[0_0_100px_rgba(255,255,255,0.5)]"
      >
        
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-6"
        >
          🌙
        </motion.div>
        
        <h2 className="text-6xl font-black italic uppercase text-[#2D2D2A] tracking-tighter">
          Iftar Mubarak
        </h2>
        <p className="text-xs font-black uppercase opacity-40 mt-4 tracking-widest">
          The fast is complete. May your prayers be accepted.
        </p>
        <motion.div 
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.5 }}
  className="mt-8 p-8 bg-black/5 rounded-[2.5rem] border border-black/10 backdrop-blur-sm max-w-md mx-auto"
>
  <p className="text-3xl font-serif mb-4 text-[#2D2D2A]">
    ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ
  </p>
  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-tight">
    "Thirst has gone, the veins are moistened, and the reward is certain, if Allah wills."
  </p>
        {/* Particle Burst for Iftar */}
        <div className="absolute inset-0 pointer-events-none">
           {[...Array(20)].map((_, i) => (
             <motion.div
               key={i}
               initial={{ x: "50%", y: "50%" }}
               animate={{ x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%`, scale: [0, 1, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute w-2 h-2 bg-white rounded-full"
             />
           ))}
        </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

{/* SEHAR CELEBRATION OVERLAY */}
<AnimatePresence>
  {showSeharMubarak && (
    
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0F0F0E]"
    >
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center"
      >
        <div className="relative">
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full"
          />
          <h2 className="text-7xl font-black italic uppercase text-[#F5F5F0] relative z-10 tracking-tighter">
            Suhoor Ends
          </h2>
          <p className="text-xs font-black uppercase text-blue-400 mt-4 tracking-[0.5em] relative z-10">
            Intention set. The fast begins.
          </p>
          <motion.div 
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ delay: 0.8 }}
  className="mt-10 p-8 border-2 border-white/10 rounded-[2.5rem] bg-white/5 backdrop-blur-lg max-w-md mx-auto"
>
  <span className="text-[9px] font-black text-blue-400 tracking-[0.4em] block mb-4">NIYYAH</span>
  <p className="text-3xl font-serif mb-4 text-[#F5F5F0]">
    وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ
  </p>
  <p className="text-[10px] font-bold opacity-50 uppercase text-[#F5F5F0] italic tracking-tighter">
    "I intend to keep the fast for tomorrow in the month of Ramadan."
  </p>
  </motion.div>
          <Sunrise className="mx-auto mt-8 text-white opacity-20" size={48} />
        </div>
        
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
{/* SHAHID ALI EXECUTIVE MARK - BOTTOM RIGHT */}
<div className="absolute bottom-6 right-6 pointer-events-none select-none">
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-end pointer-events-auto group"
  >

    {/* The Minimalist Label */}
    <div className="flex items-center gap-2 overflow-hidden">
      <motion.div 
        initial={{ x: 50 }}
        whileInView={{ x: 0 }}
        className="h-[1px] w-6 bg-amber-500" 
      />
      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#2D2D2A] opacity-40">
        Built By <span className="text-[#2D2D2A] opacity-100">Shahid ALI</span>
      </span>
    </div>

    {/* Creative Floating Dot */}
    <div className="absolute -right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
      <div className="w-[2px] h-[2px] rounded-full bg-amber-500 animate-pulse" />
      <div className="w-[2px] h-[2px] rounded-full bg-[#2D2D2A]/20" />
      <div className="w-[2px] h-[2px] rounded-full bg-[#2D2D2A]/20" />
    </div>
  </motion.div>
</div>
    </div>
  );
  
}