"use client";
import { useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Terminal, Loader2, Copy, Trash2, Check, Share2, CheckCircle, Info, Upload } from "lucide-react";
import { toast } from 'sonner';



export default function Home() {
  const [resumeText, setResumeText] = useState<string>("");
  const [roast, setRoast] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleClear = () => {
    setResumeText("");
    setRoast("");
    // Reset the file input visually
    const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    toast.success("Ready for the next victim! 💀");
  };

  const handleRoast = async (text?: string) => {
    const contentToRoast = text || resumeText;
    if (!contentToRoast) return;

    setLoading(true);
    setRoast("");

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: contentToRoast }),
      });
      const data = await res.json();
      setRoast(data.reply);
    } catch (err) {
      setRoast("The AI is speechless.");
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('/api/roast', { // We use the same route
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
  
      if (data.text) {
        setResumeText(data.text); // Save text to state
        toast.success("Resume Loaded!", { description: "Click the ROAST ME button to begin the carnage." });
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };
  

  const funMessages = [
    "Go ahead, share your shame on social media. 💀",
    "Copied! Now go show your mom why you're still unemployed.",
    "Your failure has been saved to your clipboard.",
    "Ready to post? Don't forget to tag your ex-boss."
  ];
  
  const copyToClipboard = (text: string) => {
    const randomMessage = funMessages[Math.floor(Math.random() * funMessages.length)];
    navigator.clipboard.writeText(text);
    
    toast.info('Copied to Clipboard', {
      description: randomMessage,
      style: { background: '#18181b', color: '#fff', border: '1px solid #3f3f46' }
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Visual background elements */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #3f3f46 1px, transparent 0)`, backgroundSize: '24px 24px' }}></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full space-y-8 z-10"
      >
        <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-orange-500 mb-2">
  <Terminal size={12} /> 
  <span>Built with ⚡️ by</span>
  
  <span className="relative group cursor-pointer ml-1">
    <span className="relative z-10 transition-colors group-hover:text-white px-1">
      Shahid Ali
    </span>
    {/* This is your unique hover shape */}
    <span className="absolute inset-0 bg-orange-600 scale-0 group-hover:scale-110 transition-transform duration-200 ease-out -rotate-3 rounded-sm -z-0"></span>
  </span>
</div>
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
            Resume <span className="text-orange-500">Roaster</span>
          </h1>
          <p className="text-zinc-500 text-lg">Your ticket to a better job through emotional damage.</p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            {/* <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Drop your 'experience' here..."
              className="w-full h-56 bg-transparent p-6 focus:outline-none text-zinc-300 placeholder:text-zinc-700 resize-none leading-relaxed"
            /> */}
  <div 
  className="border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center hover:border-orange-500 transition-colors"
  onDragOver={(e) => e.preventDefault()} // Stops browser from opening file
  onDrop={(e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Manually trigger the file upload logic
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.getElementById('resume-upload') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        handleFileUpload({ target: input } as any);
      }
    }
  }}
>
  <input 
    type="file" 
    accept=".pdf" 
    onChange={handleFileUpload} 
    className="hidden" 
    id="resume-upload" 
  />
  <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
    <Upload className="w-10 h-10 text-zinc-500 mb-2" />
    <span className="text-sm text-zinc-400">
      {isUploading ? "Reading your secrets..." : resumeText ? "PDF Loaded! Click Roast Me ↓" : "Drop your PDF here or click to upload"}
    </span>
  </label>
</div>
          </div>
        </div>
      
      {/* playful badge for the user */}
        {resumeText && (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center justify-between px-4 py-2 mb-4 rounded-lg bg-zinc-900/50 border border-zinc-800"
  >
    <div className="flex items-center gap-3">
      {/* Animated Pulse Dot */}
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
      </div>
      
      <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">
        Intelligence Extracted
      </span>
    </div>

    <div className="flex items-baseline gap-1">
      <span className="text-xl font-mono font-black text-white">
        {resumeText.length.toLocaleString()}
      </span>
      <span className="text-[10px] text-zinc-600 font-bold uppercase">Chars</span>
    </div>
  </motion.div>
)}

<button
  onClick={() => handleRoast()}
  // Disable if: 1. Loading, 2. No resume text, OR 3. Roast already exists
  disabled={loading || !resumeText || !!roast} 
  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 
    ${(loading || !resumeText || roast) 
      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50' 
      : 'bg-white text-black hover:bg-orange-500 hover:text-white shadow-xl shadow-orange-500/20'}`}
>
  {loading ? (
    <><Loader2 className="animate-spin" /> Analyzing your failures ... </>
  ) : roast ? (
    <><CheckCircle size={20} /> ALREADY ROASTED</>
  ) : (
    <><Flame size={20} /> ROAST ME</>
  )}
</button>

        

        <AnimatePresence mode="wait">
          {roast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative p-8 bg-zinc-900/50 backdrop-blur-xl border border-orange-500/20 rounded-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-orange-500 font-bold flex items-center gap-2 uppercase tracking-widest text-sm">
                  💀 Recruitment Verdict
                </h3>
                <div className="flex gap-2">
                  <button onClick={() => copyToClipboard(roast)} className="p-2 hover:bg-zinc-800 rounded-md transition text-zinc-400">
                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                  <button className="p-2 hover:bg-zinc-800 rounded-md transition text-zinc-400">
                    <Share2 size={18} />
                  </button>
                  
                </div>
              </div>
              <p className="text-zinc-300 leading-relaxed italic text-lg font-medium">
                "{roast}"
              </p>
              <motion.button
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  onClick={handleClear}
  className="group relative flex items-center gap-2 px-6 py-3 mt-8 mx-auto bg-transparent border border-zinc-800 rounded-full text-zinc-500 hover:text-red-500 hover:border-red-500/50 transition-all duration-300"
>
  {/* The icon spins on hover */}
  <motion.div className="group-hover:rotate-180 transition-transform duration-500">
    <Trash2 size={16} />
  </motion.div>
  
  <span className="text-xs font-bold uppercase tracking-widest">
    Burn the Evidence & Try Again
  </span>

  {/* Subtle glow effect on hover */}
  <div className="absolute inset-0 rounded-full bg-red-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
</motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}