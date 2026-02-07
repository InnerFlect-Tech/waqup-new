# Audio Components

## SpeakingAnimation

A **refined, professional** 4-page animated component with ChatGPT-like simplicity and futuristic glass-morphism design. Features clean minimalism, ample white space, and subtle animations that maintain a high-quality, professional feel.

### 🎨 Design Philosophy

- **ChatGPT-like Simplicity** - Clean, minimal design with focus on content
- **Professional Glass-morphism** - Subtle translucent effects with backdrop blur
- **Futuristic Vibes** - Refined, high-quality aesthetic without overwhelming visuals
- **Ample White Space** - Clean layouts with breathing room
- **Subtle Animations** - Smooth, professional transitions

### ✨ Features

- **4 Clean Pages**: Each page features elegant, minimal animations:
  1. **Minimal Floating Orbs** - Three glass orbs with subtle floating motion
  2. **Clean Frequency Bars** - 12 refined frequency bars with gentle pulsing
  3. **Subtle Wave Pattern** - Layered concentric waves with soft expansion
  4. **Minimal Rotating Rings** - Two rotating rings with clean lines

- **Professional Effects**:
  - 🪟 **Glass-morphism** - Subtle translucent cards with backdrop blur
  - 🎨 **Clean Gradients** - Refined color transitions
  - ✨ **Subtle Glows** - Minimal shadow effects
  - 🌊 **Smooth Transitions** - Professional fade and slide animations

- **Theme Integration**:
  - Uses `useTheme()` hook for dynamic theming
  - Respects theme colors and glass effects
  - Fully responsive and accessible

### 📦 Usage

```tsx
import { SpeakingAnimation } from '@/components';

function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequencyData, setFrequencyData] = useState<number[]>([]);

  // Optional: Connect to real audio frequency data
  useEffect(() => {
    if (isPlaying) {
      // Your audio analysis code here
      // setFrequencyData(analyzedFrequencies);
    }
  }, [isPlaying]);

  return (
    <div style={{ width: '100%', height: '450px' }}>
      <SpeakingAnimation 
        isSpeaking={isPlaying}
        pageDuration={5000} // 5 seconds per page
        frequencyData={frequencyData} // Optional: real frequency data
      />
    </div>
  );
}
```

### 🎛️ Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isSpeaking` | `boolean` | `false` | Whether audio is currently playing/speaking |
| `pageDuration` | `number` | `5000` | Duration for each page transition in milliseconds |
| `className` | `string` | `''` | Custom CSS class name |
| `style` | `React.CSSProperties` | `undefined` | Custom inline styles |
| `frequencyData` | `number[]` | `undefined` | Optional array of frequency values (0-1) for reactive visualization |

### 🎯 Example Integration

```tsx
'use client';

import { useState } from 'react';
import { SpeakingAnimation } from '@/components';
import { Button } from '@/components';

export default function AudioPlaybackPage() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTogglePlayback = () => {
    setIsPlaying(!isPlaying);
    // Your audio playback logic here
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div 
        style={{ 
          width: '100%', 
          height: '450px', 
          marginBottom: '2rem',
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#FAFAFA',
          border: '1px solid #E0E0E0',
        }}
      >
        <SpeakingAnimation 
          isSpeaking={isPlaying}
          pageDuration={5000}
        />
      </div>
      
      <Button onClick={handleTogglePlayback}>
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
    </div>
  );
}
```

### 🎨 Visual Design

The component features:

- **Clean Backgrounds** - Light, airy backgrounds with subtle gradients
- **Glass-morphism** - Translucent elements with backdrop blur
- **Minimal Animations** - Subtle, professional motion
- **White Space** - Ample breathing room for clarity
- **Refined Typography** - Clean, readable text
- **Smooth Transitions** - Professional fade and slide effects

### 🔧 Advanced: Real Frequency Data

For real-time audio frequency visualization, connect to Web Audio API:

```tsx
import { useState, useEffect, useRef } from 'react';
import { SpeakingAnimation } from '@/components';

function AudioVisualizer({ audioUrl }: { audioUrl: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequencyData, setFrequencyData] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 32; // 16 frequency bins for cleaner look
    
    // Connect audio source to analyser
    // ... your audio setup code
    
    analyserRef.current = analyser;
    
    const updateFrequencyData = () => {
      if (!isPlaying) return;
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      
      // Normalize to 0-1 range
      const normalized = Array.from(dataArray).map(val => val / 255);
      setFrequencyData(normalized);
      
      requestAnimationFrame(updateFrequencyData);
    };
    
    if (isPlaying) {
      updateFrequencyData();
    }
    
    return () => {
      audioContext.close();
    };
  }, [isPlaying]);

  return (
    <SpeakingAnimation 
      isSpeaking={isPlaying}
      frequencyData={frequencyData}
    />
  );
}
```

### 🎭 Page Details

#### Page 1: Minimal Floating Orbs
- Three glass orbs with subtle floating motion
- Clean glass-morphism with backdrop blur
- Minimal shadows and glows
- Represents calm, contemplative state

#### Page 2: Clean Frequency Bars
- 12 refined frequency bars
- Gentle pulsing animation
- Clean gradient fills
- Perfect for audio visualization

#### Page 3: Subtle Wave Pattern
- Three layered concentric waves
- Soft expansion and contraction
- Minimal opacity changes
- Represents flow and rhythm

#### Page 4: Minimal Rotating Rings
- Two rotating rings with clean lines
- Different rotation speeds
- Minimal visual weight
- Represents harmony and balance

### ⚡ Performance

- **GPU-Accelerated** - Uses `transform` and `opacity` for smooth 60fps animations
- **Optimized Rendering** - Minimal DOM elements for better performance
- **CSS Animations** - Hardware-accelerated CSS keyframe animations
- **Lazy Rendering** - Only renders when `isSpeaking` is true

### 🎨 Design Notes

- **ChatGPT-like** - Clean, minimal design with focus on clarity
- **Professional** - Refined aesthetic suitable for professional applications
- **Glass-morphism** - Subtle translucent effects for modern feel
- **Futuristic** - High-quality vibes without overwhelming visuals
- **Accessible** - Proper ARIA labels and semantic HTML
- **Responsive** - Works beautifully on all screen sizes

### 🔮 Design Principles

1. **Less is More** - Minimal animations, maximum impact
2. **White Space** - Ample breathing room for clarity
3. **Subtle Effects** - Professional glows and shadows
4. **Clean Lines** - Simple geometric shapes
5. **Smooth Motion** - Professional transitions
6. **Glass-morphism** - Modern translucent aesthetic
