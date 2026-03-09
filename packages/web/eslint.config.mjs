import nextConfig from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextConfig,
  {
    rules: {
      // These new react-hooks rules flag valid React patterns (data fetching in
      // effects, syncing refs during render) - disable until they mature.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
    },
  },
];

export default config;
