"use client";

import React, { useState, useEffect } from 'react';
import { FileUp, Zap, EyeOff, Loader2, XCircle, Box } from 'lucide-react';

const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";

const BlueprintLens = () => {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isActive, setIsActive] = useState(false);
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = PDFJS_CDN;
    document.head.appendChild(script);

    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    const pdfjs = (window as any)['pdfjs-dist/build/pdf'];
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument(arrayBuffer).promise;
    const pageImages: string[] = [];

    // Rendering first 10 pages for performance
    for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.8 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context!, viewport }).promise;
      pageImages.push(canvas.toDataURL('image/webp', 0.8));
    }

    setPages(pageImages);
    setLoading(false);
  };

  const unloadPdf = () => {
    setPages([]);
    setIsActive(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#020617', // Midnight Navy
      color: '#fff', 
      overflowX: 'hidden',
      // The "Fun/Unique" Grid Background
      backgroundImage: `
        linear-gradient(rgba(30, 58, 138, 0.2) 1px, transparent 1px),
        linear-gradient(90deg, rgba(30, 58, 138, 0.2) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
      backgroundAttachment: 'fixed'
    }}>
      
      {!pages.length ? (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {loading ? (
            <div style={{ textAlign: 'center' }}>
              <Loader2 className="animate-spin" size={40} style={{ color: '#38BDF8' }} />
              <p style={{ marginTop: '20px', letterSpacing: '4px', fontSize: '10px', color: '#38BDF8' }}>CONSTRUCTING_VIEWPORT...</p>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
               <div style={{
                  position: 'absolute', inset: -20, border: '1px solid #38BDF8', opacity: 0.2, borderRadius: '50%', animation: 'pulse 4s infinite'
               }} />
               <label style={{ 
                border: '1px solid #1E293B', padding: '80px 120px', borderRadius: '4px', cursor: 'pointer',
                backgroundColor: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(10px)', display: 'block', textAlign: 'center'
              }}>
                <FileUp size={30} style={{ color: '#38BDF8', margin: '0 auto 20px' }} />
                <p style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '4px', color: '#38BDF8' }}>LOAD_SOURCE_DATA</p>
                <input type="file" hidden accept=".pdf" onChange={handleFileUpload} />
              </label>
            </div>
          )}
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          
          {/* THE PAGES */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '50px', padding: '80px 0' }}>
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '10px', letterSpacing: '8px', color: '#38BDF8', opacity: 0.6 }}>SYSTEM_ANALYSIS_VIEW</h1>
            </div>
            {pages.map((src, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: -20, left: -20, fontSize: '10px', color: '#38BDF8' }}>[{i+1}]</div>
                <img src={src} style={{ width: '850px', border: '1px solid #1E293B', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} alt="page" />
              </div>
            ))}
          </div>

          {/* THE LENS OVERLAY (Frosted Glass) */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 100, pointerEvents: 'none',
            opacity: isActive ? 1 : 0, transition: 'opacity 0.6s ease',
            backdropFilter: 'blur(30px) brightness(0.3) saturate(0.5)',
            WebkitBackdropFilter: 'blur(30px) brightness(0.3) saturate(0.5)',
            WebkitMaskImage: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, black 100%)`,
            maskImage: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, black 100%)`,
          }} />

          {/* THE LENS FRAME */}
          <div style={{
            position: 'fixed', left: mousePos.x, top: mousePos.y, width: '400px', height: '400px',
            borderRadius: '50%', border: '1px solid rgba(56, 189, 248, 0.5)',
            transform: 'translate(-50%, -50%)', zIndex: 101, pointerEvents: 'none',
            display: isActive ? 'block' : 'none',
            boxShadow: '0 0 100px rgba(0,0,0,0.8), inset 0 0 40px rgba(56, 189, 248, 0.1)'
          }}>
            <Box size={14} style={{ position: 'absolute', top: '50%', left: -7, transform: 'translateY(-50%)', color: '#38BDF8' }} />
            <Box size={14} style={{ position: 'absolute', top: '50%', right: -7, transform: 'translateY(-50%)', color: '#38BDF8' }} />
          </div>

          {/* CONTROLS */}
          <div style={{
            position: 'fixed', bottom: '50px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 200, display: 'flex', gap: '15px', padding: '8px', backgroundColor: '#0F172A',
            borderRadius: '100px', border: '1px solid #1E293B', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <button 
              onClick={() => setIsActive(!isActive)}
              style={{
                backgroundColor: isActive ? '#38BDF8' : '#1E293B',
                color: isActive ? '#000' : '#fff',
                border: 'none', padding: '12px 35px', borderRadius: '100px',
                fontWeight: '900', fontSize: '10px', letterSpacing: '2px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'
              }}
            >
              {isActive ? <Zap size={14} fill="currentColor" /> : <EyeOff size={14} />}
              {isActive ? 'SHUT_OPTICS' : 'ENGAGE_LENS'}
            </button>
            
            <button 
              onClick={unloadPdf}
              style={{
                backgroundColor: 'transparent', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '12px 20px', borderRadius: '100px', cursor: 'pointer', transition: '0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <XCircle size={18} />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.4; }
          100% { transform: scale(1); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

export default BlueprintLens;