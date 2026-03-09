'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { PageShell } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { CONTENT_MAX_WIDTH, CONTENT_NARROW } from '@/theme';
import Link from 'next/link';
import Image from 'next/image';
import {
  Brain,
  Mic,
  Sparkles,
  MessageCircle,
  Volume2,
  ArrowRight,
  ChevronDown,
  Star,
  Check,
  X,
  Moon,
  Flame,
  Sun,
  Play,
  SkipForward,
  SkipBack,
  Zap,
  Clock,
  Headphones,
  RefreshCw,
  Sunrise,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ThemeColors = ReturnType<typeof useTheme>['theme']['colors'];

// ─── Phone Mockup (same as launch page) ──────────────────────────────────────

function SanctuaryScreen({ colors }: { colors: ThemeColors }) {
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

function CreationScreen({ colors }: { colors: ThemeColors }) {
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

function PlayerScreen({ colors }: { colors: ThemeColors }) {
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

function AppMockup({ colors }: { colors: ThemeColors }) {
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
    <SanctuaryScreen key="s1" colors={colors} />,
    <CreationScreen key="s2" colors={colors} />,
    <PlayerScreen key="s3" colors={colors} />,
  ];
  const labels = ['Sanctuary', 'Create', 'Listen'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <div style={{ width: 270, height: 540, borderRadius: 46, background: '#060606', border: '2px solid rgba(147,51,234,0.5)', boxShadow: '0 0 0 1px rgba(147,51,234,0.12), 0 0 100px rgba(147,51,234,0.4), 0 60px 140px rgba(0,0,0,0.9)', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
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

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

const faqs = [
  { q: 'How is waQup different from Headspace or Calm?', a: 'Headspace and Calm give you generic content made by strangers. waQup creates personalized content based on YOUR specific goals, challenges, and context — and voices it in your own cloned voice. Nothing is generic. Everything is yours.' },
  { q: 'Do I need to record my own voice?', a: 'No. Voice cloning is optional. You can choose from our curated library of professional voices, or clone your own with just a 1-minute recording. Most people find hearing their own voice the most powerful, but both options work beautifully.' },
  { q: 'How do credits (Qs) work?', a: 'Qs are the credits used to create new content. You earn Qs when you sign up and can purchase more. Importantly — listening to and practicing your existing content is always 100% free. Qs are only spent during the creation process.' },
  { q: 'Is practice really free forever?', a: 'Yes. Once your affirmations, meditations, or rituals are created, you can replay them as many times as you want, forever, for free. We believe daily practice should never be gated behind a paywall.' },
  { q: 'What are the three content types?', a: 'Affirmations are short 2–5 min cognitive re-patterning statements for morning routines. Guided Meditations are 10–30 min AI-scripted sessions for state induction. Rituals are 20–60 min multi-part practices for the deepest identity transformation.' },
  { q: 'What is the science behind this?', a: 'waQup is built on neuroplasticity research — the brain\'s ability to rewire itself through repeated exposure. Hearing positive self-statements in your own voice activates deeper neural pathways than reading or hearing a stranger\'s voice.' },
];

function FAQItem({ q, a, colors }: { q: string; a: string; colors: ThemeColors }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderRadius: borderRadius.xl, background: open ? `${colors.accent.primary}08` : colors.glass.light, border: `1px solid ${open ? `${colors.accent.primary}30` : colors.glass.border}`, transition: 'all 0.25s ease', overflow: 'hidden' }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.lg }}>
        <Typography variant="bodyBold" style={{ color: colors.text.primary, fontWeight: 500, fontSize: '17px', lineHeight: 1.4 }}>{q}</Typography>
        <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: open ? colors.gradients.primary : 'rgba(255,255,255,0.05)', border: `1px solid ${open ? 'transparent' : colors.glass.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s ease' }}>
          <ChevronDown size={15} color={open ? '#fff' : colors.text.secondary} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }} />
        </div>
      </button>
      <div style={{ maxHeight: open ? 300 : 0, overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
        <div style={{ padding: '0 32px 28px' }}>
          <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.75, fontSize: '16px' }}>{a}</Typography>
        </div>
      </div>
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SECTION_PY = '120px';
const SECTION_PX = '40px';

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HowItWorksPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PageShell intensity="high" bare>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hiw-hero" style={{ padding: `0 ${SECTION_PX}`, maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', minHeight: 'calc(100dvh - 64px)', display: 'flex', alignItems: 'center', gap: '80px', boxSizing: 'border-box' }}>
        <div className="hiw-hero-copy" style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: borderRadius.full, background: `${colors.accent.tertiary}15`, border: `1px solid ${colors.accent.tertiary}30`, marginBottom: 32 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.success, animation: 'wqPulse 2s ease-in-out infinite' }} />
            <Typography variant="smallBold" style={{ color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.7px', fontSize: 11 }}>The Process · Step by Step</Typography>
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 5.5vw, 72px)', fontWeight: 300, lineHeight: 1.08, letterSpacing: '-2px', color: colors.text.primary, margin: '0 0 28px' }}>
            From first words<br />
            to lasting<br />
            <span style={{ background: colors.gradients.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>transformation.</span>
          </h1>

          <p style={{ fontSize: 'clamp(17px, 1.8vw, 21px)', color: colors.text.secondary, lineHeight: 1.65, maxWidth: 500, margin: '0 0 48px', fontWeight: 300 }}>
            Three steps. Your voice. Scientifically designed to rewire the subconscious patterns that shape who you are — and who you&apos;re becoming.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 36 }}>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="lg" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: '17px', padding: '16px 36px', boxShadow: `0 8px 48px ${colors.accent.primary}50` }}>
                Start Free Today <ArrowRight size={18} color={colors.text.onDark} />
              </Button>
            </Link>
            <Link href="/pricing" style={{ textDecoration: 'none' }}>
              <Button variant="outline" size="lg" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: '17px' }}>
                View Plans
              </Button>
            </Link>
          </div>

          <div style={{ display: 'flex', gap: 28 }}>
            {[
              { n: '3 steps', l: 'to your first practice' },
              { n: '60 sec', l: 'voice recording' },
              { n: '∞', l: 'free replays forever' },
            ].map(({ n, l }) => (
              <div key={l}>
                <div style={{ fontSize: 20, fontWeight: 500, color: colors.text.primary, letterSpacing: '-0.5px' }}>{n}</div>
                <div style={{ fontSize: 12, color: colors.text.tertiary, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hiw-hero-mockup">
          <AppMockup colors={colors} />
        </div>
      </section>

      {/* ── Step divider ─────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${colors.glass.border}`, borderBottom: `1px solid ${colors.glass.border}`, background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', padding: `48px ${SECTION_PX}`, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
          {[
            { n: '01', label: 'Share your goals', icon: MessageCircle },
            { n: '02', label: 'AI creates your content', icon: Sparkles },
            { n: '03', label: 'Listen and transform', icon: Headphones },
          ].map(({ n, label, icon: Icon }, i) => (
            <div key={n} style={{ textAlign: 'center', padding: '0 32px', borderRight: i < 2 ? `1px solid ${colors.glass.border}` : 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 11, color: colors.accent.primary, fontWeight: 700, letterSpacing: '0.1em' }}>{n}</div>
              <Icon size={18} color={colors.text.secondary} />
              <div style={{ fontSize: 14, color: colors.text.secondary, fontWeight: 400 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3-Step Deep Dive ──────────────────────────────── */}
      <section style={{ padding: `${SECTION_PY} ${SECTION_PX}`, maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{ fontSize: 11, color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 16 }}>How It Works</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, letterSpacing: '-1.5px', color: colors.text.primary, margin: '0 0 20px' }}>Three steps to a new you</h2>
          <p style={{ fontSize: 19, color: colors.text.secondary, maxWidth: 560, margin: '0 auto', lineHeight: 1.6, fontWeight: 300 }}>No forms. No scripts. No production skills. Just a conversation that becomes your daily practice.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {[
            {
              n: '01',
              icon: MessageCircle,
              title: 'Tell the AI your story',
              subtitle: 'A coach who actually listens',
              desc: 'You don\'t fill out a form. You have a conversation. A conversational AI guides you through understanding your specific challenges, goals, and emotional context — the things a template could never capture.',
              detail: 'The AI asks the right follow-up questions. It adapts to what you share. By the end of the conversation, it has everything it needs to create something deeply personal.',
              color: colors.accent.primary,
              tags: ['Conversational AI', 'No templates', 'Fully personalized'],
            },
            {
              n: '02',
              icon: Sparkles,
              title: 'AI scripts, voices, and delivers',
              subtitle: 'Your story. Your voice.',
              desc: 'Your practice is scripted around your exact situation — not generic wisdom. Then it\'s voiced using your cloned voice (from a 60-second recording) or a professional voice you choose.',
              detail: 'The audio is mixed, mastered, and ready for daily practice. Everything happens automatically — no recording studios, no editing, no technical skills required.',
              color: colors.accent.secondary,
              tags: ['Voice cloning', 'AI scripted', 'Ready in minutes'],
            },
            {
              n: '03',
              icon: Headphones,
              title: 'Practice daily. Grow forever.',
              subtitle: 'Voice repetition rewires the brain',
              desc: 'Your content lives in your personal library. Listen every morning, or whenever you need it. Research shows consistent voice-based repetition creates measurable neural change within 21–66 days.',
              detail: 'Practice is always free. No subscriptions, no replay limits, no pressure. Just you and your voice, building the identity you\'ve chosen — one morning at a time.',
              color: colors.accent.tertiary,
              tags: ['Free forever', 'Track progress', '21–66 day results'],
            },
          ].map(({ n, icon: Icon, title, subtitle, desc, detail, color, tags }, idx) => (
            <div key={n} className="hiw-step-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: borderRadius.xl, overflow: 'hidden', border: `1px solid ${colors.glass.border}`, background: colors.glass.light, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
              {/* Left — visual side (alternates) */}
              {idx % 2 === 0 ? (
                <>
                  <div style={{ padding: '64px 56px', background: `linear-gradient(135deg, ${color}12, ${color}04)`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: `radial-gradient(circle, ${color}18, transparent 70%)`, pointerEvents: 'none' }} />
                    <div style={{ fontSize: 120, fontWeight: 300, letterSpacing: '-4px', color: `${color}10`, lineHeight: 1, userSelect: 'none', marginBottom: 24 }}>{n}</div>
                    <div style={{ width: 72, height: 72, borderRadius: 20, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: `0 0 40px ${color}20` }}>
                      <Icon size={34} color={color} />
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {tags.map((tag) => (
                        <span key={tag} style={{ padding: '5px 12px', borderRadius: borderRadius.full, background: `${color}12`, border: `1px solid ${color}25`, fontSize: 11, color, fontWeight: 500 }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: '64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: 12, color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{subtitle}</div>
                    <h3 style={{ fontSize: 'clamp(24px, 2.5vw, 32px)', fontWeight: 400, color: colors.text.primary, margin: '0 0 20px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>{title}</h3>
                    <p style={{ fontSize: 16, color: colors.text.secondary, lineHeight: 1.75, margin: '0 0 20px' }}>{desc}</p>
                    <p style={{ fontSize: 15, color: colors.text.tertiary, lineHeight: 1.7, margin: 0 }}>{detail}</p>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ padding: '64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: 12, color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{subtitle}</div>
                    <h3 style={{ fontSize: 'clamp(24px, 2.5vw, 32px)', fontWeight: 400, color: colors.text.primary, margin: '0 0 20px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>{title}</h3>
                    <p style={{ fontSize: 16, color: colors.text.secondary, lineHeight: 1.75, margin: '0 0 20px' }}>{desc}</p>
                    <p style={{ fontSize: 15, color: colors.text.tertiary, lineHeight: 1.7, margin: 0 }}>{detail}</p>
                  </div>
                  <div style={{ padding: '64px 56px', background: `linear-gradient(135deg, ${color}12, ${color}04)`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: `radial-gradient(circle, ${color}18, transparent 70%)`, pointerEvents: 'none' }} />
                    <div style={{ fontSize: 120, fontWeight: 300, letterSpacing: '-4px', color: `${color}10`, lineHeight: 1, userSelect: 'none', marginBottom: 24, alignSelf: 'flex-start' }}>{n}</div>
                    <div style={{ width: 72, height: 72, borderRadius: 20, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: `0 0 40px ${color}20`, alignSelf: 'flex-start' }}>
                      <Icon size={34} color={color} />
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignSelf: 'flex-start' }}>
                      {tags.map((tag) => (
                        <span key={tag} style={{ padding: '5px 12px', borderRadius: borderRadius.full, background: `${color}12`, border: `1px solid ${color}25`, fontSize: 11, color, fontWeight: 500 }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Photo Divider #1 ──────────────────────────────── */}
      <section style={{ position: 'relative', height: 440, overflow: 'hidden' }}>
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
          alt="Person at peace in morning light"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
          unoptimized
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(6,2,20,0.75) 50%, rgba(6,2,20,0.95) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: `0 ${SECTION_PX}`, textAlign: 'center' }}>
          <blockquote style={{ fontSize: 'clamp(22px, 3vw, 40px)', fontWeight: 300, letterSpacing: '-0.8px', color: '#fff', lineHeight: 1.3, maxWidth: 760, margin: '0 0 24px', fontStyle: 'italic' }}>
            &ldquo;The first app that actually made me feel like I was talking to myself.&rdquo;
          </blockquote>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: 0 }}>Marcus T. — Entrepreneur, 34 days in</p>
        </div>
      </section>

      {/* ── Content Types Deep Dive ───────────────────────── */}
      <section style={{ padding: `${SECTION_PY} ${SECTION_PX}`, maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{ fontSize: 11, color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 16 }}>Three Content Types</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, letterSpacing: '-1.5px', color: colors.text.primary, margin: '0 0 20px' }}>Every depth of transformation</h2>
          <p style={{ fontSize: 19, color: colors.text.secondary, maxWidth: 560, margin: '0 auto', lineHeight: 1.6, fontWeight: 300 }}>Not interchangeable. Each type is engineered for a specific level of inner change — from daily reprogramming to permanent identity encoding.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {[
            {
              icon: Sun,
              name: 'Affirmations',
              tagline: 'Rewire your daily story',
              duration: '2–5 min',
              depth: 'Daily ritual',
              desc: 'Short, powerful statements voiced in your own words. Listen each morning to reprogram the beliefs that shape every decision you make.',
              color: colors.accent.primary,
              gradient: `linear-gradient(160deg, ${colors.accent.primary}18, ${colors.accent.secondary}06)`,
              outcome: 'Feel the shift in weeks.',
              science: 'Spaced repetition × personal voice = faster neural rewiring.',
            },
            {
              icon: Moon,
              name: 'Guided Meditations',
              tagline: 'Command your inner state',
              duration: '10–30 min',
              depth: 'State induction',
              desc: 'AI-scripted journeys through landscapes designed for your emotional goals. Your voice leads you exactly where you need to go.',
              color: colors.accent.secondary,
              gradient: `linear-gradient(160deg, ${colors.accent.secondary}18, rgba(99,102,241,0.06))`,
              outcome: 'Find calm on demand.',
              science: 'Theta brainwave entrainment for deep state change.',
            },
            {
              icon: Flame,
              name: 'Rituals',
              tagline: 'Encode your new identity',
              duration: '20–60 min',
              depth: 'Identity encoding',
              desc: 'Multi-part practices combining breathwork, visualization, and affirmations. The deepest level — designed to permanently encode a new self.',
              color: colors.accent.tertiary,
              gradient: `linear-gradient(160deg, ${colors.accent.tertiary}18, ${colors.accent.primary}06)`,
              outcome: 'Become someone new.',
              science: 'Somatic + cognitive integration for lasting identity shift.',
            },
          ].map(({ icon: Icon, name, tagline, duration, depth, desc, color, gradient, outcome, science }) => (
            <div key={name} style={{ borderRadius: borderRadius.xl, background: gradient, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: `1px solid ${color}22`, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = `0 40px 100px ${color}30`; e.currentTarget.style.borderColor = `${color}45`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = `${color}22`; }}
            >
              {/* Card top */}
              <div style={{ padding: '48px 40px 36px', position: 'relative', borderBottom: `1px solid ${color}12` }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 140, height: 140, borderRadius: '50%', background: `radial-gradient(circle, ${color}15, transparent 70%)`, pointerEvents: 'none' }} />
                <div style={{ width: 72, height: 72, borderRadius: 20, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, boxShadow: `0 0 40px ${color}20` }}>
                  <Icon size={34} color={color} />
                </div>
                <h3 style={{ fontSize: 26, fontWeight: 400, color: colors.text.primary, margin: '0 0 6px', letterSpacing: '-0.5px' }}>{name}</h3>
                <p style={{ fontSize: 14, color, fontWeight: 500, margin: 0, letterSpacing: '0.02em' }}>{tagline}</p>
              </div>
              {/* Card body */}
              <div style={{ padding: '32px 40px 40px', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <p style={{ fontSize: 15, color: colors.text.secondary, lineHeight: 1.7, margin: 0 }}>{desc}</p>
                <p style={{ fontSize: 12, color: colors.text.tertiary, lineHeight: 1.6, margin: 0, padding: '12px 16px', borderRadius: 10, background: `${color}08`, border: `1px solid ${color}15`, fontStyle: 'italic' }}>{science}</p>
                {/* Badge row — wraps naturally on narrow widths */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
                  <span style={{ padding: '5px 12px', borderRadius: borderRadius.full, background: `${color}14`, border: `1px solid ${color}28`, fontSize: 12, color, fontWeight: 500 }}>{duration}</span>
                  <span style={{ padding: '5px 12px', borderRadius: borderRadius.full, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: colors.text.secondary }}>{depth}</span>
                  <span style={{ fontSize: 12, color, fontWeight: 600, fontStyle: 'italic', marginLeft: 'auto' }}>{outcome}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── A Day in Practice ─────────────────────────────── */}
      <section style={{ padding: `${SECTION_PY} ${SECTION_PX}`, background: `linear-gradient(to bottom, transparent, ${colors.accent.primary}06, transparent)` }}>
        <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <div style={{ fontSize: 11, color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 16 }}>Daily Practice</div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, letterSpacing: '-1.5px', color: colors.text.primary, margin: '0 0 20px' }}>A morning that changes everything</h2>
            <p style={{ fontSize: 19, color: colors.text.secondary, maxWidth: 520, margin: '0 auto', lineHeight: 1.6, fontWeight: 300 }}>Five minutes. Your voice. A completely different trajectory for your day.</p>
          </div>

          <div className="hiw-timeline" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, position: 'relative' }}>
            {/* connecting line */}
            <div className="hiw-timeline-line" style={{ position: 'absolute', top: 52, left: '12.5%', right: '12.5%', height: 1, background: `linear-gradient(to right, ${colors.accent.primary}40, ${colors.accent.secondary}40, ${colors.accent.tertiary}40, ${colors.accent.primary}40)`, zIndex: 0 }} />

            {[
              { icon: Sunrise, time: '6:00 AM', label: 'Wake up', sub: 'Open waQup', color: colors.accent.primary },
              { icon: Headphones, time: '6:03 AM', label: 'Press play', sub: 'Your affirmation starts', color: colors.accent.secondary },
              { icon: Mic, time: '6:08 AM', label: 'You listen', sub: 'Your voice. Your words.', color: colors.accent.tertiary },
              { icon: RefreshCw, time: '6:10 AM', label: 'Shift happens', sub: 'Repeat daily', color: colors.accent.primary },
            ].map(({ icon: Icon, time, label, sub, color }, i) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '0 12px', position: 'relative', zIndex: 1 }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${color}15`, border: `2px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 6px ${color}08, 0 0 30px ${color}20` }}>
                  <Icon size={28} color={color} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: colors.text.tertiary, marginBottom: 4, fontWeight: 500 }}>{time}</div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: colors.text.primary, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 13, color: colors.text.secondary }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 72, padding: '40px 48px', borderRadius: borderRadius.xl, background: `linear-gradient(135deg, ${colors.accent.primary}10, ${colors.accent.secondary}06)`, border: `1px solid ${colors.accent.primary}20`, display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: colors.gradients.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={28} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <h4 style={{ fontSize: 22, fontWeight: 500, color: colors.text.primary, margin: '0 0 8px', letterSpacing: '-0.3px' }}>Just 5 minutes. That&apos;s all it takes to start.</h4>
              <p style={{ fontSize: 15, color: colors.text.secondary, lineHeight: 1.65, margin: 0 }}>Affirmations fit into the minutes you already have. No new schedule. No lifestyle overhaul. Just the same morning — with one powerful addition that compounds over time.</p>
            </div>
            <Link href="/signup" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <Button variant="primary" size="md" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Start today <ArrowRight size={16} color={colors.text.onDark} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── The Science ───────────────────────────────────── */}
      <section style={{ padding: `${SECTION_PY} ${SECTION_PX}`, maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto' }}>
        <div className="hiw-science" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          {/* Left — visual */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 480 }}>
            {/* Pulsing rings */}
            {[240, 320, 400].map((size, i) => (
              <div key={size} style={{ position: 'absolute', width: size, height: size, borderRadius: '50%', border: `1px solid ${colors.accent.primary}${i === 0 ? '35' : i === 1 ? '20' : '10'}`, animation: `wqRingPulse ${2.5 + i * 0.7}s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }} />
            ))}
            {/* Core */}
            <div style={{ width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle at 40% 40%, ${colors.accent.primary}60, ${colors.accent.secondary}40, ${colors.accent.primary}20)`, boxShadow: `0 0 80px ${colors.accent.primary}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Brain size={56} color="#fff" />
            </div>
            {/* Floating labels */}
            {[
              { label: 'Neuroplasticity', x: '-130px', y: '-60px', color: colors.accent.primary },
              { label: 'Voice memory', x: '100px', y: '-80px', color: colors.accent.secondary },
              { label: '21-day rewire', x: '-110px', y: '70px', color: colors.accent.tertiary },
              { label: 'Subconscious shift', x: '80px', y: '80px', color: colors.accent.primary },
            ].map(({ label, x, y, color }) => (
              <div key={label} style={{ position: 'absolute', left: `calc(50% + ${x})`, top: `calc(50% + ${y})`, transform: 'translate(-50%, -50%)', padding: '6px 14px', borderRadius: borderRadius.full, background: `${color}15`, border: `1px solid ${color}30`, fontSize: 11, color, fontWeight: 600, whiteSpace: 'nowrap' }}>
                {label}
              </div>
            ))}
          </div>

          {/* Right — copy */}
          <div>
            <div style={{ fontSize: 11, color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 16 }}>The Science</div>
            <h2 style={{ fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 300, letterSpacing: '-1.2px', color: colors.text.primary, margin: '0 0 28px', lineHeight: 1.15 }}>Built on how brains actually change.</h2>
            <p style={{ fontSize: 17, color: colors.text.secondary, lineHeight: 1.75, margin: '0 0 24px' }}>
              Neuroplasticity — the brain&apos;s ability to rewire itself — is most powerfully activated through repeated exposure to emotionally resonant stimuli. Your own voice is the most resonant stimulus your brain knows.
            </p>
            <p style={{ fontSize: 16, color: colors.text.secondary, lineHeight: 1.75, margin: '0 0 40px' }}>
              When you hear yourself say &ldquo;I am confident&rdquo; daily for 21 days, your neural pathways literally change. Not metaphorically. Not inspirationally. Measurably.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: '21 days', desc: 'to notice the first measurable shift' },
                { label: '66 days', desc: 'for new patterns to become automatic' },
                { label: 'Your voice', desc: 'activates deeper pathways than any other voice' },
              ].map(({ label, desc }) => (
                <div key={label} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${colors.accent.primary}20`, border: `1px solid ${colors.accent.primary}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Check size={11} color={colors.accent.primary} strokeWidth={3} />
                  </div>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: colors.text.primary }}>{label}</span>
                    <span style={{ fontSize: 15, color: colors.text.secondary }}> — {desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Photo Divider #2 ──────────────────────────────── */}
      <section style={{ padding: `${SECTION_PY} ${SECTION_PX}` }}>
        <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, borderRadius: borderRadius.xl, overflow: 'hidden' }}>
          {/* Photo cell */}
          <div style={{ position: 'relative', minHeight: 400, borderRadius: borderRadius.xl, overflow: 'hidden' }}>
            <Image
              src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=900&q=80"
              alt="Woman listening with headphones in morning light"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
              unoptimized
            />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, transparent, ${colors.accent.primary}30)` }} />
          </div>
          {/* Copy cell */}
          <div style={{ padding: '56px 52px', background: `linear-gradient(135deg, ${colors.accent.primary}12, ${colors.accent.secondary}06)`, border: `1px solid ${colors.accent.primary}20`, borderRadius: borderRadius.xl, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 11, color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 16 }}>Voice Cloning</div>
            <h3 style={{ fontSize: 'clamp(26px, 2.5vw, 36px)', fontWeight: 300, letterSpacing: '-0.8px', color: colors.text.primary, margin: '0 0 20px', lineHeight: 1.2 }}>Hear yourself say it.<br />Something shifts permanently.</h3>
            <p style={{ fontSize: 16, color: colors.text.secondary, lineHeight: 1.75, margin: '0 0 32px' }}>Record just 60 seconds of your natural speaking voice. waQup clones it — then uses it to voice every piece of content you create. It&apos;s the difference between a stranger telling you who to be, and your own voice reminding you who you already are.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ padding: '10px 20px', borderRadius: borderRadius.full, background: `${colors.accent.primary}15`, border: `1px solid ${colors.accent.primary}30`, fontSize: 13, color: colors.accent.primary, fontWeight: 500 }}>60 sec recording</div>
              <div style={{ padding: '10px 20px', borderRadius: borderRadius.full, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 13, color: colors.text.secondary }}>Optional</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section style={{ padding: `${SECTION_PY} ${SECTION_PX}`, background: `linear-gradient(to bottom, transparent, ${colors.accent.primary}06, transparent)` }}>
        <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <div style={{ fontSize: 11, color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 16 }}>Real Transformations</div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, letterSpacing: '-1.5px', color: colors.text.primary, margin: 0 }}>Voice transformation works.<br />Here&apos;s the proof.</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
            {[
              { q: 'The first app that actually made me feel like I was talking to myself. Hearing MY voice tell me I\'m capable hits so differently than reading it off a screen.', n: 'Marcus T.', r: 'Entrepreneur, 34', day: '30 days in' },
              { q: 'After 30 days of morning affirmations, I can\'t believe who I\'m becoming. I speak up in meetings now. I didn\'t think an app could actually do this to me.', n: 'Sarah M.', r: 'Teacher, 28', day: '21 days in' },
              { q: 'I\'ve tried every meditation app out there. waQup is the only one that feels truly personal. The ritual creation flow is like therapy on demand — but it\'s mine.', n: 'Emma L.', r: 'Designer, 31', day: '66 days in' },
            ].map(({ q, n, r, day }) => (
              <div key={n} style={{ padding: '44px 44px', borderRadius: borderRadius.xl, background: colors.glass.light, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: `1px solid ${colors.glass.border}`, display: 'flex', flexDirection: 'column', gap: 28, transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.borderColor = `${colors.accent.primary}30`; e.currentTarget.style.boxShadow = `0 32px 80px ${colors.accent.primary}25`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = colors.glass.border; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px 18px', background: `${colors.accent.primary}15`, borderRadius: '0 24px 0 12px', fontSize: 11, color: colors.accent.tertiary, fontWeight: 600 }}>{day}</div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} color="#F59E0B" fill="#F59E0B" />)}
                </div>
                <p style={{ fontSize: 17, color: colors.text.primary, lineHeight: 1.75, margin: 0, fontStyle: 'italic', flex: 1 }}>&ldquo;{q}&rdquo;</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: colors.gradients.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 600, color: '#fff', flexShrink: 0 }}>{n[0]}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: colors.text.primary }}>{n}</div>
                    <div style={{ fontSize: 13, color: colors.text.secondary }}>{r}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Before / After ────────────────────────────────── */}
      <section style={{ padding: `${SECTION_PY} ${SECTION_PX}` }}>
        <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <div style={{ fontSize: 11, color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 16 }}>The Difference</div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, letterSpacing: '-1.5px', color: colors.text.primary, margin: 0 }}>Something in you knows it&apos;s time.</h2>
          </div>

          <div className="hiw-before-after" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: borderRadius.xl, overflow: 'hidden', border: `1px solid ${colors.glass.border}` }}>
            <div style={{ padding: '56px 48px', background: 'rgba(0,0,0,0.5)', borderRight: `1px solid ${colors.glass.border}` }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: borderRadius.full, background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.2)', marginBottom: 36 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF6B6B' }} />
                <span style={{ fontSize: 11, color: '#FF8888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Before waQup</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[
                  'Replaying the same limiting stories in your head',
                  'Generic meditations made for strangers, not you',
                  'Inconsistent practice that never quite sticks',
                  'Progress feels invisible, motivation fades',
                  'Waiting for the "right moment" that never comes',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,100,100,0.12)', border: '1px solid rgba(255,100,100,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <X size={11} color="#FF8888" strokeWidth={2.5} />
                    </div>
                    <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '56px 48px', background: `linear-gradient(135deg, ${colors.accent.primary}10, ${colors.accent.secondary}06)` }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: borderRadius.full, background: `${colors.accent.primary}20`, border: `1px solid ${colors.accent.primary}35`, marginBottom: 36 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#A855F7', animation: 'wqPulse 2s ease-in-out infinite' }} />
                <span style={{ fontSize: 11, color: '#A855F7', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>With waQup</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[
                  'Your own voice guides you to who you\'re becoming',
                  'Content crafted around your exact challenges and goals',
                  'A ritual so personal it becomes non-negotiable',
                  'Shifts you can feel after just 21 days',
                  'Ready in minutes. Practiced forever, free.',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${colors.accent.primary}20`, border: `1px solid ${colors.accent.primary}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <Check size={11} color="#A855F7" strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: 15, color: colors.text.primary, lineHeight: 1.55, fontWeight: 400 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section style={{ padding: `${SECTION_PY} ${SECTION_PX}`, maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, letterSpacing: '-1.5px', color: colors.text.primary, margin: '0 0 20px' }}>Q&amp;A</h2>
          <p style={{ fontSize: 18, color: colors.text.secondary, margin: 0 }}>Everything you want to know before you begin.</p>
        </div>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map(({ q, a }) => <FAQItem key={q} q={q} a={a} colors={colors} />)}
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <section style={{ padding: `${SECTION_PY} ${SECTION_PX}`, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, height: 800, borderRadius: '50%', background: `radial-gradient(circle, ${colors.accent.primary}14 0%, transparent 65%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: CONTENT_NARROW, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 24 }}>Your transformation starts here</div>
          <h2 style={{ fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 300, letterSpacing: '-2px', color: colors.text.primary, lineHeight: 1.1, margin: '0 0 24px' }}>
            The person you want to be<br />
            <span style={{ background: colors.gradients.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>is waiting for your voice.</span>
          </h2>
          <p style={{ fontSize: 19, color: colors.text.secondary, lineHeight: 1.65, margin: '0 0 52px', fontWeight: 300 }}>Join thousands already using their own voice to rewire their subconscious. Your first content is on us.</p>
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="lg" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: '20px', padding: '20px 52px', boxShadow: `0 16px 64px ${colors.accent.primary}55` }}>
              Start Free Today <ArrowRight size={22} color={colors.text.onDark} />
            </Button>
          </Link>
          <p style={{ fontSize: 13, color: colors.text.tertiary, marginTop: 24 }}>No credit card required · Practice is always free · Cancel anytime</p>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer style={{ padding: `40px ${SECTION_PX}`, borderTop: `1px solid ${colors.glass.border}` }}>
        <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <span style={{ fontSize: 22, fontWeight: 300, color: colors.text.primary, letterSpacing: '-0.5px' }}>wa<span style={{ color: colors.accent.tertiary }}>Q</span>up</span>
          <div style={{ display: 'flex', gap: 40 }}>
            {[['Pricing', '/pricing'], ['Launch', '/launch'], ['Sign Up', '/signup']].map(([label, href]) => (
              <Link key={label} href={href} style={{ textDecoration: 'none', fontSize: 14, color: colors.text.tertiary }}>{label}</Link>
            ))}
          </div>
          <Typography variant="caption" style={{ color: colors.text.tertiary }}>© 2026 waQup</Typography>
        </div>
      </footer>

      {/* ── Global Styles ─────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes wqPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes wqProgressFill { 0%{width:30%} 100%{width:88%} }
        @keyframes wqSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes wqRingPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.06);opacity:0.6} }

        .hiw-hero { flex-direction: row; }
        .hiw-hero-mockup { display: flex; justify-content: center; flex-shrink: 0; }
        .hiw-step-card { grid-template-columns: 1fr 1fr; }
        .hiw-science { grid-template-columns: 1fr 1fr; }
        .hiw-timeline { grid-template-columns: repeat(4, 1fr); }

        @media (max-width: 960px) {
          .hiw-hero { flex-direction: column !important; padding-top: 60px !important; padding-bottom: 60px !important; min-height: auto !important; align-items: flex-start !important; }
          .hiw-hero-mockup { width: 100%; padding: 32px 0; }
          .hiw-step-card { grid-template-columns: 1fr !important; }
          .hiw-science { grid-template-columns: 1fr !important; }
          .hiw-before-after { grid-template-columns: 1fr !important; }
          .hiw-timeline { grid-template-columns: repeat(2, 1fr) !important; gap: 40px !important; }
          .hiw-timeline-line { display: none !important; }
        }

        @media (max-width: 600px) {
          .hiw-timeline { grid-template-columns: 1fr !important; }
        }
      `}} />
    </PageShell>
  );
}
