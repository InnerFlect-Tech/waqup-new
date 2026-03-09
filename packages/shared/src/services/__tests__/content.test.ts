import { createContentService } from '../supabase/content';

function makeMockClient(overrides: Record<string, unknown> = {}) {
  const mockChain = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    not: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  };

  return {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@waqup.app' } },
      }),
    },
    from: jest.fn().mockReturnValue(mockChain),
    _chain: mockChain,
    ...overrides,
  };
}

describe('createContentService', () => {
  describe('createContent', () => {
    it('returns error when user is not authenticated', async () => {
      const client = makeMockClient();
      (client.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: null } });

      const service = createContentService(client as never);
      const result = await service.createContent({
        type: 'affirmation',
        title: 'Test',
        description: 'Test desc',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
      expect(result.data).toBeNull();
    });

    it('calls insert with correct payload', async () => {
      const mockData = {
        id: 'content-123',
        type: 'affirmation',
        title: 'My Affirmation',
        description: 'Build confidence',
        status: 'draft',
        created_at: '2026-01-01T00:00:00Z',
        duration: '',
        frequency: null,
        script: null,
        audio_url: null,
        voice_type: null,
        audio_settings: null,
        last_played_at: null,
        updated_at: null,
      };

      const client = makeMockClient();
      const chain = client._chain;
      chain.single.mockResolvedValue({ data: mockData, error: null });

      const service = createContentService(client as never);
      const result = await service.createContent({
        type: 'affirmation',
        title: 'My Affirmation',
        description: 'Build confidence',
        status: 'draft',
      });

      expect(client.from).toHaveBeenCalledWith('content_items');
      expect(result.success).toBe(true);
      expect(result.data?.id).toBe('content-123');
      expect(result.data?.type).toBe('affirmation');
    });

    it('returns DB error on insert failure', async () => {
      const client = makeMockClient();
      const chain = client._chain;
      chain.single.mockResolvedValue({ data: null, error: { message: 'unique constraint violation' } });

      const service = createContentService(client as never);
      const result = await service.createContent({
        type: 'meditation',
        title: 'Deep Calm',
        description: '',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('unique constraint');
    });
  });

  describe('getUserContent', () => {
    it('returns empty array for unauthenticated user', async () => {
      const client = makeMockClient();
      (client.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: null } });

      // getUserContent uses a different query path — mock from().select().eq().order()
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      };
      (client.from as jest.Mock).mockReturnValue(mockChain);

      const service = createContentService(client as never);
      const result = await service.getUserContent();

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });
  });
});
