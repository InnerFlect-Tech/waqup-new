'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { PageShell, WaitlistCTA } from '@/components';
import { spacing, borderRadius, BLUR, FROSTED_GLASS_HERO, imageEdgeFades, HERO_OVERLAY_QUOTE } from '@/theme';
import { CONTENT_MAX_WIDTH, CONTENT_NARROW, CONTENT_MEDIUM, PAGE_PADDING } from '@/theme';
import { QS_EXPLANATION, PRACTICE_IS_FREE_ONE_LINER, VOICE_CLONING_COPY, CONTENT_TYPE_COLORS } from '@waqup/shared/constants';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { ContentIcon } from '@/components';
import {
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
  Brain,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ThemeColors = ReturnType<typeof useTheme>['theme']['colors'];

// ─── Phone Mockup (same as launch page) ──────────────────────────────────────

const SANCTUARY_ITEMS = [
  { iconSrc: '/images/icon-affirmations.png', label: 'Affirmations', sub: 'Rewire your beliefs', color: CONTENT_TYPE_COLORS.affirmation },
  { iconSrc: '/images/icon-meditations.png', label: 'Meditations', sub: 'Induce calm states', color: CONTENT_TYPE_COLORS.meditation },
  { iconSrc: '/images/icon-rituals.png', label: 'Rituals', sub: 'Encode identity', color: CONTENT_TYPE_COLORS.ritual },
];

function SanctuaryScreen({ colors }: { colors: ThemeColors }) {
  return (
    <div style={{ height: '100%', background: '#060606', padding: '18px 16px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 3 }}>Good morning</div>
        <div style={{ fontSize: 16, fontWeight: 300, color: '#fff', letterSpacing: -0.5 }}>Ready to transform? ✨</div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
        {SANCTUARY_ITEMS.map(({ iconSrc, label, sub, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px', borderRadius: 13, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <ContentIcon src={iconSrc} size={34} borderRadius={9} style={{ background: `${color}20`, border: `1px solid ${color}40`, flexShrink: 0 }} />
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
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: item === 'Home' ? colors.accent.primary : 'transparent' }} />
            <div style={{ fontSize: 9, color: item === 'Home' ? colors.accent.tertiary : 'rgba(255,255,255,0.3)' }}>{item}</div>
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

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

const faqs = [
  { q: 'How is waQup different from Headspace or Calm?', a: 'Headspace and Calm give you generic content made by strangers. waQup creates personalized content based on YOUR specific goals, challenges, and context, voiced in your own cloned voice. Nothing is generic. Everything is yours.' },
  { q: 'Do I need to record my own voice?', a: `No. ${VOICE_CLONING_COPY}` },
  { q: 'How do Qs work?', a: QS_EXPLANATION.faq },
  { q: 'Is practice really free forever?', a: 'Yes. Once your affirmations, meditations, or rituals are created, you can replay them as many times as you want, forever, for free. We believe daily practice should never be gated behind a paywall.' },
  { q: 'What are the three content types?', a: 'Affirmations are short 2–5 min cognitive re-patterning statements for morning routines. Guided Meditations are 10–30 min AI-scripted sessions for state induction. Rituals are 20–60 min multi-part practices for the deepest identity transformation.' },
  { q: 'What is the science behind this?', a: 'waQup is built on neuroplasticity research: the brain\'s ability to rewire itself through repeated exposure. Hearing positive self-statements in your own voice activates deeper neural pathways than reading or hearing a stranger\'s voice.' },
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

const SECTION_PY = '72px';

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HowItWorksPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PageShell intensity="high" bare allowDocumentScroll>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hiw-hero" style={{ padding: `${spacing.xxl} ${PAGE_PADDING}`, maxWidth: CONTENT_MAX_WIDTH, marginLeft: 'auto', marginRight: 'auto', minHeight: 'calc(100dvh - 64px)', display: 'flex', alignItems: 'center', gap: `calc(${spacing.xxxl} + ${spacing.md})`, boxSizing: 'border-box' }}>
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
            Three steps. Your voice. Scientifically designed to rewire the subconscious patterns that shape who you are, and who you&apos;re becoming.
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
      <div style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="hiw-step-divider" style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', padding: `${spacing.xxl} ${PAGE_PADDING}`, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
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
      <section style={{ position: 'relative', zIndex: 10, padding: `${SECTION_PY} ${PAGE_PADDING}`, maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
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
              desc: 'You don\'t fill out a form. You have a conversation. A conversational AI guides you through your specific challenges, goals, and emotional context. The things a template could never capture.',
              detail: 'The AI asks the right follow-up questions. It adapts to what you share. By the end of the conversation, it has everything it needs to create something deeply personal.',
              color: colors.accent.primary,
              tags: ['Conversational AI', 'No templates', 'Fully personalized'],
            },
            {
              n: '02',
              icon: Sparkles,
              title: 'AI scripts, voices, and delivers',
              subtitle: 'Your story. Your voice.',
              desc: 'Your practice is scripted around your exact situation, not generic wisdom. Then it\'s voiced using your cloned voice (from a 60-second recording) or a professional voice you choose.',
              detail: 'The audio is mixed, mastered, and ready for daily practice. Everything happens automatically: no recording studios, no editing, no technical skills required.',
              color: colors.accent.secondary,
              tags: ['Voice cloning', 'AI scripted', 'Ready in minutes'],
            },
            {
              n: '03',
              icon: Headphones,
              title: 'Practice daily. Grow forever.',
              subtitle: 'Voice repetition rewires the brain',
              desc: 'Each morning, press play and hear your own voice guide you. Research shows consistent self-voice repetition creates measurable neural change within 21–66 days.',
              detail: 'Practice is always free. No subscriptions, no replay limits, no pressure. Just you and your voice, building the identity you\'ve chosen — one morning at a time.',
              color: colors.accent.tertiary,
              tags: ['Free forever', 'Track progress', '21–66 day results'],
            },
          ].map(({ n, icon: Icon, title, subtitle, desc, detail, color, tags }, idx) => (
            <div key={n} className="hiw-step-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: borderRadius.xl, overflow: 'hidden', border: `1px solid ${colors.glass.border}`, background: colors.glass.light, backdropFilter: BLUR.xl, WebkitBackdropFilter: BLUR.xl }}>
              {/* Left — visual side (alternates) */}
              {idx % 2 === 0 ? (
                <>
                  {/* Photo panel */}
                  <div className="hiw-step-visual" style={{ position: 'relative', minHeight: 420, overflow: 'hidden' }}>
                    <Image
                      src={`/images/${['feature-create', 'feature-sanctuary', 'feature-listen'][idx]}.png`}
                      alt={title}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center top' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(6,2,20,0.05), rgba(6,2,20,0.3)), linear-gradient(to top, rgba(6,2,20,0.5) 0%, transparent 60%)' }} />
                    {/* Number + tags overlay */}
                    <div style={{ position: 'absolute', bottom: 32, left: 36, right: 36, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ fontSize: 72, fontWeight: 300, letterSpacing: '-3px', color: 'rgba(255,255,255,0.18)', lineHeight: 1 }}>{n}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {tags.map((tag) => (
                          <span key={tag} style={{ padding: '5px 12px', borderRadius: borderRadius.full, background: 'rgba(0,0,0,0.45)', backdropFilter: BLUR.sm, WebkitBackdropFilter: BLUR.sm, border: `1px solid ${color}40`, fontSize: 11, color, fontWeight: 500 }}>{tag}</span>
                        ))}
                      </div>
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
                  {/* Photo panel */}
                  <div className="hiw-step-visual" style={{ position: 'relative', minHeight: 420, overflow: 'hidden' }}>
                    <Image
                      src={`/images/${['feature-create', 'feature-sanctuary', 'feature-listen'][idx]}.png`}
                      alt={title}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center top' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(6,2,20,0.05), rgba(6,2,20,0.3)), linear-gradient(to top, rgba(6,2,20,0.5) 0%, transparent 60%)' }} />
                    {/* Number + tags overlay */}
                    <div style={{ position: 'absolute', bottom: 32, left: 36, right: 36, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ fontSize: 72, fontWeight: 300, letterSpacing: '-3px', color: 'rgba(255,255,255,0.18)', lineHeight: 1 }}>{n}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {tags.map((tag) => (
                          <span key={tag} style={{ padding: '5px 12px', borderRadius: borderRadius.full, background: 'rgba(0,0,0,0.45)', backdropFilter: BLUR.sm, WebkitBackdropFilter: BLUR.sm, border: `1px solid ${color}40`, fontSize: 11, color, fontWeight: 500 }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Photo Divider #1 ──────────────────────────────── */}
      <section style={{ position: 'relative', height: 500, overflow: 'visible' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <Image
            src="/images/hero-transform.png"
            alt="Person in transformation — headphones, cosmic identity shift"
            fill
            unoptimized
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          />
        </div>
        <div style={{ ...imageEdgeFades(colors.background.primary).top }} />
        <div style={{ ...imageEdgeFades(colors.background.primary).bottom }} />
        <div style={{ ...imageEdgeFades(colors.background.primary).left }} />
        <div style={{ ...imageEdgeFades(colors.background.primary).right }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: `0 ${PAGE_PADDING}`, textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{ padding: '48px 56px', maxWidth: 820, ...FROSTED_GLASS_HERO, borderRadius: 24 }}>
            <blockquote style={{ margin: '0 0 24px', ...HERO_OVERLAY_QUOTE }}>
              &ldquo;The first app that actually made me feel like I was talking to myself.&rdquo;
            </blockquote>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.75)', margin: 0, letterSpacing: '0.1em', textTransform: 'uppercase', textShadow: '0 1px 12px rgba(0,0,0,0.4)' }}>
              Marcus T. &nbsp;·&nbsp; Entrepreneur &nbsp;·&nbsp; 34 days in
            </p>
          </div>
        </div>
      </section>

      {/* ── Content Types Deep Dive ───────────────────────── */}
      <section style={{ position: 'relative', zIndex: 10, padding: `${SECTION_PY} ${PAGE_PADDING}`, maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ fontSize: 11, color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 16, paddingLeft: '0.12em' }}>Three Content Types</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, letterSpacing: '-1.5px', color: colors.text.primary, margin: '0 0 20px' }}>Every depth of transformation</h2>
          <p style={{ fontSize: 19, color: colors.text.secondary, maxWidth: 560, margin: '0 auto', lineHeight: 1.6, fontWeight: 300 }}>Not interchangeable. Each type is engineered for a specific level of inner change, from daily reprogramming to permanent identity encoding.</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.lg, marginTop: 28, flexWrap: 'wrap' }}>
            {[
              { src: '/images/icon-affirmations.png', label: 'Affirmations' },
              { src: '/images/icon-meditations.png', label: 'Meditations' },
              { src: '/images/icon-rituals.png', label: 'Rituals' },
              { src: '/images/icon-voice.png', label: 'Your voice' },
              { src: '/images/icon-listen.png', label: 'Listen' },
              { src: '/images/icon-q-coin.png', label: 'Qs' },
            ].map(({ src, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <ContentIcon src={src} size={56} borderRadius={14} />
                <span style={{ fontSize: 11, color: colors.text.tertiary, fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {[
            {
              iconSrc: '/images/icon-affirmations.png',
              name: 'Affirmations',
              tagline: 'Rewire your daily story',
              duration: '2–5 min',
              depth: 'Daily ritual',
              desc: 'Short, powerful statements voiced in your own words. Listen each morning to reprogram the beliefs that shape every decision you make.',
              color: colors.accent.primary,
              gradient: `linear-gradient(160deg, ${colors.accent.primary}18, ${colors.accent.secondary}06)`,
              outcome: 'Feel the shift in weeks.',
              science: 'Spaced repetition + personal voice = faster neural rewiring.',
            },
            {
              iconSrc: '/images/icon-meditations.png',
              name: 'Guided Meditations',
              tagline: 'Command your inner state',
              duration: '10–30 min',
              depth: 'State induction',
              desc: 'AI-scripted journeys designed for your emotional goals, voiced by you. You hear your own voice guide you to exactly where you need to go.',
              color: colors.accent.secondary,
              gradient: `linear-gradient(160deg, ${colors.accent.secondary}18, rgba(99,102,241,0.06))`,
              outcome: 'Find calm on demand.',
              science: 'Theta brainwave entrainment for deep state change.',
            },
            {
              iconSrc: '/images/icon-rituals.png',
              name: 'Rituals',
              tagline: 'Encode your new identity',
              duration: '20–60 min',
              depth: 'Identity encoding',
              desc: 'Multi-part practices combining breathwork, visualization, and affirmations, all voiced by you. Hearing yourself through the deepest work is what makes it stick.',
              color: colors.accent.tertiary,
              gradient: `linear-gradient(160deg, ${colors.accent.tertiary}18, ${colors.accent.primary}06)`,
              outcome: 'Become someone new.',
              science: 'Somatic + cognitive integration for lasting identity shift.',
            },
          ].map(({ iconSrc, name, tagline, duration, depth, desc, color, gradient, outcome, science }) => (
            <div key={name} style={{ borderRadius: borderRadius.xl, background: gradient, backdropFilter: BLUR.xl, WebkitBackdropFilter: BLUR.xl, border: `1px solid ${color}22`, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = `0 40px 100px ${color}30`; e.currentTarget.style.borderColor = `${color}45`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = `${color}22`; }}
            >
              {/* Card top */}
              <div style={{ padding: '48px 40px 36px', position: 'relative', borderBottom: `1px solid ${color}12` }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 140, height: 140, borderRadius: '50%', background: `radial-gradient(circle, ${color}15, transparent 70%)`, pointerEvents: 'none' }} />
                <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <div style={{ background: `${color}18`, border: `1px solid ${color}30`, borderRadius: 20, padding: 4, boxShadow: `0 0 40px ${color}20` }}>
                    <ContentIcon src={iconSrc} size={64} borderRadius={16} />
                  </div>
                </div>
                <h3 style={{ fontSize: 26, fontWeight: 400, color: colors.text.primary, margin: '0 0 6px', letterSpacing: '-0.5px' }}>{name}</h3>
                <p style={{ fontSize: 14, color, fontWeight: 500, margin: 0, letterSpacing: '0.02em' }}>{tagline}</p>
              </div>
              {/* Card body */}
              <div style={{ padding: '32px 40px 40px', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <p style={{ fontSize: 15, color: colors.text.secondary, lineHeight: 1.7, margin: 0 }}>{desc}</p>
                <p style={{ fontSize: 12, color: colors.text.secondary, lineHeight: 1.6, margin: 0, padding: '12px 16px', borderRadius: 10, background: `${color}10`, border: `1px solid ${color}20`, fontStyle: 'italic' }}>{science}</p>
                {/* Footer */}
                <div style={{ borderTop: `1px solid ${color}18`, paddingTop: 20, marginTop: 'auto' }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 14, justifyContent: 'center' }}>
                    <span style={{ padding: '5px 14px', borderRadius: borderRadius.full, background: `${color}14`, border: `1px solid ${color}30`, fontSize: 12, color, fontWeight: 500, letterSpacing: '0.01em' }}>{duration}</span>
                    <span style={{ padding: '5px 14px', borderRadius: borderRadius.full, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 12, color: colors.text.secondary, letterSpacing: '0.01em' }}>{depth}</span>
                  </div>
                  <p style={{ fontSize: 13, color, fontWeight: 600, fontStyle: 'italic', letterSpacing: '0.01em', textAlign: 'center', margin: 0 }}>{outcome}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Day & Night Practice ─────────────────────────── */}
      <section style={{ padding: `${SECTION_PY} ${PAGE_PADDING}`, background: `linear-gradient(to bottom, transparent, ${colors.accent.primary}06, transparent)` }}>
        <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 16 }}>Daily Practice</div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, letterSpacing: '-1.5px', color: colors.text.primary, margin: '0 0 20px' }}>Day and night. A practice that changes everything.</h2>
            <p style={{ fontSize: 19, color: colors.text.secondary, maxWidth: 560, margin: '0 auto', lineHeight: 1.6, fontWeight: 300 }}>After waking up. Before sleep. Your voice bookends the day — with theta-wave calm at night.</p>
          </div>

          <div className="hiw-timeline" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0, position: 'relative' }}>
            <div className="hiw-timeline-line" style={{ position: 'absolute', top: 44, left: '8.33%', right: '8.33%', height: 1, background: `linear-gradient(to right, ${colors.accent.primary}40, ${colors.accent.secondary}40, ${colors.accent.tertiary}40, ${colors.accent.secondary}40, ${colors.accent.primary}40, ${colors.accent.secondary}40)`, zIndex: 0 }} />
            {[
              { icon: Sunrise, time: '6:00 AM', label: 'Wake up', sub: 'Open waQup', color: colors.accent.primary, isListen: false },
              { icon: Headphones, time: '6:05 AM', label: 'You listen', sub: 'Your affirmation', color: colors.accent.secondary, isListen: true },
              { icon: RefreshCw, time: '6:10 AM', label: 'Shift happens', sub: 'Set your day', color: colors.accent.tertiary, isListen: false },
              { icon: Moon, time: '9:30 PM', label: 'Wind down', sub: 'Open waQup', color: colors.accent.secondary, isListen: false },
              { icon: Brain, time: '9:40 PM', label: 'You listen', sub: 'Theta waves, 4–8 Hz', color: colors.accent.primary, isListen: true },
              { icon: RefreshCw, time: '9:50 PM', label: 'Sleep well', sub: 'Restorative rest', color: colors.accent.secondary, isListen: false },
            ].map(({ icon: Icon, time, label, sub, color, isListen }, i) => (
              <div key={`${time}-${label}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '0 8px', position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    width: isListen ? 88 : 72,
                    height: isListen ? 88 : 72,
                    borderRadius: '50%',
                    background: isListen ? `${color}25` : `${color}15`,
                    border: isListen ? `2px solid ${color}` : `2px solid ${color}35`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isListen ? `0 0 0 8px ${color}15, 0 0 40px ${color}40, 0 0 60px ${color}20` : `0 0 0 6px ${color}08, 0 0 30px ${color}20`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Icon size={isListen ? 32 : 28} color={color} />
                </div>
                {isListen && (
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color, textTransform: 'uppercase', marginTop: -4 }}>Listen</span>
                )}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: colors.text.tertiary, marginBottom: 4, fontWeight: 500 }}>{time}</div>
                  <div style={{ fontSize: isListen ? 17 : 16, fontWeight: isListen ? 600 : 500, color: colors.text.primary, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 13, color: colors.text.secondary }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: colors.text.tertiary, marginTop: 28, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>Theta waves (4–8 Hz) dominate sleep onset and deep relaxation. Evening meditation increases theta power — helping you wind down and sleep better.</p>

          <div style={{ marginTop: 72, padding: '40px 48px', borderRadius: borderRadius.xl, background: `linear-gradient(135deg, ${colors.accent.primary}10, ${colors.accent.secondary}06)`, border: `1px solid ${colors.accent.primary}20`, display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: colors.gradients.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={28} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <h4 style={{ fontSize: 22, fontWeight: 500, color: colors.text.primary, margin: '0 0 8px', letterSpacing: '-0.3px' }}>Just 5 minutes morning and night. That&apos;s all it takes.</h4>
              <p style={{ fontSize: 15, color: colors.text.secondary, lineHeight: 1.65, margin: 0 }}>Affirmations after waking up set your day. Meditations before sleep help theta waves (4–8 Hz) support relaxation and memory consolidation. No new schedule. No lifestyle overhaul. Just two bookends that compound over time.</p>
            </div>
            <Link href="/waitlist" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <Button variant="primary" size="md" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Join the waitlist <ArrowRight size={16} color={colors.text.onDark} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── The Science ───────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 10, padding: `${SECTION_PY} ${PAGE_PADDING}`, maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto' }}>
        <div className="hiw-science" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          {/* Left — neuroplasticity image, no card border */}
          <div style={{ position: 'relative', minHeight: 560 }}>
            <Image
              src="/images/neuroplasticity-visual.png"
              alt="Neural pathways lighting up as sound waves enter the brain"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center center' }}
            />
            {/* Dissolve all 4 edges into page background */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 55% 50%, transparent 45%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,1) 100%)' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, transparent 100%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 100%)' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '20%', background: 'linear-gradient(to right, rgba(0,0,0,1) 0%, transparent 100%)' }} />
            {/* Labels — anchored bottom-left, stacked naturally */}
            <div style={{ position: 'absolute', bottom: 52, left: 28, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
              {[
                { label: 'Neuroplasticity', color: colors.accent.primary },
                { label: 'Voice memory', color: colors.accent.secondary },
                { label: '21-day rewire', color: colors.accent.tertiary },
                { label: 'Subconscious shift', color: colors.accent.primary },
              ].map(({ label, color }) => (
                <div key={label} style={{ padding: '5px 13px', borderRadius: borderRadius.full, background: 'rgba(0,0,0,0.7)', backdropFilter: BLUR.md, WebkitBackdropFilter: BLUR.md, border: `1px solid ${color}35`, fontSize: 11, color, fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right — copy */}
          <div>
            <div style={{ fontSize: 11, color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 16 }}>The Science</div>
            <h2 style={{ fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 300, letterSpacing: '-1.2px', color: colors.text.primary, margin: '0 0 28px', lineHeight: 1.15 }}>Built on how brains actually change.</h2>
            <p style={{ fontSize: 17, color: colors.text.secondary, lineHeight: 1.75, margin: '0 0 24px' }}>
              The brain rewires itself through repeated exposure to emotionally resonant stimuli. No stimulus is more resonant to your brain than your own voice.
            </p>
            <p style={{ fontSize: 16, color: colors.text.secondary, lineHeight: 1.75, margin: '0 0 40px' }}>
              Hear yourself say &ldquo;I am confident&rdquo; daily for 21 days and your neural pathways literally change. Not metaphorically. Measurably.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: '21 days', desc: 'to notice the first measurable shift' },
                { label: '66 days', desc: 'for new patterns to become fully automatic' },
                { label: 'Your voice', desc: 'activates deeper neural pathways than any other' },
              ].map(({ label, desc }) => (
                <div key={label} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${colors.accent.primary}20`, border: `1px solid ${colors.accent.primary}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Check size={11} color={colors.accent.primary} strokeWidth={3} />
                  </div>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: colors.text.primary }}>{label} </span>
                    <span style={{ fontSize: 15, color: colors.text.secondary }}>{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Photo Divider #2 (Voice Cloning) ───────────────── */}
      <section style={{ position: 'relative', height: 560, overflow: 'visible' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <Image
            src="/images/voice-cloning-hero.png"
            alt="Person with headphones in cosmic transformation"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center center' }}
            unoptimized
          />
        </div>
        <div style={{ ...imageEdgeFades(colors.background.primary).top }} />
        <div style={{ ...imageEdgeFades(colors.background.primary).bottom }} />
        <div style={{ ...imageEdgeFades(colors.background.primary).left }} />
        <div style={{ ...imageEdgeFades(colors.background.primary).right }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', padding: `0 ${PAGE_PADDING}` }}>
            <div style={{ maxWidth: 520, padding: '48px 56px', ...FROSTED_GLASS_HERO, borderRadius: 24 }}>
              <div style={{ fontSize: 11, color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 20 }}>Voice Cloning</div>
              <h3 style={{ fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 300, letterSpacing: '-1px', color: '#fff', margin: '0 0 24px', lineHeight: 1.15, textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
                Hear yourself say it.<br />
                <span style={{ background: colors.gradients.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Something shifts permanently.</span>
              </h3>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', lineHeight: 1.75, margin: '0 0 32px', fontWeight: 300 }}>
                Record 60 seconds of your natural voice. waQup clones it, then voices everything you create. Your own voice reminding you who you already are.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ padding: '10px 22px', borderRadius: borderRadius.full, background: `${colors.accent.primary}25`, border: `1px solid ${colors.accent.primary}50`, fontSize: 13, color: '#C084FC', fontWeight: 500 }}>60 sec recording</div>
                <div style={{ padding: '10px 22px', borderRadius: borderRadius.full, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Optional</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 10, padding: `${SECTION_PY} ${PAGE_PADDING}`, background: `linear-gradient(to bottom, transparent, ${colors.accent.primary}06, transparent)` }}>
        <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, color: colors.accent.primary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 16 }}>Real Transformations</div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, letterSpacing: '-1.5px', color: colors.text.primary, margin: 0 }}>Voice transformation works.<br />Here&apos;s the proof.</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
            {[
              { q: 'The first app that actually made me feel like I was talking to myself. Hearing MY voice tell me I\'m capable hits so differently than reading it off a screen.', n: 'Marcus T.', r: 'Entrepreneur, 34', day: '30 days in' },
              { q: 'After 30 days of morning affirmations, I can\'t believe who I\'m becoming. I speak up in meetings now. I didn\'t think an app could actually do this to me.', n: 'Sarah M.', r: 'Teacher, 28', day: '21 days in' },
              { q: 'I\'ve tried every meditation app out there. waQup is the only one that feels truly personal. The ritual creation flow is like therapy on demand, but it\'s mine.', n: 'Emma L.', r: 'Designer, 31', day: '66 days in' },
            ].map(({ q, n, r, day }) => (
              <div key={n} style={{ padding: '44px 44px', borderRadius: borderRadius.xl, background: colors.glass.light, backdropFilter: BLUR.xl, WebkitBackdropFilter: BLUR.xl, border: `1px solid ${colors.glass.border}`, display: 'flex', flexDirection: 'column', gap: 28, transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.borderColor = `${colors.accent.primary}30`; e.currentTarget.style.boxShadow = `0 32px 80px ${colors.accent.primary}25`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = colors.glass.border; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px 18px', background: `${colors.accent.primary}25`, borderRadius: '0 24px 0 12px', fontSize: 11, color: colors.accent.primary, fontWeight: 700, letterSpacing: '0.04em' }}>{day}</div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} color="#F59E0B" fill="#F59E0B" />)}
                </div>
                <p style={{ fontSize: 17, color: colors.text.primary, lineHeight: 1.75, margin: 0, flex: 1, letterSpacing: '-0.3px' }}>&ldquo;{q}&rdquo;</p>
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
      <section style={{ padding: `${SECTION_PY} ${PAGE_PADDING}` }}>
        <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 16 }}>The Difference</div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, letterSpacing: '-1.5px', color: colors.text.primary, margin: 0 }}>Something in you knows it&apos;s time.</h2>
          </div>

          <div className="hiw-before-after" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: borderRadius.xl, overflow: 'hidden', border: `1px solid ${colors.glass.border}` }}>
            <div style={{ padding: '56px 48px', background: 'linear-gradient(135deg, rgba(255,100,100,0.04), rgba(20,8,8,0.6))', borderRight: `1px solid ${colors.glass.border}` }}>
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
      <section style={{ padding: `${SECTION_PY} ${PAGE_PADDING}`, maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, letterSpacing: '-1.5px', color: colors.text.primary, margin: '0 0 20px' }}>Q&amp;A</h2>
          <p style={{ fontSize: 18, color: colors.text.secondary, margin: 0 }}>Everything you want to know before you begin.</p>
        </div>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map(({ q, a }) => <FAQItem key={q} q={q} a={a} colors={colors} />)}
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <section style={{ padding: `${SECTION_PY} ${PAGE_PADDING}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, height: 800, borderRadius: '50%', background: `radial-gradient(circle, ${colors.accent.primary}14 0%, transparent 65%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: CONTENT_MEDIUM, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <WaitlistCTA
            variant="banner"
            headline="Ready to rewire your mind?"
            subtext={`Join the waitlist and be first to access waQup. No credit card required. ${PRACTICE_IS_FREE_ONE_LINER}`}
          />
        </div>
      </section>

      {/* ── Global Styles ─────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes wqPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes wqProgressFill { 0%{width:30%} 100%{width:88%} }
        @keyframes wqSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes wqRingPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.06);opacity:0.6} }

        /* Gentle scroll snap — sections drift into alignment when you're close */
        html { scroll-snap-type: y proximity; }
        section { scroll-snap-align: start; scroll-snap-stop: normal; }

        .hiw-hero { flex-direction: row; }
        .hiw-hero-mockup { display: flex; justify-content: center; flex-shrink: 0; }
        .hiw-step-card { grid-template-columns: 1fr 1fr; }
        .hiw-science { grid-template-columns: 1fr 1fr; }
        .hiw-timeline { grid-template-columns: repeat(6, 1fr); }

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
