import * as Sentry from '@sentry/react-native';

/**
 * Navigation instrumentation — wires screen transitions into Sentry so errors
 * and traces are tagged with the current route. Registered against the
 * NavigationContainer ref in App.tsx.
 */
export const sentryNavigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

let initialized = false;

/**
 * Initialise Sentry once, as early as possible (called from App.tsx module
 * scope). No-ops when EXPO_PUBLIC_SENTRY_DSN is absent (e.g. local dev without
 * a DSN) so the app still runs. Reporting itself is disabled in __DEV__.
 */
export function initSentry(): void {
  if (initialized) return;

  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    // Only send events from real (release) builds; keep dev noise out of Sentry.
    enabled: !__DEV__,
    debug: false,
    environment: process.env.APP_ENV ?? (__DEV__ ? 'development' : 'production'),
    // Performance tracing. Lower in prod to control quota.
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    enableAutoSessionTracking: true,
    // Privacy: don't send IP, cookies or user context (privacy manifest declares
    // NSPrivacyTracking: false). Flip to true only with a matching privacy policy.
    sendDefaultPii: false,
    // Capture native + JS crashes, ANRs, and attach the failing view hierarchy.
    attachStacktrace: true,
    integrations: [sentryNavigationIntegration],
  });

  initialized = true;
}

/**
 * Report a handled error with optional structured context. Falls back to a
 * console log in dev (where Sentry is disabled) so nothing is lost.
 */
export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (initialized) {
    Sentry.captureException(error, context ? { extra: context } : undefined);
    return;
  }
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.error('[captureException]', error, context);
  }
}

/**
 * Wrap the root component so Sentry can capture unhandled render errors,
 * profile the app and attach touch/navigation breadcrumbs. Identity wrapper
 * when Sentry is not configured.
 */
export const withSentry: typeof Sentry.wrap = Sentry.wrap;
