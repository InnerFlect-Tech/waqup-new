'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { PageShell, WaitlistCTA } from '@/components';
import { spacing, borderRadius, BLUR } from '@/theme';
import { CONTENT_MAX_WIDTH, CONTENT_NARROW, CONTENT_MEDIUM, PAGE_PADDING, PAGE_TOP_PADDING } from '@/theme';
import { Link } from '@/i18n/navigation';
import { CONTENT_TYPE_COLORS } from '@waqup/shared/constants';
import {
  Brain,
  Mic,
  Sparkles,
  Shield,
  Zap,
  Check,
  ArrowRight,
  MessageCircle,
  Star,
  ChevronDown,
  Volume2,
  Play,
  SkipForward,
  SkipBack,
  Moon,
  Flame,
  Sun,
  X,
  Infinity as InfinityIcon,
} from 'lucide-react';
import { ContentIcon } from '@/components';

// ─── Phone Mockup ─────────────────────────────────────────────────────────────

type ThemeColors = ReturnType<typeof useTheme>['theme']['colors'];

function SanctuaryScreen({ colors }: { colors: ThemeColors }) {
  return (
    <div style={{ height: '100%', background: '#060606', padding: '18px 16px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 3 }}>Good morning</div>
        <div style={{ fontSize: 16, fontWeight: 300, color: '#fff', letterSpacing: -0.5 }}>Ready to transform? ✨</div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
        {[
          { iconSrc: '/images/icon-affirmations.png', label: 'Affirmations', sub: 'Rewire your beliefs', color: CONTENT_TYPE_COLORS.affirmation },
          { iconSrc: '/images/icon-meditations.png', label: 'Meditations', sub: 'Induce calm states', color: CONTENT_TYPE_COLORS.meditation },
          { iconSrc: '/images/icon-rituals.png', label: 'Rituals', sub: 'Encode identity', color: CONTENT_TYPE_COLORS.ritual },
        ].map(({ iconSrc, label, sub, color }) => (
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
          <div key={i} style={{ flex: 1, height: h, background: i < 18 ? 'linear-gradient(to top, #9333EA, #A855F7)' : 'rgba(255,255,255,0.1)', borderRadius: 1, animation: `wqWaveBar ${0.5 + (i % 5) * 0.1}s ease-in-out infinite alternate` }} />
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
  { q: 'Do I need to record my own voice?', a: 'No. Voice cloning is optional. You can choose from our curated library of professional voices, or clone your own with just a 1-minute recording. Most people find hearing their own voice the most powerful, but both options work beautifully.' },
  { q: 'How do credits (Qs) work?', a: 'Qs are the credits used to create new content. You earn Qs when you sign up and can purchase more. One thing worth knowing: listening to and practicing your existing content is always 100% free. Qs are only spent during creation.' },
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

// ─── Instagram Stats ──────────────────────────────────────────────────────────

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M+`;
  if (n >= 1_000) return `${Math.floor(n / 100) * 100 / 1_000}k+`;
  return `${n}+`;
}

function useInstagramFollowers() {
  const [followers, setFollowers] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/instagram/stats')
      .then((r) => r.json())
      .then((d) => {
        if (d.followers && d.followers > 0) {
          setFollowers(formatFollowers(d.followers));
        }
      })
      .catch(() => {/* use fallback */});
  }, []);

  return followers;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const SECTION_PY = '72px';

export default function LaunchPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const instagramFollowers = useInstagramFollowers();

  return (
    <PageShell intensity="high" bare allowDocumentScroll>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="wq-hero" style={{ padding: `0 ${PAGE_PADDING}`, marginTop: `calc(-1 * ${PAGE_TOP_PADDING} - ${spacing.lg})`, marginLeft: 'auto', marginRight: 'auto', maxWidth: CONTENT_MAX_WIDTH, minHeight: 'calc(100dvh - 64px)', display: 'flex', alignItems: 'center', gap: `calc(${spacing.xxxl} + ${spacing.md})`, boxSizing: 'border-box' }}>
        <div className="wq-hero-copy" style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: borderRadius.full, background: `${colors.accent.tertiary}15`, border: `1px solid ${colors.accent.tertiary}30`, marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.success, animation: 'wqPulse 2s ease-in-out infinite' }} />
            <Typography variant="smallBold" style={{ color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.7px', fontSize: 11 }}>Voice-First Wellness · AI-Powered</Typography>
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 5.5vw, 72px)', fontWeight: 300, lineHeight: 1.08, letterSpacing: '-2px', color: colors.text.primary, margin: '0 0 24px' }}>
            Become the person<br />
            you&apos;ve always<br />
            <span style={{ background: colors.gradients.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>known you could be.</span>
          </h1>

          <p style={{ fontSize: 'clamp(17px, 1.8vw, 21px)', color: colors.text.secondary, lineHeight: 1.65, maxWidth: 500, margin: '0 0 32px', fontWeight: 300 }}>
            waQup creates personalized affirmations, meditations, and rituals, voiced by you, that rewire your subconscious. Not generic content. Your story. Your voice. Your transformation.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
            <Link href="/waitlist" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="lg" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: '17px', padding: '16px 36px', boxShadow: `0 8px 48px ${colors.accent.primary}50` }}>
                Join the Waitlist <ArrowRight size={18} color={colors.text.onDark} />
              </Button>
            </Link>
            <Link href="/how-it-works" style={{ textDecoration: 'none' }}>
              <Button variant="outline" size="lg" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: '17px' }}>
                <Play size={15} /> See How It Works
              </Button>
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex' }}>
              {['#9333EA', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95'].map((c, i) => (
                <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: c, border: '2px solid #000', marginLeft: i > 0 ? -9 : 0 }} />
              ))}
            </div>
            <Typography variant="caption" style={{ color: colors.text.secondary, fontSize: 13 }}>
              Join <strong style={{ color: colors.text.primary }}>{instagramFollowers ?? '10,000+'} people</strong> already transforming their minds
            </Typography>
          </div>
        </div>

        <div className="wq-hero-mockup">
          <AppMockup colors={colors} />
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <div style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', padding: `${spacing.xxl} ${PAGE_PADDING}`, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {[
            { n: instagramFollowers ?? '10,000+', l: 'Minds in transformation' },
            { n: '3', l: 'Science-backed content types' },
            { n: '∞', l: 'Free practice replays' },
          ].map(({ n, l }) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 300, letterSpacing: '-1.5px', lineHeight: 1, marginBottom: 8, background: colors.gradients.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{n}</div>
              <Typography variant="caption" style={{ color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 11 }}>{l}</Typography>
            </div>
          ))}
        </div>
      </div>

      {/* ── How It Works ─────────────────────────────────── */}
      <section style={{ padding: `${SECTION_PY} ${PAGE_PADDING}`, maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ fontSize: 11, color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 16 }}>How It Works</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, letterSpacing: '-1.5px', color: colors.text.primary, margin: '0 0 20px' }}>Three steps to a new you</h2>
          <p style={{ fontSize: 19, color: colors.text.secondary, maxWidth: 560, margin: '0 auto', lineHeight: 1.6, fontWeight: 300 }}>No forms. No scripts. No production skills. Just a conversation that becomes your daily practice.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
          {[
            { n: '01', icon: MessageCircle, title: 'Share your goals', desc: 'A conversational AI guide listens to your specific challenges, goals, and context. Like talking to a coach who actually gets you.' },
            { n: '02', icon: Sparkles, title: 'AI creates your content', desc: 'Your personalized practice is scripted and voiced in your own voice: record live, clone it once, or choose a professional voice. Nothing generic, ever.' },
            { n: '03', icon: Volume2, title: 'Listen and transform', desc: 'Each morning, press play and hear your own voice guide you. Consistent self-voice repetition rewires subconscious patterns in 21–66 days, proven by science.' },
          ].map(({ n, icon: Icon, title, desc }) => (
            <div key={n} style={{ padding: '44px 40px', borderRadius: borderRadius.xl, background: colors.glass.light, backdropFilter: BLUR.xl, WebkitBackdropFilter: BLUR.xl, border: `1px solid ${colors.glass.border}`, transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = `0 32px 80px ${colors.accent.primary}40`; e.currentTarget.style.borderColor = `${colors.accent.primary}30`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = colors.glass.border; }}
            >
              <div style={{ position: 'absolute', top: 20, right: 24, fontSize: 96, fontWeight: 300, letterSpacing: '-3px', color: `${colors.accent.primary}10`, lineHeight: 1, userSelect: 'none' }}>{n}</div>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: colors.gradients.primary, boxShadow: `0 8px 24px ${colors.accent.primary}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
                <Icon size={26} color="#fff" />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 500, color: colors.text.primary, margin: '0 0 12px', letterSpacing: '-0.3px' }}>{title}</h3>
              <p style={{ fontSize: 16, color: colors.text.secondary, lineHeight: 1.7, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Before / After ───────────────────────────────── */}
      <section style={{ padding: `${SECTION_PY} ${PAGE_PADDING}`, background: `linear-gradient(to bottom, transparent, ${colors.accent.primary}06, transparent)` }}>
        <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 16 }}>The Difference</div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, letterSpacing: '-1.5px', color: colors.text.primary, margin: 0 }}>Something in you knows it&apos;s time.</h2>
          </div>

          <div className="wq-before-after" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: borderRadius.xl, overflow: 'hidden', border: `1px solid ${colors.glass.border}` }}>
            {/* Before */}
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

            {/* After */}
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

      {/* ── Content Types ─────────────────────────────────── */}
      <section style={{ padding: `${SECTION_PY} ${PAGE_PADDING}`, maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ fontSize: 11, color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 16, paddingLeft: '0.12em' }}>Three Content Types</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, letterSpacing: '-1.5px', color: colors.text.primary, margin: '0 0 20px' }}>Every depth of transformation</h2>
          <p style={{ fontSize: 19, color: colors.text.secondary, maxWidth: 560, margin: '0 auto', lineHeight: 1.6, fontWeight: 300 }}>Not interchangeable. Each type is designed for a specific level of inner change, from daily reprogramming to permanent identity encoding.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {[
            {
              icon: Sun, name: 'Affirmations', tagline: 'Rewire your daily story', duration: '2–5 min', depth: 'Daily ritual',
              desc: 'Short, powerful statements voiced in your own words. Listen each morning to reprogram the beliefs that shape every decision you make.',
              color: colors.accent.primary,
              gradient: `linear-gradient(160deg, ${colors.accent.primary}18, ${colors.accent.secondary}06)`,
              outcome: 'Feel the shift in weeks.',
            },
            {
              icon: Moon, name: 'Guided Meditations', tagline: 'Command your inner state', duration: '10–30 min', depth: 'State induction',
              desc: 'AI-scripted journeys designed for your emotional goals, voiced by you. You hear your own voice guide you to exactly where you need to go.',
              color: colors.accent.secondary,
              gradient: `linear-gradient(160deg, ${colors.accent.secondary}18, rgba(99,102,241,0.06))`,
              outcome: 'Find calm on demand.',
            },
            {
              icon: Flame, name: 'Rituals', tagline: 'Encode your new identity', duration: '20–60 min', depth: 'Identity encoding',
              desc: 'Multi-part practices combining breathwork, visualization, and affirmations, all voiced by you. Hearing yourself through the deepest work is what makes it stick.',
              color: colors.accent.tertiary,
              gradient: `linear-gradient(160deg, ${colors.accent.tertiary}18, ${colors.accent.primary}06)`,
              outcome: 'Become someone new.',
            },
          ].map(({ icon: Icon, name, tagline, duration, depth, desc, color, gradient, outcome }) => (
            <div key={name} style={{ borderRadius: borderRadius.xl, background: gradient, backdropFilter: BLUR.xl, WebkitBackdropFilter: BLUR.xl, border: `1px solid ${color}22`, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = `0 40px 100px ${color}30`; e.currentTarget.style.borderColor = `${color}45`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = `${color}22`; }}
            >
              {/* Card top — visual area */}
              <div style={{ padding: '48px 40px 36px', position: 'relative', borderBottom: `1px solid ${color}12`, textAlign: 'center' }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 140, height: 140, borderRadius: '50%', background: `radial-gradient(circle, ${color}15, transparent 70%)`, pointerEvents: 'none' }} />
                <div style={{ width: 72, height: 72, borderRadius: 20, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, boxShadow: `0 0 40px ${color}20`, margin: '0 auto 28px' }}>
                  <Icon size={34} color={color} />
                </div>
                <h3 style={{ fontSize: 26, fontWeight: 400, color: colors.text.primary, margin: '0 0 6px', letterSpacing: '-0.5px' }}>{name}</h3>
                <p style={{ fontSize: 14, color, fontWeight: 500, margin: 0, letterSpacing: '0.02em' }}>{tagline}</p>
              </div>
              {/* Card body */}
              <div style={{ padding: '32px 40px 40px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: 15, color: colors.text.secondary, lineHeight: 1.7, margin: '0 0 24px', flex: 1, textAlign: 'center' }}>{desc}</p>
                {/* Footer */}
                <div style={{ borderTop: `1px solid ${color}18`, paddingTop: 20 }}>
                  {/* Pills */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 14, justifyContent: 'center' }}>
                    <span style={{ padding: '5px 14px', borderRadius: borderRadius.full, background: `${color}14`, border: `1px solid ${color}30`, fontSize: 12, color, fontWeight: 500, letterSpacing: '0.01em' }}>{duration}</span>
                    <span style={{ padding: '5px 14px', borderRadius: borderRadius.full, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 12, color: colors.text.secondary, letterSpacing: '0.01em' }}>{depth}</span>
                  </div>
                  {/* Outcome promise */}
                  <p style={{ fontSize: 13, color, fontWeight: 600, fontStyle: 'italic', letterSpacing: '0.01em', textAlign: 'center', margin: 0 }}>{outcome}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Bento ────────────────────────────────── */}
      <section style={{ padding: `${SECTION_PY} ${PAGE_PADDING}` }}>
        <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 16 }}>Why It Works</div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, letterSpacing: '-1.5px', color: colors.text.primary, margin: 0 }}>Built for real transformation</h2>
          </div>

          <div className="wq-bento" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 20 }}>

            {/* 1 — Voice authority (wide, featured) */}
            <div className="wq-bento-1" style={{ gridColumn: '1 / 5', padding: '52px 52px', borderRadius: borderRadius.xl, background: `linear-gradient(135deg, ${colors.accent.primary}14, ${colors.accent.secondary}06)`, border: `1px solid ${colors.accent.primary}22`, position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${colors.accent.primary}40`; e.currentTarget.style.boxShadow = `0 32px 80px ${colors.accent.primary}30`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${colors.accent.primary}22`; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ position: 'absolute', top: -40, right: -40, width: 280, height: 280, borderRadius: '50%', background: `radial-gradient(circle, ${colors.accent.primary}12, transparent 70%)`, pointerEvents: 'none' }} />
              <div style={{ width: 80, height: 80, borderRadius: 22, background: colors.gradients.primary, boxShadow: `0 12px 40px ${colors.accent.primary}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 36 }}>
                <Mic size={38} color="#fff" />
              </div>
              <h3 style={{ fontSize: 'clamp(24px, 2.5vw, 34px)', fontWeight: 300, color: colors.text.primary, margin: '0 0 16px', letterSpacing: '-0.8px', lineHeight: 1.2 }}>Hear yourself say it.</h3>
              <p style={{ fontSize: 16, color: colors.text.secondary, lineHeight: 1.7, maxWidth: 460, margin: 0 }}>Science has known for decades: self-referential processing activates deeper neural pathways than any external voice. When you hear yourself speak your own truth, the mind doesn&apos;t filter, deflect, or dismiss. It listens. And then it changes.</p>
            </div>

            {/* 2 — Uniqueness (narrow) */}
            <div className="wq-bento-2" style={{ gridColumn: '5 / 7', padding: '52px 40px', borderRadius: borderRadius.xl, background: colors.glass.light, border: `1px solid ${colors.glass.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${colors.accent.primary}30`; e.currentTarget.style.background = `${colors.accent.primary}06`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.glass.border; e.currentTarget.style.background = colors.glass.light; }}
            >
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${colors.accent.primary}15`, border: `1px solid ${colors.accent.primary}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, boxShadow: `0 0 40px ${colors.accent.primary}20` }}>
                <Sparkles size={32} color={colors.accent.primary} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 500, color: colors.text.primary, margin: '0 0 10px' }}>No one else has your practice.</h3>
              <p style={{ fontSize: 14, color: colors.text.secondary, lineHeight: 1.6, margin: 0 }}>Other apps serve millions of people the same content. Every piece in your waQup library was built for one person on earth. You.</p>
            </div>

            {/* 3 — Morning window (narrow) */}
            <div className="wq-bento-3" style={{ gridColumn: '1 / 3', padding: '52px 40px', borderRadius: borderRadius.xl, background: colors.glass.light, border: `1px solid ${colors.glass.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${colors.accent.secondary}35`; e.currentTarget.style.background = `${colors.accent.secondary}06`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.glass.border; e.currentTarget.style.background = colors.glass.light; }}
            >
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${colors.accent.secondary}15`, border: `1px solid ${colors.accent.secondary}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
                <Sun size={32} color={colors.accent.secondary} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 500, color: colors.text.primary, margin: '0 0 10px', letterSpacing: '-0.3px' }}>5 minutes before the world gets in.</h3>
              <p style={{ fontSize: 14, color: colors.text.secondary, lineHeight: 1.65, margin: 0 }}>Right after waking, your brain is in its most receptive theta state: the same window used in deep hypnotherapy. waQup was built to reach you here, first.</p>
            </div>

            {/* 4 — Identity change (wide, featured) */}
            <div className="wq-bento-4" style={{ gridColumn: '3 / 7', padding: '52px 52px', borderRadius: borderRadius.xl, background: `linear-gradient(135deg, ${colors.accent.secondary}10, ${colors.accent.primary}06)`, border: `1px solid ${colors.accent.secondary}20`, position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${colors.accent.secondary}40`; e.currentTarget.style.boxShadow = `0 32px 80px ${colors.accent.secondary}25`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${colors.accent.secondary}20`; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ position: 'absolute', bottom: -40, left: -40, width: 240, height: 240, borderRadius: '50%', background: `radial-gradient(circle, ${colors.accent.secondary}12, transparent 70%)`, pointerEvents: 'none' }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right' }}>
                <div style={{ width: 80, height: 80, borderRadius: 22, background: `linear-gradient(135deg, ${colors.accent.secondary}, ${colors.accent.primary})`, boxShadow: `0 12px 40px ${colors.accent.secondary}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 36 }}>
                  <Zap size={38} color="#fff" />
                </div>
                <h3 style={{ fontSize: 'clamp(24px, 2.5vw, 34px)', fontWeight: 300, color: colors.text.primary, margin: '0 0 16px', letterSpacing: '-0.8px', lineHeight: 1.2 }}>You&apos;re not building habits.<br />You&apos;re rewriting identity.</h3>
                <p style={{ fontSize: 16, color: colors.text.secondary, lineHeight: 1.7, maxWidth: 420, margin: 0 }}>Willpower depletes. Habits need enforcement. But identity runs on autopilot. Change who you believe you are, and the behaviors follow without effort. waQup doesn&apos;t train what you do. It changes who you are at the source.</p>
              </div>
            </div>

            {/* 5 — Science (medium) */}
            <div className="wq-bento-5" style={{ gridColumn: '1 / 4', padding: '44px 44px', borderRadius: borderRadius.xl, background: colors.glass.light, border: `1px solid ${colors.glass.border}`, display: 'flex', gap: 28, alignItems: 'flex-start', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${colors.accent.primary}28`; e.currentTarget.style.background = `${colors.accent.primary}05`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.glass.border; e.currentTarget.style.background = colors.glass.light; }}
            >
              <div style={{ width: 64, height: 64, borderRadius: 18, background: `${colors.accent.primary}15`, border: `1px solid ${colors.accent.primary}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Brain size={30} color={colors.accent.primary} />
              </div>
              <div>
                <h3 style={{ fontSize: 21, fontWeight: 500, color: colors.text.primary, margin: '0 0 12px', letterSpacing: '-0.3px' }}>Built on how brains actually change.</h3>
                <p style={{ fontSize: 15, color: colors.text.secondary, lineHeight: 1.7, margin: 0 }}>Every content structure is engineered around peer-reviewed neuroplasticity research. This isn&apos;t motivation. It&apos;s architecture for identity change.</p>
              </div>
            </div>

            {/* 6 — Data (medium) */}
            <div className="wq-bento-6" style={{ gridColumn: '4 / 7', padding: '44px 44px', borderRadius: borderRadius.xl, background: colors.glass.light, border: `1px solid ${colors.glass.border}`, display: 'flex', gap: 28, alignItems: 'flex-start', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${colors.accent.primary}28`; e.currentTarget.style.background = `${colors.accent.primary}05`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.glass.border; e.currentTarget.style.background = colors.glass.light; }}
            >
              <div style={{ width: 64, height: 64, borderRadius: 18, background: `${colors.accent.primary}15`, border: `1px solid ${colors.accent.primary}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Shield size={30} color={colors.accent.primary} />
              </div>
              <div>
                <h3 style={{ fontSize: 21, fontWeight: 500, color: colors.text.primary, margin: '0 0 12px', letterSpacing: '-0.3px' }}>Your data. Your power.</h3>
                <p style={{ fontSize: 15, color: colors.text.secondary, lineHeight: 1.7, margin: 0 }}>Voice data is encrypted and stored under your account. You own every piece of content you create. Export your entire library anytime, forever.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section style={{ padding: `${SECTION_PY} ${PAGE_PADDING}`, background: `linear-gradient(to bottom, transparent, ${colors.accent.primary}06, transparent)` }}>
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

      {/* ── Founder quote ─────────────────────────────────── */}
      <section style={{ padding: `${SECTION_PY} ${PAGE_PADDING}`, position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${colors.accent.primary}10 0%, transparent 65%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 40 }}>From the Founder</div>
          <blockquote style={{ margin: 0, padding: 0 }}>
            <p style={{ fontSize: 'clamp(20px, 2.4vw, 26px)', fontWeight: 400, color: colors.text.primary, lineHeight: 1.65, letterSpacing: '-0.5px', margin: '0 0 36px' }}>
              &ldquo;Nothing was working. I was depressed and had tried everything. So I did my own research, sat with a friend, recorded my voice, and mixed it in Ableton. I listened every day. My life changed. I spent the next five years removing every barrier between that experience and anyone who needs it. That&apos;s waQup.&rdquo;
            </p>
            <footer style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: colors.text.primary, letterSpacing: '0.02em' }}>Daniel Indias Fernandes</span>
              <span style={{ fontSize: 13, color: colors.text.secondary }}>Founder, waQup</span>
            </footer>
          </blockquote>
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
            headline="The person you want to be is waiting for your voice."
            subtext="Join the waitlist and be first to access waQup when it launches. No credit card required."
          />
        </div>
      </section>

      {/* ── Global Styles ─────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes wqPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes wqProgressFill { 0%{width:30%} 100%{width:88%} }
        @keyframes wqSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes wqWaveBar { 0%{transform:scaleY(0.55)} 100%{transform:scaleY(1)} }

        html { scroll-snap-type: y proximity; }
        section { scroll-snap-align: start; scroll-snap-stop: normal; }

        .wq-hero { flex-direction: row; }
        .wq-hero-mockup { display: flex; justify-content: center; flex-shrink: 0; }

        @media (max-width: 960px) {
          .wq-hero { flex-direction: column !important; padding-top: 40px !important; padding-bottom: 48px !important; min-height: auto !important; align-items: flex-start !important; margin-top: 0 !important; }
          .wq-hero-mockup { width: 100%; padding: 32px 0; }
          .wq-before-after { grid-template-columns: 1fr !important; }
          .wq-bento { grid-template-columns: 1fr !important; }
          .wq-bento-1, .wq-bento-2, .wq-bento-3, .wq-bento-4, .wq-bento-5, .wq-bento-6 { grid-column: 1 / -1 !important; }
        }
      `}} />
    </PageShell>
  );
}
