type SentryModule = {
  init: (options: Record<string, unknown>) => void;
  captureException: (error: unknown, context?: Record<string, unknown>) => void;
};

let sentry: SentryModule | null = null;

export function initSentry(): void {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

  if (!dsn) return;

  try {
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
    const mod = require('@sentry/react-native') as SentryModule;
    mod.init({
      dsn,
      enableAutoSessionTracking: true,
      tracesSampleRate: __DEV__ ? 1.0 : 0.2,
      enabled: !__DEV__,
    });
    sentry = mod;
  } catch {
    // Sentry not installed; remain a no-op.
  }
}

export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (sentry) {
    sentry.captureException(error, context);
    return;
  }
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.error('[captureException]', error, context);
  }
}
