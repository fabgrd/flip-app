import { captureException } from './sentry';

export interface RetryOptions {
  /** Max attempts including the first try. Default: 3. */
  retries?: number;
  /** Base delay between retries in ms. Doubles each attempt. Default: 400. */
  baseDelayMs?: number;
  /** Cap on backoff delay in ms. Default: 5000. */
  maxDelayMs?: number;
  /** Optional predicate — return false to stop retrying on this error. */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  /** Scope tag forwarded to Sentry on final failure. */
  scope?: string;
}

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * Retries an async operation with exponential backoff.
 * On final failure forwards the error to Sentry (if configured) and rethrows.
 */
export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const retries = options.retries ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 400;
  const maxDelayMs = options.maxDelayMs ?? 5_000;
  const shouldRetry = options.shouldRetry ?? (() => true);

  let attempt = 0;
  let lastError: unknown;

  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      attempt += 1;
      if (attempt >= retries || !shouldRetry(error, attempt)) break;
      const delay = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
      // Add jitter so concurrent failures don't all retry in lockstep.
      const jitter = Math.floor(Math.random() * (delay * 0.25));
      await sleep(delay + jitter);
    }
  }

  captureException(lastError, { scope: options.scope ?? 'withRetry', attempts: attempt });
  throw lastError;
}
