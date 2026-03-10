'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Flame, Sparkles, Play, SkipBack, SkipForward } from 'lucide-react';

function SanctuaryScreen() {
  return (
    <div style={{ height: '100%', background: '#060606', padding: '18px 16px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 3 }}>Good morning</div>
        <div style={{ fontSize: 16, fontWeight: 300, color: '#fff', letterSpacing: -0.5 }}>Ready to transform? ✨</div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
        {[
          { icon: Sun, label: 'Affirmations', sub: 'Rewire your beliefs', color: '#A855F7' },
          { icon: Moon, label: 'Meditations', sub: 'Induce calm states', color: '#6366F1' },
          { icon: Flame, label: 'Rituals', sub: 'Encode identity', color: '#9333EA' },
        ].map(({ icon: Icon, label, sub, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px', borderRadius: 13, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={16} color={color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#fff', lineHeight: 1 }}>{label}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {['Home', 'Library', 'Speak'].map((item) => (
          <div key={item} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: item === 'Home' ? '#9333EA' : 'transparent' }} />
            <div style={{ fontSize: 9, color: item === 'Home' ? '#A855F7' : 'rgba(255,255,255,0.3)' }}>{item}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreationScreen() {
  return (
    <div style={{ height: '100%', background: '#060606', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 16px 11px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #9333EA, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={11} color="#fff" />
        </div>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#fff' }}>Creating Your Affirmation</div>
      </div>
      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 11, overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #9333EA, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={9} color="#fff" />
          </div>
          <div style={{ background: 'rgba(147,51,234,0.15)', border: '1px solid rgba(147,51,234,0.3)', borderRadius: '0 10px 10px 10px', padding: '8px 11px', maxWidth: 160 }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', lineHeight: 1.45 }}>What&apos;s your biggest challenge right now?</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px 0 10px 10px', padding: '8px 11px', maxWidth: 150 }}>
            <div style={{ fontSize: 10, color: '#fff', lineHeight: 1.45 }}>Self-doubt when I speak up at work</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #9333EA, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={9} color="#fff" />
          </div>
          <div style={{ background: 'rgba(147,51,234,0.15)', border: '1px solid rgba(147,51,234,0.3)', borderRadius: '0 10px 10px 10px', padding: '8px 11px', maxWidth: 160 }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', lineHeight: 1.45 }}>Perfect. Crafting your voice affirmation...</div>
          </div>
        </div>
        <div style={{ marginTop: 'auto', padding: '9px 11px', borderRadius: 10, background: 'rgba(147,51,234,0.08)', border: '1px solid rgba(147,51,234,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <div style={{ width: '72%', height: '100%', background: 'linear-gradient(to right, #9333EA, #A855F7)', borderRadius: 2, animation: 'wqProgressFill 2s ease-in-out infinite alternate' }} />
          </div>
          <div style={{ fontSize: 9, color: '#A855F7', fontWeight: 500 }}>Creating...</div>
        </div>
      </div>
    </div>
  );
}

function PlayerScreen() {
  return (
    <div style={{ height: '100%', background: '#060606', padding: '18px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 }}>Now Playing</div>
      <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #C084FC, #9333EA 55%, #4C1D95)', boxShadow: '0 0 50px rgba(147,51,234,0.55)', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'wqSpin 8s linear infinite' }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#060606', border: '3px solid rgba(255,255,255,0.08)' }} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', marginBottom: 3 }}>Morning Confidence</div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>Your Voice · 3:42</div>
      <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', gap: 2, height: 34, marginBottom: 16 }}>
        {[5,9,14,20,28,24,18,30,22,16,26,20,12,24,18,10,22,28,16,20,25,14,18,22,16,12,8,14,10,6].map((h, i) => (
          <div key={i} style={{ flex: 1, height: h, background: i < 18 ? 'linear-gradient(to top, #9333EA, #A855F7)' : 'rgba(255,255,255,0.1)', borderRadius: 1 }} />
        ))}
      </div>
      <div style={{ width: '100%', height: 2, borderRadius: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 18, position: 'relative' }}>
        <div style={{ width: '48%', height: '100%', background: 'linear-gradient(to right, #9333EA, #A855F7)', borderRadius: 1 }} />
        <div style={{ position: 'absolute', left: '48%', top: '50%', transform: 'translate(-50%, -50%)', width: 8, height: 8, borderRadius: '50%', background: '#A855F7' }} />
      </div>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <SkipBack size={17} color="rgba(255,255,255,0.35)" />
        <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg, #9333EA, #4F46E5)', boxShadow: '0 4px 20px rgba(147,51,234,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Play size={18} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
        </div>
        <SkipForward size={17} color="rgba(255,255,255,0.35)" />
      </div>
    </div>
  );
}

export function AppMockup() {
  const [screen, setScreen] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let pendingTimeout: ReturnType<typeof setTimeout> | null = null;
    const timer = setInterval(() => {
      setVisible(false);
      pendingTimeout = setTimeout(() => {
        setScreen((s) => (s + 1) % 3);
        setVisible(true);
      }, 350);
    }, 3800);
    return () => {
      clearInterval(timer);
      if (pendingTimeout) clearTimeout(pendingTimeout);
    };
  }, []);

  const screens = [
    <SanctuaryScreen key="s1" />,
    <CreationScreen key="s2" />,
    <PlayerScreen key="s3" />,
  ];
  const labels = ['Sanctuary', 'Create', 'Listen'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <div style={{ width: 'min(270px, 85vw)', aspectRatio: '1/2', maxWidth: 270, borderRadius: 46, background: '#060606', border: '2px solid rgba(147,51,234,0.5)', boxShadow: '0 0 0 1px rgba(147,51,234,0.12), 0 0 100px rgba(147,51,234,0.4), 0 60px 140px rgba(0,0,0,0.9)', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 82, height: 22, background: '#000', borderRadius: '0 0 14px 14px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1a1a1a', border: '1px solid #333' }} />
          <div style={{ width: 28, height: 4, borderRadius: 3, background: '#1a1a1a' }} />
        </div>
        <div style={{ position: 'absolute', top: 22, left: 0, right: 0, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 5 }}>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>9:41</span>
          <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            {[6, 9, 12, 15].map((h, i) => <div key={i} style={{ width: 2.5, height: h, background: i < 3 ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.18)', borderRadius: 1 }} />)}
          </div>
        </div>
        <div style={{ position: 'absolute', top: 42, left: 0, right: 0, bottom: 0, opacity: visible ? 1 : 0, transition: 'opacity 0.35s ease' }}>
          {screens[screen]}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {labels.map((label, i) => (
          <button key={label} onClick={() => { setScreen(i); setVisible(true); }} style={{ display: 'flex', alignItems: 'center', gap: 5, background: screen === i ? 'rgba(147,51,234,0.15)' : 'transparent', border: 'none', cursor: 'pointer', padding: '4px 10px', borderRadius: 20, transition: 'all 0.2s ease' }}>
            <div style={{ width: screen === i ? 22 : 6, height: 6, borderRadius: 3, background: screen === i ? '#9333EA' : 'rgba(255,255,255,0.18)', transition: 'all 0.3s ease' }} />
            {screen === i && <span style={{ fontSize: 10, color: '#A855F7', fontWeight: 500 }}>{label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
