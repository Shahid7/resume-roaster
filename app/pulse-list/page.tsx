"use client";

import React from 'react';
import { Shield, Clock, Zap, Globe, Layout, CheckCircle2, MessageCircle, PlayCircle, Mail } from 'lucide-react';

const Day17Page = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F2E8CF', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#3A5A40',
      padding: '80px 20px'
    }}>
      {/* Hero Section */}
      <header style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ 
          display: 'inline-block', 
          padding: '8px 16px', 
          backgroundColor: '#A3B18A', 
          color: 'white', 
          borderRadius: '100px', 
          fontSize: '12px', 
          fontWeight: 'bold', 
          letterSpacing: '2px',
          marginBottom: '24px'
        }}>
          DAY 17: PROJECT PULSE
        </div>
        <h1 style={{ fontSize: '64px', fontWeight: '800', letterSpacing: '-2px', margin: '0 0 20px 0', lineHeight: '1' }}>
          Pulse List
        </h1>
        <p style={{ fontSize: '20px', color: '#588157', maxWidth: '600px', margin: '0 auto' }}>
          A digital focus shield designed to architect your attention and protect your deep work sessions.
        </p>
      </header>

      {/* --- NEW: ACCESS & DEMO SECTION --- */}
      <section style={{ maxWidth: '800px', margin: '0 auto 80px auto', textAlign: 'center' }}>
        <div style={{ 
          backgroundColor: 'rgba(163, 177, 138, 0.2)', 
          padding: '30px', 
          borderRadius: '32px', 
          border: '2px dashed #A3B18A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>Get the Extension</h2>
          <p style={{ fontSize: '16px', color: '#3A5A40', margin: 0, opacity: 0.9 }}>
            This extension is currently in <strong>Private Beta</strong>. To start using the Focus Shield:
          </p>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="mailto:shaahidlee@gmail.com" style={ctaButtonStyle}>
              <Mail size={18} /> Email Me
            </a>
            <a href="https://linkedin.com/in/shahidalisethi" style={ctaButtonStyle}>
              <MessageCircle size={18} /> DM for Access
            </a>
            <a href="https://www.linkedin.com/posts/shahidalisethi_30daysofcode-buildinpublic-reactjs-ugcPost-7428484052229341184-GqeK?utm_source=share&utm_medium=member_desktop&rcm=ACoAABjO5GEBeu6NroVXakiMyHBCPLHvV2SmkLE" target="_blank" rel="noopener noreferrer" style={{...ctaButtonStyle, backgroundColor: '#3A5A40', color: '#F2E8CF'}}>
              <PlayCircle size={18} /> Watch Demo Video
            </a>
          </div>
        </div>
      </section>

      {/* Instruction Grid */}
      <main style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '40px',
          marginBottom: '100px'
        }}>
          <div style={cardStyle}>
            <Layout size={32} style={{ marginBottom: '20px', color: '#A3B18A' }} />
            <h3 style={stepTitle}>1. The Interface</h3>
            <p style={stepText}>
              Locate the <strong>Sage Tab</strong> on the right-center of your screen. Hover and click to reveal your architectural dashboard.
            </p>
          </div>

          <div style={cardStyle}>
            <Clock size={32} style={{ marginBottom: '20px', color: '#A3B18A' }} />
            <h3 style={stepTitle}>2. Define the Pulse</h3>
            <p style={stepText}>
              Input your objective and set a precise duration (H:M:S). Hit <strong>+ ADD</strong> to commit the task to the global heartbeat.
            </p>
          </div>

          <div style={cardStyle}>
            <Shield size={32} style={{ marginBottom: '20px', color: '#A3B18A' }} />
            <h3 style={stepTitle}>3. The Focus Shield</h3>
            <p style={stepText}>
              If your time expires, a <strong>Glassmorphism Shield</strong> will instantly lock every open browser tab until you mark the task complete.
            </p>
          </div>
        </div>

        {/* Technical Showcase Section */}
        <section style={{ 
          backgroundColor: '#3A5A40', 
          borderRadius: '40px', 
          padding: '60px', 
          color: '#F2E8CF',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '40px',
          alignItems: 'center'
        }}>
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '24px' }}>How it Works</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <FeatureItem icon={<Globe size={18}/>} text="Multi-Tab Synchronization via Chrome Storage API" />
              <FeatureItem icon={<Zap size={18}/>} text="Zero-Latency Background Service Workers" />
              <FeatureItem icon={<CheckCircle2 size={18}/>} text="Shadow DOM isolation for clean CSS injection" />
            </div>
          </div>
          <div style={{ 
            flex: '1 1 300px', 
            backgroundColor: 'rgba(242, 232, 207, 0.1)', 
            padding: '30px', 
            borderRadius: '24px',
            border: '1px solid rgba(242, 232, 207, 0.2)' 
          }}>
            <p style={{ fontSize: '14px', fontStyle: 'italic', opacity: 0.8, lineHeight: '1.8' }}>
              "Procrastination is the thief of time. Pulse List doesn't just track time; it reclaims it by making the cost of distraction visible."
            </p>
            <div style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '14px' }}>— SHAHID ALI SETHI</div>
          </div>
        </section>
      </main>

      <footer style={{ textAlign: 'center', marginTop: '100px', opacity: 0.6, fontSize: '14px' }}>
        Built for the 30 Days of Code Challenge • Day 17
      </footer>
    </div>
  );
};

// --- Styles ---

const ctaButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '12px 24px',
  backgroundColor: '#A3B18A',
  color: 'white',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  transition: 'transform 0.2s ease',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
};

const cardStyle = {
  backgroundColor: 'white',
  padding: '40px',
  borderRadius: '32px',
  boxShadow: '0 20px 40px rgba(58, 90, 64, 0.05)',
  border: '1px solid rgba(163, 177, 138, 0.1)'
};

const stepTitle = {
  fontSize: '22px',
  fontWeight: '800',
  marginBottom: '12px'
};

const stepText = {
  fontSize: '16px',
  color: '#588157',
  lineHeight: '1.6',
  margin: 0
};

const FeatureItem = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div style={{ color: '#A3B18A' }}>{icon}</div>
    <span style={{ fontSize: '16px', fontWeight: '500' }}>{text}</span>
  </div>
);

export default Day17Page;