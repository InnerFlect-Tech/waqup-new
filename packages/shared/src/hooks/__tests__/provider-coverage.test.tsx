/**
 * @jest-environment jsdom
 *
 * Provider coverage verification — ensures hooks from createContentHooks
 * (useContentQuery, useContentItemQuery) require QueryClientProvider.
 * Web and Mobile wrap their app in QueryClientProvider; this test verifies that
 * a component using useContentQuery renders correctly when wrapped.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContentHooks } from '../useContent';
import type { ContentItem } from '../../types';

const mockContentService = {
  getUserContent: async (): Promise<{ success: boolean; data: ContentItem[] | null; error: string | null }> =>
    ({ success: true, data: [], error: null }),
  getContentById: async (): Promise<{ success: boolean; data: ContentItem | null; error: string | null }> =>
    ({ success: false, data: null, error: null }),
  createContent: async (): Promise<{ success: boolean; data: ContentItem | null; error: string | null }> =>
    ({ success: false, data: null, error: null }),
  updateContent: async (): Promise<{ success: boolean; data: ContentItem | null; error: string | null }> =>
    ({ success: false, data: null, error: null }),
  deleteContent: async (): Promise<{ success: boolean; error: string | null }> =>
    ({ success: false, error: null }),
  recordPlay: async (): Promise<{ success: boolean; error: string | null }> =>
    ({ success: false, error: null }),
};

const { useContentQuery } = createContentHooks(mockContentService as never);

function TestContentConsumer() {
  const { data, isLoading } = useContentQuery();
  return <div data-testid="content-status">{isLoading ? 'loading' : `items: ${(data ?? []).length}`}</div>;
}

describe('Provider coverage', () => {
  it('component using useContentQuery renders when wrapped in QueryClientProvider', () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <TestContentConsumer />
      </QueryClientProvider>
    );

    expect(getByTestId('content-status')).toBeTruthy();
  });
});
