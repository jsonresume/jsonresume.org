/**
 * Currency conversion utilities for job salary display
 */

// Common currency symbols to codes
const CURRENCY_SYMBOLS = {
  $: 'USD',
  '€': 'EUR',
  '£': 'GBP',
  '¥': 'JPY',
  '₹': 'INR',
  A$: 'AUD',
  C$: 'CAD',
  CHF: 'CHF',
  kr: 'SEK',
  '₩': 'KRW',
};

// Cache exchange rates (refreshed every hour)
let ratesCache = null;
let ratesCacheTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Detect user's preferred currency from browser locale
 */
export function getUserCurrency() {
  if (typeof navigator === 'undefined') return 'USD';

  try {
    const locale = navigator.language || 'en-US';
    // Map common locales to currencies
    const localeCurrencyMap = {
      'en-US': 'USD',
      'en-GB': 'GBP',
      'en-AU': 'AUD',
      'en-CA': 'CAD',
      'de-DE': 'EUR',
      'fr-FR': 'EUR',
      'es-ES': 'EUR',
      'it-IT': 'EUR',
      'ja-JP': 'JPY',
      'zh-CN': 'CNY',
      'ko-KR': 'KRW',
      'hi-IN': 'INR',
    };

    // Try exact match first
    if (localeCurrencyMap[locale]) return localeCurrencyMap[locale];

    // Try language prefix
    const lang = locale.split('-')[0];
    const prefixMatch = Object.entries(localeCurrencyMap).find(([k]) =>
      k.startsWith(lang + '-')
    );
    if (prefixMatch) return prefixMatch[1];

    return 'USD';
  } catch {
    return 'USD';
  }
}

/**
 * Extract currency code from salary string
 */
export function detectCurrency(salaryStr) {
  if (!salaryStr) return 'USD';

  const str = String(salaryStr);

  // Check for explicit currency codes
  const codeMatch = str.match(/\b(USD|EUR|GBP|JPY|INR|AUD|CAD|CHF|SEK|KRW)\b/i);
  if (codeMatch) return codeMatch[1].toUpperCase();

  // Check for currency symbols
  for (const [symbol, code] of Object.entries(CURRENCY_SYMBOLS)) {
    if (str.includes(symbol)) return code;
  }

  return 'USD';
}

/**
 * Fetch exchange rates from free API
 */
export async function fetchExchangeRates(baseCurrency = 'USD') {
  // Return cached rates if still valid
  if (ratesCache && Date.now() - ratesCacheTime < CACHE_DURATION) {
    return ratesCache;
  }

  try {
    // Using frankfurter.app - free, no API key needed
    const response = await fetch(
      `https://api.frankfurter.app/latest?from=${baseCurrency}`
    );
    if (!response.ok) throw new Error('Failed to fetch rates');

    const data = await response.json();
    ratesCache = {
      base: baseCurrency,
      rates: { [baseCurrency]: 1, ...data.rates },
    };
    ratesCacheTime = Date.now();
    return ratesCache;
  } catch {
    // Fallback rates (approximate)
    return {
      base: 'USD',
      rates: {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 149,
        INR: 83,
        AUD: 1.53,
        CAD: 1.36,
        CHF: 0.88,
        SEK: 10.5,
        KRW: 1320,
      },
    };
  }
}

/**
 * Convert amount between currencies
 */
export function convertCurrency(amount, fromCurrency, toCurrency, rates) {
  if (!rates || fromCurrency === toCurrency) return amount;

  const fromRate = rates.rates[fromCurrency] || 1;
  const toRate = rates.rates[toCurrency] || 1;

  // Convert to base currency first, then to target
  const inBase = amount / fromRate;
  return inBase * toRate;
}

/**
 * Format currency amount for display
 */
export function formatCurrencyAmount(amount, currency = 'USD') {
  if (typeof Intl !== 'undefined') {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      // Fallback
    }
  }

  // Simple fallback
  const symbols = { USD: '$', EUR: '€', GBP: '£', JPY: '¥' };
  const symbol = symbols[currency] || currency + ' ';
  return `${symbol}${Math.round(amount).toLocaleString()}`;
}
