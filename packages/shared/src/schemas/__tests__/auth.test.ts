import { loginSchema, signupSchema, forgotPasswordSchema } from '../auth.schemas';

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'user@waqup.app', password: 'Password1' });
    expect(result.success).toBe(true);
  });

  it('rejects missing email', () => {
    const result = loginSchema.safeParse({ email: '', password: 'Password1' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email format', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'Password1' });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = loginSchema.safeParse({ email: 'user@waqup.app', password: 'abc' });
    expect(result.success).toBe(false);
  });
});

describe('signupSchema', () => {
  const valid = {
    email: 'new@waqup.app',
    password: 'Password1',
    confirmPassword: 'Password1',
    acceptTerms: true,
  };

  it('accepts valid signup data', () => {
    expect(signupSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    const result = signupSchema.safeParse({ ...valid, confirmPassword: 'Different1' });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.errors)).toContain('passwordsMustMatch');
  });

  it('rejects weak password (no uppercase)', () => {
    const result = signupSchema.safeParse({ ...valid, password: 'password1', confirmPassword: 'password1' });
    expect(result.success).toBe(false);
  });

  it('rejects weak password (no number)', () => {
    const result = signupSchema.safeParse({ ...valid, password: 'PasswordA', confirmPassword: 'PasswordA' });
    expect(result.success).toBe(false);
  });

  it('rejects unaccepted terms', () => {
    const result = signupSchema.safeParse({ ...valid, acceptTerms: false });
    expect(result.success).toBe(false);
  });
});

describe('forgotPasswordSchema', () => {
  it('accepts valid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'user@waqup.app' }).success).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'bad' }).success).toBe(false);
  });
});
