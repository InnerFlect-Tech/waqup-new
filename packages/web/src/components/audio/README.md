# Audio Components

## AudioWaveform

A **single, cohesive waveform** visualization for audio playback. No page cycling — just a reactive bar wave that responds to audio.

### Features

- **Idle state**: Subtle static bars (sine-wave pattern)
- **Playing**: Live frequency-driven bars when `frequencyData` is provided from Web Audio analyser
- **Theme integration**: Uses accent colors from theme
- **Smooth transitions**: Height and opacity animate based on play state

### Usage

```tsx
import { AudioWaveform } from '@/components/audio';
import { useWebAudioPlayer } from '@/hooks';

function AudioPlayer({ layers }) {
  const { state, analyserNode } = useWebAudioPlayer(layers);
  const isPlaying = state === 'playing';
  const [freqData, setFreqData] = useState<number[]>([]);

  useEffect(() => {
    if (!analyserNode || !isPlaying) { setFreqData([]); return; }
    const buf = new Uint8Array(analyserNode.frequencyBinCount);
    let raf = 0;
    const tick = () => {
      analyserNode.getByteFrequencyData(buf);
      setFreqData(Array.from(buf.slice(0, 32)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [analyserNode, isPlaying]);

  return (
    <AudioWaveform
      isPlaying={isPlaying}
      frequencyData={freqData}
      style={{ minHeight: 200 }}
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isPlaying` | `boolean` | — | Whether audio is currently playing |
| `frequencyData` | `number[]` | `[]` | Raw frequency values 0–255 from `getByteFrequencyData` |
| `accentColor` | `string` | theme accent | Color for the bars |
| `style` | `React.CSSProperties` | — | Custom inline styles |

### Where it's used

- **AudioPage** – Edit-audio mix step (full analyser pipeline)
- **PublicPlayerClient** – Public play page
- **marketplace/[id]** – Marketplace item detail
- **ContentDetailPage** – Sanctuary content detail (idle bars when no analyser)
