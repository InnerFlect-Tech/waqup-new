import type { ContentItem } from './ContentItem';

const MOCK_BY_TYPE: Record<'affirmation' | 'ritual' | 'meditation', ContentItem[]> = {
  affirmation: [
    {
      id: '1',
      type: 'affirmation',
      title: 'Abundance Mindset',
      description: 'Attract prosperity and success',
      duration: '5:00',
      frequency: '528Hz',
      lastPlayed: '2024-03-12',
      script: 'I am worthy of abundance.\nEvery day I attract prosperity and success.\nThe universe supports my goals.',
    },
    {
      id: '2',
      type: 'affirmation',
      title: 'Confidence Daily',
      description: 'Step into your power with certainty',
      duration: '4:30',
      lastPlayed: '2024-03-10',
      script: 'I am confident and capable.\nI trust myself to handle any situation.\nMy presence matters.',
    },
  ],
  ritual: [
    {
      id: '1',
      type: 'ritual',
      title: 'Morning Empowerment',
      description: 'Start your day with confidence and purpose',
      duration: '10:00',
      frequency: '432Hz',
      lastPlayed: '2024-03-10',
      script: 'Welcome to your morning ritual. Breathe deeply. Set your intention for the day. You are powerful.',
    },
    {
      id: '2',
      type: 'ritual',
      title: 'Evening Gratitude',
      description: 'Reflect and unwind before sleep',
      duration: '8:00',
      lastPlayed: '2024-03-11',
    },
  ],
  meditation: [
    {
      id: '1',
      type: 'meditation',
      title: 'Deep Relaxation',
      description: 'Find peace and tranquility',
      duration: '15:00',
      lastPlayed: '2024-03-11',
      script: 'Close your eyes. Breathe in slowly. Release tension with each exhale. You are safe and at peace.',
    },
    {
      id: '2',
      type: 'meditation',
      title: 'Mindful Breath',
      description: 'Center yourself with focused breathing',
      duration: '12:00',
      lastPlayed: '2024-03-09',
      script: 'Focus on your breath. In and out. Let thoughts pass like clouds. Return to the breath.',
    },
  ],
};

export function getMockContent(contentType: 'affirmation' | 'ritual' | 'meditation', id: string): ContentItem | null {
  const list = MOCK_BY_TYPE[contentType];
  return list.find((item) => item.id === id) ?? null;
}
