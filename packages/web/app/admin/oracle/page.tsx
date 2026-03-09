'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageShell, SuperAdminGate } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';

// ── Storage keys ──────────────────────────────────────────────────────────────
const ORACLE_KEY = 'oracle-config';
const EL_KEY     = 'elevenlabs-config';

// ── Default values ────────────────────────────────────────────────────────────
const DEFAULT_SYSTEM_PROMPT = `You are a calm, wise inner presence — always available, always listening. You help people articulate what they are seeking, understand themselves more deeply, and when the moment feels right, you offer to help them create a personal affirmation, meditation, or ritual.

You speak with warmth and stillness. One thought at a time. You never overwhelm.

Rules:
- Respond in 2–4 sentences maximum. Never more.
- Ask at most one question per response.
- Be present, warm, and gently insightful — not therapeutic or preachy.
- Mirror back what the person shares with care before asking anything.
- When you sense they are ready to create something, say: "Shall I create something for you — an affirmation, a meditation, or a ritual?"
- Never list options unless asked. Trust the silence between words.`;

const OPENAI_MODELS = [
  { value: 'gpt-4o-mini',             label: 'GPT-4o Mini  (fast · cheap)' },
  { value: 'gpt-4o',                  label: 'GPT-4o  (powerful)' },
  { value: 'gpt-4-turbo',             label: 'GPT-4 Turbo' },
  { value: 'gpt-4o-realtime-preview', label: 'GPT-4o Realtime' },
];

const EL_MODELS = [
  { value: 'eleven_flash_v2_5',    label: 'Flash v2.5  (~75ms · 32 langs)' },
  { value: 'eleven_flash_v2',      label: 'Flash v2  (~75ms · EN only)' },
  { value: 'eleven_turbo_v2_5',    label: 'Turbo v2.5  (~250ms · 32 langs)' },
  { value: 'eleven_turbo_v2',      label: 'Turbo v2  (~250ms · EN)' },
  { value: 'eleven_multilingual_v2', label: 'Multilingual v2  (highest quality)' },
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface OracleConfig {
  systemPrompt:     string;
  model:            string;
  temperature:      number;
  maxTokens:        number;
  topP:             number;
  presencePenalty:  number;
  frequencyPenalty: number;
  seed:             number | null;
  stopSequences:    string[];
  ttsVoice:         string;
  awakeningDelay:   number;
}

interface ElevenLabsConfig {
  oracleEngine:      'browser' | 'elevenlabs';
  oracleVoiceId:     string;
  oracleModel:       string;
  stability:         number;
  similarityBoost:   number;
  style:             number;
  useSpeakerBoost:   boolean;
  speed:             number;
  optimizeLatency:   number;
  contentVoiceId:    string;
  contentModel:      string;
  contentStability:  number;
  contentSimilarityBoost: number;
  contentStyle:      number;
  contentUseSpeakerBoost: boolean;
  contentSpeed:      number;
}

interface ElevenLabsVoice {
  voice_id:    string;
  name:        string;
  category:    string;
  labels:      Record<string, string>;
  preview_url: string | null;
}

const ORACLE_DEFAULTS: OracleConfig = {
  systemPrompt:     DEFAULT_SYSTEM_PROMPT,
  model:            'gpt-4o-mini',
  temperature:      0.7,
  maxTokens:        400,
  topP:             1.0,
  presencePenalty:  0,
  frequencyPenalty: 0,
  seed:             null,
  stopSequences:    [],
  ttsVoice:         'Samantha',
  awakeningDelay:   1600,
};

const EL_DEFAULTS: ElevenLabsConfig = {
  oracleEngine:           'browser',
  oracleVoiceId:          '',
  oracleModel:            'eleven_flash_v2_5',
  stability:              0.5,
  similarityBoost:        0.75,
  style:                  0.0,
  useSpeakerBoost:        true,
  speed:                  1.0,
  optimizeLatency:        0,
  contentVoiceId:         '',
  contentModel:           'eleven_multilingual_v2',
  contentStability:       0.5,
  contentSimilarityBoost: 0.75,
  contentStyle:           0.0,
  contentUseSpeakerBoost: true,
  contentSpeed:           1.0,
};

// ── Storage helpers ───────────────────────────────────────────────────────────
function load<T>(key: string, defaults: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return { ...defaults, ...(JSON.parse(raw) as Partial<T>) };
  } catch { /* ignore */ }
  return { ...defaults };
}

function save<T>(key: string, val: T) {
  localStorage.setItem(key, JSON.stringify(val));
}

// ── Shared sub-components ─────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
      color: 'rgba(167,139,250,0.75)', fontWeight: 500, display: 'block', marginBottom: 8,
    }}>
      {children}
    </span>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 4, display: 'block' }}>
      {children}
    </span>
  );
}

function SectionTitle({ children, dim }: { children: React.ReactNode; dim?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
      <h2 style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', margin: 0, textTransform: 'uppercase' }}>
        {children}
      </h2>
      {dim && <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11 }}>{dim}</span>}
    </div>
  );
}

// ── Reusable voice settings block ─────────────────────────────────────────────
interface VoiceSettingsBlockProps {
  stability:        number;
  similarityBoost:  number;
  style:            number;
  useSpeakerBoost:  boolean;
  speed:            number;
  optimizeLatency?: number;
  onChange: (key: string, val: number | boolean) => void;
}

function VoiceSettingsBlock({ stability, similarityBoost, style, useSpeakerBoost, speed, optimizeLatency, onChange }: VoiceSettingsBlockProps) {
  const inputBase: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(167,139,250,0.18)',
    borderRadius: '6px', color: '#fff', fontSize: 14, padding: '8px 12px',
    boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <Label>Stability  <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{stability.toFixed(2)}</span></Label>
        <input type="range" min={0} max={1} step={0.01} value={stability} onChange={(e) => onChange('stability', parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }} />
        <Hint>Low = more emotional range · High = consistent/monotone</Hint>
      </div>
      <div>
        <Label>Similarity Boost  <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{similarityBoost.toFixed(2)}</span></Label>
        <input type="range" min={0} max={1} step={0.01} value={similarityBoost} onChange={(e) => onChange('similarityBoost', parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }} />
        <Hint>How closely the AI adheres to the original voice</Hint>
      </div>
      <div>
        <Label>Style Exaggeration  <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{style.toFixed(2)}</span></Label>
        <input type="range" min={0} max={1} step={0.01} value={style} onChange={(e) => onChange('style', parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }} />
        <Hint>0 = neutral · Higher = more expressive but slower</Hint>
      </div>
      <div>
        <Label>Speed  <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{speed.toFixed(2)}x</span></Label>
        <input type="range" min={0.7} max={1.3} step={0.01} value={speed} onChange={(e) => onChange('speed', parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <Hint>0.7× slow</Hint>
          <Hint>1.3× fast</Hint>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Label>Speaker Boost</Label>
          <Hint>Improves voice similarity — increases latency</Hint>
        </div>
        <button
          type="button"
          onClick={() => onChange('useSpeakerBoost', !useSpeakerBoost)}
          style={{
            width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
            background: useSpeakerBoost ? 'rgba(124,58,237,0.8)' : 'rgba(255,255,255,0.12)',
            position: 'relative', transition: 'background 0.2s', flexShrink: 0,
          }}
        >
          <span style={{
            position: 'absolute', top: 3, left: useSpeakerBoost ? 23 : 3,
            width: 18, height: 18, borderRadius: 9, background: '#fff',
            transition: 'left 0.2s', display: 'block',
          }} />
        </button>
      </div>
      {optimizeLatency !== undefined && (
        <div>
          <Label>Latency Optimization  <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{optimizeLatency}</span></Label>
          <input type="range" min={0} max={4} step={1} value={optimizeLatency} onChange={(e) => onChange('optimizeLatency', parseInt(e.target.value, 10))} style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <Hint>0 = max quality</Hint>
            <Hint>4 = max speed</Hint>
          </div>
        </div>
      )}
      <div style={{ height: 1, background: 'rgba(167,139,250,0.08)', margin: '4px 0' }} />
      <input type="range" min={0} max={1} step={0.01} value={stability} style={{ display: 'none' }} readOnly />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function OracleAdminPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [oConfig, setOConfig]         = useState<OracleConfig>({ ...ORACLE_DEFAULTS });
  const [elConfig, setElConfig]       = useState<ElevenLabsConfig>({ ...EL_DEFAULTS });
  const [saved, setSaved]             = useState(false);
  const [importError, setImportError] = useState('');

  // Voice list state
  const [voices, setVoices]           = useState<ElevenLabsVoice[]>([]);
  const [voicesLoading, setVoicesLoading] = useState(false);
  const [voicesError, setVoicesError] = useState('');

  // Oracle test panel
  const [testInput, setTestInput]     = useState('');
  const [testReply, setTestReply]     = useState('');
  const [testLoading, setTestLoading] = useState(false);

  // ElevenLabs preview
  const [previewTarget, setPreviewTarget] = useState<'oracle' | 'content' | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Stop sequence input
  const [stopInput, setStopInput]     = useState('');

  const fileRef = useRef<HTMLInputElement>(null);

  // Load config from localStorage on mount
  useEffect(() => {
    setOConfig(load(ORACLE_KEY, ORACLE_DEFAULTS));
    setElConfig(load(EL_KEY, EL_DEFAULTS));
  }, []);

  // Fetch ElevenLabs voices on mount
  useEffect(() => {
    setVoicesLoading(true);
    fetch('/api/admin/elevenlabs/voices')
      .then((r) => r.json() as Promise<{ voices?: ElevenLabsVoice[]; error?: string }>)
      .then((data) => {
        if (data.voices) setVoices(data.voices);
        else setVoicesError(data.error ?? 'Failed to load voices');
      })
      .catch(() => setVoicesError('Network error loading voices'))
      .finally(() => setVoicesLoading(false));
  }, []);

  const handleSave = useCallback(() => {
    save(ORACLE_KEY, oConfig);
    save(EL_KEY, elConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [oConfig, elConfig]);

  const handleReset = useCallback(() => {
    setOConfig({ ...ORACLE_DEFAULTS });
    setElConfig({ ...EL_DEFAULTS });
    save(ORACLE_KEY, ORACLE_DEFAULTS);
    save(EL_KEY, EL_DEFAULTS);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  const handleExport = useCallback(() => {
    const data = { oracle: oConfig, elevenlabs: elConfig };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'oracle-admin-config.json'; a.click();
    URL.revokeObjectURL(url);
  }, [oConfig, elConfig]);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as { oracle?: Partial<OracleConfig>; elevenlabs?: Partial<ElevenLabsConfig> };
        if (parsed.oracle)      setOConfig({ ...ORACLE_DEFAULTS, ...parsed.oracle });
        if (parsed.elevenlabs)  setElConfig({ ...EL_DEFAULTS, ...parsed.elevenlabs });
        setImportError('');
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch { setImportError('Invalid JSON file'); }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
  }, []);

  const setO = useCallback(<K extends keyof OracleConfig>(key: K, val: OracleConfig[K]) => {
    setOConfig((prev) => ({ ...prev, [key]: val }));
  }, []);

  const setEl = useCallback(<K extends keyof ElevenLabsConfig>(key: K, val: ElevenLabsConfig[K]) => {
    setElConfig((prev) => ({ ...prev, [key]: val }));
  }, []);

  // Test oracle call
  const handleTestOracle = useCallback(async () => {
    if (!testInput.trim()) return;
    setTestLoading(true);
    setTestReply('');
    try {
      const res = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: testInput }],
          systemPrompt:     oConfig.systemPrompt,
          model:            oConfig.model,
          temperature:      oConfig.temperature,
          maxTokens:        oConfig.maxTokens,
          topP:             oConfig.topP,
          presencePenalty:  oConfig.presencePenalty,
          frequencyPenalty: oConfig.frequencyPenalty,
          seed:             oConfig.seed,
          stop:             oConfig.stopSequences,
        }),
      });
      const data = await res.json() as { reply?: string; error?: string };
      setTestReply(data.reply ?? data.error ?? 'No response');
    } catch { setTestReply('Network error'); }
    finally { setTestLoading(false); }
  }, [testInput, oConfig]);

  // Preview ElevenLabs voice
  const handlePreview = useCallback(async (target: 'oracle' | 'content') => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setPreviewTarget(target);
    const voiceId = target === 'oracle' ? elConfig.oracleVoiceId : elConfig.contentVoiceId;
    if (!voiceId) { setPreviewTarget(null); return; }

    const endpoint  = target === 'oracle' ? '/api/oracle/tts' : '/api/ai/tts';
    const modelKey  = target === 'oracle' ? elConfig.oracleModel : elConfig.contentModel;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'I am here, listening. What would you like to explore today?',
          voiceId,
          ...(target === 'oracle' ? { model: modelKey } : { modelId: modelKey }),
          voiceSettings: {
            stability:         target === 'oracle' ? elConfig.stability         : elConfig.contentStability,
            similarity_boost:  target === 'oracle' ? elConfig.similarityBoost   : elConfig.contentSimilarityBoost,
            style:             target === 'oracle' ? elConfig.style             : elConfig.contentStyle,
            use_speaker_boost: target === 'oracle' ? elConfig.useSpeakerBoost   : elConfig.contentUseSpeakerBoost,
            speed:             target === 'oracle' ? elConfig.speed             : elConfig.contentSpeed,
          },
          optimizeStreamingLatency: target === 'oracle' ? elConfig.optimizeLatency : undefined,
        }),
      });
      if (!res.ok) throw new Error('TTS failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      previewAudioRef.current = audio;
      audio.onended = () => { setPreviewTarget(null); URL.revokeObjectURL(url); };
      audio.play();
    } catch { /* ignore */ }
    finally { setPreviewTarget(null); }
  }, [elConfig]);

  // ── Shared styles ───────────────────────────────────────────────────────────
  const inputBase: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(167,139,250,0.18)',
    borderRadius: borderRadius.md, color: '#fff', fontSize: 14, padding: `${spacing.sm} ${spacing.md}`,
    boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit',
  };
  const selectBase: React.CSSProperties = {
    ...inputBase, cursor: 'pointer', appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a78bfa' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 36,
  };
  const card: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(167,139,250,0.10)',
    borderRadius: borderRadius.lg, padding: spacing.xl, display: 'flex', flexDirection: 'column', gap: spacing.lg,
  };
  const ghostBtn = (active = false): React.CSSProperties => ({
    background: active ? 'rgba(124,58,237,0.4)' : 'transparent',
    border: `1px solid ${active ? 'rgba(167,139,250,0.4)' : colors.glass.border}`,
    borderRadius: '6px', color: active ? '#c4b5fd' : 'rgba(255,255,255,0.5)',
    fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
    padding: '6px 14px', cursor: 'pointer', transition: 'all 0.2s',
  });

  // ── Voice select helper ───────────────────────────────────────────────────
  const VoiceSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={selectBase}>
        <option value="" style={{ background: '#1e1025', color: '#888' }}>— Select a voice —</option>
        {voicesLoading && <option disabled>Loading voices…</option>}
        {voices.map((v) => (
          <option key={v.voice_id} value={v.voice_id} style={{ background: '#1e1025', color: '#fff' }}>
            {v.name}  {v.category !== 'premade' ? `(${v.category})` : ''}
          </option>
        ))}
      </select>
      {voicesError && <Hint>Could not load voices: {voicesError}</Hint>}
    </div>
  );

  // ── Admin dashboard ───────────────────────────────────────────────────────
  return (
    <SuperAdminGate>
    <PageShell intensity="medium">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
        style={{ maxWidth: 720, margin: '0 auto', paddingBottom: spacing.xxl, display: 'flex', flexDirection: 'column', gap: spacing.xl }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.md }}>
          <div>
            <p style={{ color: 'rgba(167,139,250,0.5)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 6px' }}>Hidden · Internal</p>
            <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 300, margin: 0, letterSpacing: '0.03em' }}>Oracle Config</h1>
          </div>
          <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => fileRef.current?.click()} style={ghostBtn()}>Import</button>
            <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
            <button type="button" onClick={handleExport} style={ghostBtn()}>Export</button>
            <button type="button" onClick={handleReset} style={ghostBtn()}>Reset</button>
            <button type="button" onClick={handleSave}
              style={{ background: saved ? 'rgba(52,211,153,0.25)' : 'rgba(124,58,237,0.55)', border: `1px solid ${saved ? 'rgba(52,211,153,0.4)' : 'rgba(167,139,250,0.3)'}`, borderRadius: borderRadius.md, color: saved ? '#34d399' : '#fff', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', padding: `${spacing.sm} ${spacing.lg}`, cursor: 'pointer', transition: 'all 0.25s', minWidth: 72 }}>
              {saved ? 'Saved ✓' : 'Save'}
            </button>
          </div>
        </div>
        {importError && <p style={{ color: '#f87171', fontSize: 12, margin: 0 }}>{importError}</p>}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* SECTION A — ORACLE AI (OpenAI)                                     */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section style={card}>
          <SectionTitle dim="OpenAI">A — Oracle AI</SectionTitle>

          {/* System prompt */}
          <div>
            <Label>System Prompt</Label>
            <textarea value={oConfig.systemPrompt} onChange={(e) => setO('systemPrompt', e.target.value)}
              rows={9} style={{ ...inputBase, resize: 'vertical', minHeight: 180, lineHeight: 1.6, fontFamily: 'ui-monospace, monospace', fontSize: 13 }} />
            <Hint>Defines the oracle personality. Injected as the system message on every request.</Hint>
          </div>

          {/* Model */}
          <div>
            <Label>Model</Label>
            <select value={oConfig.model} onChange={(e) => setO('model', e.target.value)} style={selectBase}>
              {OPENAI_MODELS.map((m) => (
                <option key={m.value} value={m.value} style={{ background: '#1e1025', color: '#fff' }}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Temperature + Top P */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
            <div>
              <Label>Temperature  <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{oConfig.temperature.toFixed(2)}</span></Label>
              <input type="range" min={0} max={2} step={0.05} value={oConfig.temperature} onChange={(e) => setO('temperature', parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }} />
              <Hint>0 = precise · 1 = balanced · 2 = creative</Hint>
            </div>
            <div>
              <Label>Top P  <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{oConfig.topP.toFixed(2)}</span></Label>
              <input type="range" min={0.01} max={1} step={0.01} value={oConfig.topP} onChange={(e) => setO('topP', parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }} />
              <Hint>Nucleus sampling — adjust only if not using temperature</Hint>
            </div>
          </div>

          {/* Presence + Frequency penalty */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
            <div>
              <Label>Presence Penalty  <span style={{ color: oConfig.presencePenalty > 0 ? '#34d399' : oConfig.presencePenalty < 0 ? '#f87171' : 'rgba(255,255,255,0.5)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{oConfig.presencePenalty > 0 ? '+' : ''}{oConfig.presencePenalty.toFixed(2)}</span></Label>
              <input type="range" min={-2} max={2} step={0.05} value={oConfig.presencePenalty} onChange={(e) => setO('presencePenalty', parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }} />
              <Hint>+ = explores new topics · − = stays on topic</Hint>
            </div>
            <div>
              <Label>Frequency Penalty  <span style={{ color: oConfig.frequencyPenalty > 0 ? '#34d399' : oConfig.frequencyPenalty < 0 ? '#f87171' : 'rgba(255,255,255,0.5)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{oConfig.frequencyPenalty > 0 ? '+' : ''}{oConfig.frequencyPenalty.toFixed(2)}</span></Label>
              <input type="range" min={-2} max={2} step={0.05} value={oConfig.frequencyPenalty} onChange={(e) => setO('frequencyPenalty', parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }} />
              <Hint>+ = reduces repetition · − = allows more repetition</Hint>
            </div>
          </div>

          {/* Max tokens + Seed */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
            <div>
              <Label>Max Tokens</Label>
              <input type="number" min={50} max={1000} step={10} value={oConfig.maxTokens} onChange={(e) => setO('maxTokens', parseInt(e.target.value, 10))} style={{ ...inputBase, width: '100%' }} />
              <Hint>400 ≈ 2–3 sentences · 800 ≈ full paragraph</Hint>
            </div>
            <div>
              <Label>Seed</Label>
              <input type="number" placeholder="empty = random" value={oConfig.seed ?? ''} onChange={(e) => setO('seed', e.target.value === '' ? null : parseInt(e.target.value, 10))} style={{ ...inputBase, width: '100%' }} />
              <Hint>Set a number for reproducible outputs</Hint>
            </div>
          </div>

          {/* Awakening delay */}
          <div>
            <Label>Awakening Delay  <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{oConfig.awakeningDelay}ms</span></Label>
            <input type="range" min={500} max={5000} step={100} value={oConfig.awakeningDelay} onChange={(e) => setO('awakeningDelay', parseInt(e.target.value, 10))} style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }} />
            <Hint>How long before auto-listening begins on /speak</Hint>
          </div>

          {/* Stop sequences */}
          <div>
            <Label>Stop Sequences  <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{oConfig.stopSequences.length}/4</span></Label>
            <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', marginBottom: 8 }}>
              {oConfig.stopSequences.map((s, i) => (
                <span key={i} style={{ background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 4, padding: '3px 10px', fontSize: 12, color: '#c4b5fd', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {s}
                  <button type="button" onClick={() => setO('stopSequences', oConfig.stopSequences.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'rgba(248,113,113,0.7)', cursor: 'pointer', padding: 0, fontSize: 13, lineHeight: 1 }}>×</button>
                </span>
              ))}
            </div>
            {oConfig.stopSequences.length < 4 && (
              <div style={{ display: 'flex', gap: spacing.sm }}>
                <input value={stopInput} onChange={(e) => setStopInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && stopInput.trim()) { setO('stopSequences', [...oConfig.stopSequences, stopInput.trim()]); setStopInput(''); } }}
                  placeholder="Type and press Enter…" style={{ ...inputBase, flex: 1 }} />
                <button type="button" onClick={() => { if (stopInput.trim()) { setO('stopSequences', [...oConfig.stopSequences, stopInput.trim()]); setStopInput(''); } }}
                  style={{ ...ghostBtn(), flexShrink: 0 }}>Add</button>
              </div>
            )}
            <Hint>API stops generating when any of these strings are reached</Hint>
          </div>

          {/* Test panel */}
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(167,139,250,0.12)', borderRadius: borderRadius.md, padding: spacing.lg, display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <Label>Live Test</Label>
            <textarea value={testInput} onChange={(e) => setTestInput(e.target.value)} placeholder="Type a message…" rows={2}
              style={{ ...inputBase, resize: 'none', fontFamily: 'inherit' }} />
            <button type="button" onClick={handleTestOracle} disabled={testLoading || !testInput.trim()}
              style={{ alignSelf: 'flex-start', background: 'rgba(124,58,237,0.5)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: borderRadius.md, color: '#fff', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', padding: `${spacing.sm} ${spacing.lg}`, cursor: testLoading ? 'default' : 'pointer', opacity: testLoading ? 0.6 : 1 }}>
              {testLoading ? 'Asking…' : 'Ask Oracle'}
            </button>
            {testReply && (
              <p style={{ color: '#e2d9f3', fontSize: 14, lineHeight: 1.6, margin: 0, padding: `${spacing.sm} ${spacing.md}`, background: 'rgba(167,139,250,0.06)', borderRadius: 6 }}>
                {testReply}
              </p>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* SECTION B — ORACLE VOICE                                           */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section style={card}>
          <SectionTitle dim="ElevenLabs · used on /speak">B — Oracle Voice</SectionTitle>

          {/* Engine toggle */}
          <div>
            <Label>Voice Engine</Label>
            <div style={{ display: 'flex', gap: spacing.md }}>
              {(['browser', 'elevenlabs'] as const).map((opt) => (
                <button key={opt} type="button" onClick={() => setEl('oracleEngine', opt)}
                  style={{ ...ghostBtn(elConfig.oracleEngine === opt), flex: 1, padding: `${spacing.md} 0` }}>
                  {opt === 'browser' ? 'Browser TTS (free)' : 'ElevenLabs'}
                </button>
              ))}
            </div>
            <Hint>Browser TTS = zero latency, no cost. ElevenLabs = richer voice, uses API credits.</Hint>
          </div>

          {elConfig.oracleEngine === 'browser' && (
            <div>
              <Label>Browser Voice Preference</Label>
              <input value={elConfig.oracleVoiceId || ''} onChange={(e) => setEl('oracleVoiceId', e.target.value)}
                placeholder="e.g. Samantha, Daniel, Karen…" style={inputBase} />
              <Hint>Enter a partial voice name. Falls back automatically if not available on this OS.</Hint>
            </div>
          )}

          {elConfig.oracleEngine === 'elevenlabs' && (
            <>
              <div>
                <Label>Voice</Label>
                <VoiceSelect value={elConfig.oracleVoiceId} onChange={(v) => setEl('oracleVoiceId', v)} />
              </div>
              <div>
                <Label>Model</Label>
                <select value={elConfig.oracleModel} onChange={(e) => setEl('oracleModel', e.target.value)} style={selectBase}>
                  {EL_MODELS.map((m) => <option key={m.value} value={m.value} style={{ background: '#1e1025', color: '#fff' }}>{m.label}</option>)}
                </select>
                <Hint>Flash models have ~75ms latency, ideal for real-time conversation.</Hint>
              </div>
              <VoiceSettingsBlock
                stability={elConfig.stability} similarityBoost={elConfig.similarityBoost}
                style={elConfig.style} useSpeakerBoost={elConfig.useSpeakerBoost}
                speed={elConfig.speed} optimizeLatency={elConfig.optimizeLatency}
                onChange={(key, val) => setEl(key as keyof ElevenLabsConfig, val as never)}
              />
              <button type="button" onClick={() => handlePreview('oracle')} disabled={previewTarget === 'oracle' || !elConfig.oracleVoiceId}
                style={{ alignSelf: 'flex-start', ...ghostBtn(previewTarget === 'oracle'), opacity: !elConfig.oracleVoiceId ? 0.4 : 1 }}>
                {previewTarget === 'oracle' ? 'Playing…' : 'Preview Voice'}
              </button>
            </>
          )}
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* SECTION C — CONTENT VOICE                                          */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section style={card}>
          <SectionTitle dim="ElevenLabs · used for affirmations, meditations, rituals · applies to Chat & Orb creation modes">C — Content Voice — Chat &amp; Orb modes</SectionTitle>
          <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 16, lineHeight: 1.6 }}>
            Controls the AI voice heard during content creation — both the text-chat flow (<code>/create/conversation</code>) and the voice-orb flow (<code>/create/orb</code>). The key read by both pages is <code>localStorage[&#39;elevenlabs-config&#39;].contentEngine / contentVoiceId</code>.
          </p>

          <div>
            <Label>Voice</Label>
            <VoiceSelect value={elConfig.contentVoiceId} onChange={(v) => setEl('contentVoiceId', v)} />
          </div>
          <div>
            <Label>Model</Label>
            <select value={elConfig.contentModel} onChange={(e) => setEl('contentModel', e.target.value)} style={selectBase}>
              {EL_MODELS.map((m) => <option key={m.value} value={m.value} style={{ background: '#1e1025', color: '#fff' }}>{m.label}</option>)}
            </select>
            <Hint>Multilingual v2 recommended for content — higher quality, latency less critical.</Hint>
          </div>
          <VoiceSettingsBlock
            stability={elConfig.contentStability} similarityBoost={elConfig.contentSimilarityBoost}
            style={elConfig.contentStyle} useSpeakerBoost={elConfig.contentUseSpeakerBoost}
            speed={elConfig.contentSpeed}
            onChange={(key, val) => {
              const map: Record<string, keyof ElevenLabsConfig> = {
                stability: 'contentStability', similarityBoost: 'contentSimilarityBoost',
                style: 'contentStyle', useSpeakerBoost: 'contentUseSpeakerBoost', speed: 'contentSpeed',
              };
              const elKey = map[key];
              if (elKey) setEl(elKey, val as never);
            }}
          />
          <button type="button" onClick={() => handlePreview('content')} disabled={previewTarget === 'content' || !elConfig.contentVoiceId}
            style={{ alignSelf: 'flex-start', ...ghostBtn(previewTarget === 'content'), opacity: !elConfig.contentVoiceId ? 0.4 : 1 }}>
            {previewTarget === 'content' ? 'Playing…' : 'Preview Voice'}
          </button>
        </section>

        {/* JSON preview */}
        <section style={card}>
          <SectionTitle>Current Config (JSON)</SectionTitle>
          <pre style={{ margin: 0, fontSize: 11, color: 'rgba(167,139,250,0.7)', fontFamily: 'ui-monospace, monospace', lineHeight: 1.7, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {JSON.stringify({ oracle: oConfig, elevenlabs: elConfig }, null, 2)}
          </pre>
        </section>

        <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11, textAlign: 'center', margin: 0, letterSpacing: '0.1em' }}>
          Saved to localStorage — applied on next /speak session
        </p>
      </motion.div>
    </PageShell>
    </SuperAdminGate>
  );
}
