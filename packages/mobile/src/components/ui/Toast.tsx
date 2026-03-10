import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, spacing, borderRadius } from '@/theme';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
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
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = 'info', duration = 3500) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev.slice(-2), { id, message, variant }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const success = useCallback((m: string, d?: number) => toast(m, 'success', d), [toast]);
  const error = useCallback((m: string, d?: number) => toast(m, 'error', d), [toast]);
  const warning = useCallback((m: string, d?: number) => toast(m, 'warning', d), [toast]);
  const info = useCallback((m: string, d?: number) => toast(m, 'info', d), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// ─── Stack ───────────────────────────────────────────────────────────────────

const VARIANT_ICONS: Record<ToastVariant, string> = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i',
};

function ToastStack({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.stack, { bottom: insets.bottom + 80 }]} pointerEvents="none">
      {toasts.map((t) => (
        <ToastBubble key={t.id} toast={t} />
      ))}
    </View>
  );
}

function ToastBubble({ toast }: { toast: ToastItem }) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const variantColor = { success: colors.success, error: colors.error, warning: colors.warning, info: colors.info }[toast.variant];
  const icon = VARIANT_ICONS[toast.variant];

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          backgroundColor: colors.background.secondary,
          borderColor: colors.glass.border,
          borderLeftColor: variantColor,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={[styles.iconCircle, { borderColor: variantColor + '55', backgroundColor: variantColor + '22' }]}>
        <Text style={[styles.iconText, { color: variantColor }]}>{icon}</Text>
      </View>
      <Text style={[styles.message, { color: colors.text.primary }]} numberOfLines={2}>
        {toast.message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stack: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    gap: spacing.sm,
    zIndex: 9999,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderLeftWidth: 3,
    borderRadius: borderRadius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconText: {
    fontSize: 10,
    fontWeight: '700',
  },
  message: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
