import { logger } from './logger';

/**
 * Retry configuration with exponential backoff
 */
const DEFAULT_RETRY_CONFIG = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  shouldRetry: null, // Custom retry predicate
};

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(attempt, config) {
  const exponentialDelay = Math.min(
    config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1),
    config.maxDelay
  );

  // Add jitter (±25% randomization)
  const jitter = exponentialDelay * 0.25 * (Math.random() * 2 - 1);
  return Math.max(0, exponentialDelay + jitter);
}

/**
 * Check if error is retryable
 */
function isRetryableError(error, config) {
  // Custom retry logic
  if (config.shouldRetry) {
    return config.shouldRetry(error);
  }

  // Network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return true;
  }

  // Timeout errors
  if (error.name === 'AbortError' || error.message.includes('timeout')) {
    return true;
  }

  // HTTP status codes
  if (error.response?.status) {
    return config.retryableStatuses.includes(error.response.status);
  }

  // Axios errors
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return true;
  }

  return false;
}

/**
 * Retry a function with exponential backoff
 *
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry configuration options
 * @returns {Promise} - Resolves with fn result or rejects after max attempts
 *
 * @example
 * const data = await retryWithBackoff(
 *   () => fetch('/api/data').then(r => r.json()),
 *   { maxAttempts: 3 }
 * );
 */
export async function retryWithBackoff(fn, options = {}) {
  const config = { ...DEFAULT_RETRY_CONFIG, ...options };
  let lastError;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      const result = await fn();

      if (attempt > 1) {
        logger.info(
          { attempt, maxAttempts: config.maxAttempts },
          'Request succeeded after retry'
        );
      }

      return result;
    } catch (error) {
      lastError = error;

      const shouldRetry = isRetryableError(error, config);
      const isLastAttempt = attempt === config.maxAttempts;

      logger.warn(
        {
          attempt,
          maxAttempts: config.maxAttempts,
          error: error.message,
          status: error.response?.status,
          willRetry: shouldRetry && !isLastAttempt,
        },
        'Request failed'
      );

      if (!shouldRetry || isLastAttempt) {
        break;
      }

      // Wait before retrying
      const delay = calculateDelay(attempt, config);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  logger.error(
    {
      error: lastError.message,
      attempts: config.maxAttempts,
    },
    'Request failed after all retry attempts'
  );

  throw lastError;
}

/**
 * Create a fetch wrapper with automatic retry
 *
 * @param {Object} options - Retry configuration
 * @returns {Function} - Fetch function with retry logic
 *
 * @example
 * const fetchWithRetry = createRetryFetch({ maxAttempts: 3 });
 * const response = await fetchWithRetry('/api/data');
 */
export function createRetryFetch(options = {}) {
  return async (url, fetchOptions) => {
    return retryWithBackoff(async () => {
      const response = await fetch(url, fetchOptions);

      // Treat HTTP errors as retryable
      if (!response.ok) {
        const error = new Error(
          `HTTP ${response.status}: ${response.statusText}`
        );
        error.response = response;
        throw error;
      }

      return response;
    }, options);
  };
}

/**
 * Create an axios wrapper with automatic retry
 *
 * @param {Object} axiosInstance - Axios instance
 * @param {Object} options - Retry configuration
 * @returns {Object} - Axios-like object with retry logic
 *
 * @example
 * import axios from 'axios';
 * const axiosWithRetry = createRetryAxios(axios, { maxAttempts: 3 });
 * const { data } = await axiosWithRetry.get('/api/data');
 */
export function createRetryAxios(axiosInstance, options = {}) {
  const retryRequest =
    (method) =>
    async (...args) => {
      return retryWithBackoff(() => axiosInstance[method](...args), options);
    };

  return {
    get: retryRequest('get'),
    post: retryRequest('post'),
    put: retryRequest('put'),
    patch: retryRequest('patch'),
    delete: retryRequest('delete'),
  };
}
