import { getCreditCost, AI_MODE_COSTS, CONTENT_CREDIT_COSTS } from '../content-costs';

describe('AI_MODE_COSTS', () => {
  it('form mode is free', () => {
    expect(AI_MODE_COSTS.form).toBe(0);
  });

  it('chat mode costs 3 Qs', () => {
    expect(AI_MODE_COSTS.chat).toBe(3);
  });

  it('agent mode costs 7 Qs', () => {
    expect(AI_MODE_COSTS.agent).toBe(7);
  });
});

describe('getCreditCost', () => {
  it('form + no AI voice = base cost only', () => {
    expect(getCreditCost('affirmation', 'form', false)).toBe(CONTENT_CREDIT_COSTS.affirmation.base);
    expect(getCreditCost('meditation', 'form', false)).toBe(CONTENT_CREDIT_COSTS.meditation.base);
    expect(getCreditCost('ritual', 'form', false)).toBe(CONTENT_CREDIT_COSTS.ritual.base);
  });

  it('form + AI voice = base withAi cost', () => {
    expect(getCreditCost('affirmation', 'form', true)).toBe(CONTENT_CREDIT_COSTS.affirmation.withAi);
  });

  it('chat + no AI voice = 3 + base', () => {
    expect(getCreditCost('affirmation', 'chat', false)).toBe(3 + CONTENT_CREDIT_COSTS.affirmation.base);
  });

  it('agent + AI voice = 7 + withAi', () => {
    expect(getCreditCost('meditation', 'agent', true)).toBe(7 + CONTENT_CREDIT_COSTS.meditation.withAi);
  });

  it('agent mode is always the most expensive option', () => {
    const agentCost = getCreditCost('ritual', 'agent', true);
    const chatCost = getCreditCost('ritual', 'chat', true);
    const formCost = getCreditCost('ritual', 'form', true);
    expect(agentCost).toBeGreaterThan(chatCost);
    expect(chatCost).toBeGreaterThan(formCost);
  });
});
