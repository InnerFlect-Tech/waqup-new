'use client';

import { QueryClient } from '@tanstack/react-query';

// Singleton pattern for Next.js — one client per request on server,
// one shared client on client.
let browserQueryClient: QueryClient | undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 min — data stays fresh for 1 min
        gcTime: 5 * 60 * 1000, // 5 min — cached data kept for 5 min
        retry: 2,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

export function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
