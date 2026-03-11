import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/** Edge required for @vercel/og; Next.js will warn that this route is not statically generated (expected). */
export const runtime = 'edge';

const TYPE_GRADIENT: Record<string, string> = {
  affirmation: 'linear-gradient(135deg, #4a1a6e 0%, #1a1a2e 100%)',
  meditation: 'linear-gradient(135deg, #1a2a4e 0%, #0a0f1e 100%)',
  ritual: 'linear-gradient(135deg, #0a2e1a 0%, #0a0f1e 100%)',
};

const TYPE_ACCENT: Record<string, string> = {
  affirmation: '#c084fc',
  meditation: '#60a5fa',
  ritual: '#34d399',
};

const TYPE_LABEL: Record<string, string> = {
  affirmation: 'Affirmation',
  meditation: 'Guided Meditation',
  ritual: 'Ritual',
};

/**
 * GET /api/og?id=<contentId>
 *
 * Generates a rich Open Graph image for sharing on social media.
 * Used as the og:image for /play/[id] public player pages.
 *
 * Designed for 1200×630 (standard OG), works as Instagram story crop too.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  // Defaults if content not found
  let title = 'A moment for you';
  let creatorName = 'waQup';
  let contentType = 'affirmation';
  let duration = '';

  if (id) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
      );
      const { data } = await supabase
        .from('content_items')
        .select('title, type, duration, user_id')
        .eq('id', id)
        .single();

      if (data) {
        title = data.title ?? title;
        contentType = data.type ?? contentType;
        duration = data.duration ?? '';

        // Fetch creator display name from profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, username')
          .eq('id', data.user_id)
          .single();

        if (profile) {
          creatorName = (profile as { full_name?: string; username?: string }).full_name
            ?? (profile as { full_name?: string; username?: string }).username
            ?? 'waQup creator';
        }
      }
    } catch {
      // Use defaults
    }
  }

  const gradient = TYPE_GRADIENT[contentType] ?? TYPE_GRADIENT.affirmation;
  const accent = TYPE_ACCENT[contentType] ?? '#c084fc';
  const typeLabel = TYPE_LABEL[contentType] ?? 'Affirmation';

  // Waveform bars — purely decorative, give audio feel
  const BARS = 40;
  const barHeights = Array.from({ length: BARS }, (_, i) => {
    const center = Math.abs(i - BARS / 2) / (BARS / 2);
    return 20 + Math.round((1 - center * center) * 60 + Math.sin(i * 0.9) * 15);
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 72px',
          background: gradient,
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)`,
          }}
        />

        {/* Top row: logo + type badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* waQup wordmark */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white' }} />
            </div>
            <span style={{ color: 'white', fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em' }}>
              waQup
            </span>
          </div>

          {/* Type badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '100px',
              background: `${accent}22`,
              border: `1px solid ${accent}55`,
            }}
          >
            <span style={{ color: accent, fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {typeLabel}
            </span>
          </div>
        </div>

        {/* Middle: title + creator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1
            style={{
              color: 'white',
              fontSize: title.length > 40 ? '48px' : '60px',
              fontWeight: '300',
              lineHeight: '1.1',
              margin: '0',
              letterSpacing: '-0.02em',
              maxWidth: '700px',
            }}
          >
            {title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '20px', margin: '0', fontWeight: '400' }}>
            by {creatorName}
            {duration ? ` · ${duration}` : ''}
          </p>
        </div>

        {/* Bottom: waveform + CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          {/* Waveform visualization */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '60px' }}>
            {barHeights.map((h, i) => (
              <div
                key={i}
                style={{
                  width: '5px',
                  height: `${h}px`,
                  borderRadius: '3px',
                  background: i < BARS * 0.4 ? accent : `${accent}55`,
                  opacity: 0.9,
                }}
              />
            ))}
          </div>

          {/* Listen CTA */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 28px',
              borderRadius: '100px',
              background: accent,
              color: 'white',
              fontSize: '16px',
              fontWeight: '700',
            }}
          >
            <div
              style={{
                width: '0',
                height: '0',
                borderStyle: 'solid',
                borderWidth: '6px 0 6px 10px',
                borderColor: `transparent transparent transparent white`,
              }}
            />
            Listen on waQup
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
