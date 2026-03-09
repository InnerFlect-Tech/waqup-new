import { createCreditsService } from '../supabase/credits';

function makeMockClient(overrides: Record<string, unknown> = {}) {
  return {
    rpc: jest.fn(),
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } }),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockResolvedValue({ data: [], error: null }),
    ...overrides,
  };
}

describe('createCreditsService', () => {
  describe('getCreditBalance', () => {
    it('returns balance from RPC on success', async () => {
      const client = makeMockClient();
      (client.rpc as jest.Mock).mockResolvedValue({ data: 42, error: null });

      const service = createCreditsService(client as never);
      const result = await service.getCreditBalance();

      expect(result.success).toBe(true);
      expect(result.balance).toBe(42);
      expect(result.error).toBeNull();
    });

    it('returns 0 balance on RPC error', async () => {
      const client = makeMockClient();
      (client.rpc as jest.Mock).mockResolvedValue({ data: null, error: { message: 'RPC error' } });

      const service = createCreditsService(client as never);
      const result = await service.getCreditBalance();

      expect(result.success).toBe(false);
      expect(result.balance).toBe(0);
      expect(result.error).toBe('RPC error');
    });

    it('handles thrown exceptions gracefully', async () => {
      const client = makeMockClient();
      (client.rpc as jest.Mock).mockRejectedValue(new Error('network failure'));

      const service = createCreditsService(client as never);
      const result = await service.getCreditBalance();

      expect(result.success).toBe(false);
      expect(result.balance).toBe(0);
      expect(result.error).toContain('network failure');
    });
  });

  describe('getTransactionHistory', () => {
    it('returns empty array for unauthenticated user', async () => {
      const client = makeMockClient();
      (client.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: null } });

      const service = createCreditsService(client as never);
      const result = await service.getTransactionHistory();

      expect(result.success).toBe(false);
      expect(result.transactions).toHaveLength(0);
      expect(result.error).toBe('Not authenticated');
    });

    it('maps rows to CreditTransaction correctly', async () => {
      const mockRows = [
        { id: 'tx-1', amount: 50, description: 'Pack purchase', created_at: '2026-01-01T00:00:00Z' },
        { id: 'tx-2', amount: -3, description: 'AI chat', created_at: '2026-01-02T00:00:00Z' },
      ];

      const client = makeMockClient();
      (client.range as jest.Mock).mockResolvedValue({ data: mockRows, error: null });

      const service = createCreditsService(client as never);
      const result = await service.getTransactionHistory();

      expect(result.success).toBe(true);
      expect(result.transactions).toHaveLength(2);
      expect(result.transactions[0].type).toBe('credit');
      expect(result.transactions[1].type).toBe('debit');
      expect(result.transactions[0].amount).toBe(50);
    });
  });
});
