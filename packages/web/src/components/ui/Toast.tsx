'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTheme, BLUR, spacing, borderRadius } from '@/theme';
import { withOpacity } from '@waqup/shared/theme';

// ─── Types ──────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  dismiss: (id: string) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = 'info', duration = 4000) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev.slice(-4), { id, message, variant, duration }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss],
  );

  const success = useCallback((m: string, d?: number) => toast(m, 'success', d), [toast]);
  const error = useCallback((m: string, d?: number) => toast(m, 'error', d), [toast]);
  const warning = useCallback((m: string, d?: number) => toast(m, 'warning', d), [toast]);
  const info = useCallback((m: string, d?: number) => toast(m, 'info', d), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// ─── Container ───────────────────────────────────────────────────────────────

function getVariantStyles(colors: {
  success: string;
  error: string;
  warning: string;
  info: string;
}): Record<ToastVariant, { bg: string; border: string; icon: string; color: string }> {
  return {
    success: { bg: withOpacity(colors.success, 0.12), border: withOpacity(colors.success, 0.3), icon: '✓', color: colors.success },
    error: { bg: withOpacity(colors.error, 0.12), border: withOpacity(colors.error, 0.3), icon: '✕', color: colors.error },
    warning: { bg: withOpacity(colors.warning, 0.12), border: withOpacity(colors.warning, 0.3), icon: '!', color: colors.warning },
    info: { bg: withOpacity(colors.info, 0.12), border: withOpacity(colors.info, 0.3), icon: 'i', color: colors.info },
  };
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: spacing.lg,
        right: spacing.lg,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.sm,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const variantStyles = getVariantStyles({
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
  });
  const s = variantStyles[toast.variant];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
        padding: `${spacing.sm} ${spacing.lg}`,
        background: colors.background.secondary,
        border: `1px solid ${s.border}`,
        borderLeft: `3px solid ${s.color}`,
        borderRadius: borderRadius.lg,
        backdropFilter: BLUR.xl,
        WebkitBackdropFilter: BLUR.xl,
        minWidth: '280px',
        maxWidth: '400px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        pointerEvents: 'all',
        cursor: 'pointer',
        transform: visible ? 'translateX(0)' : 'translateX(120%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.3s ease, opacity 0.3s ease',
      }}
      onClick={() => onDismiss(toast.id)}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: s.bg,
          border: `1px solid ${s.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.625rem',
          fontWeight: 700,
          color: s.color,
          flexShrink: 0,
        }}
      >
        {s.icon}
      </div>
      <span style={{ color: colors.text.onDark, fontSize: '0.875rem', lineHeight: 1.4, flex: 1 }}>
        {toast.message}
      </span>
    </div>
  );
}
