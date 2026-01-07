/**
 * Intelligent Salary Normalizer
 * Parses any human-typed salary format and normalizes to USD (rounded to nearest 1000)
 *
 * Output schema: { salaryUsd, salaryMin, salaryMax, salaryCurrency, confidence }
 */

// Currency symbols and codes mapping
const CURRENCY_MAP = {
  // Symbols
  $: 'USD',
  '€': 'EUR',
  '£': 'GBP',
  '¥': 'JPY', // Also CNY - context needed
  '₹': 'INR',
  '₩': 'KRW',
  '₽': 'RUB',
  '₱': 'PHP',
  '฿': 'THB',
  '₪': 'ILS',
  zł: 'PLN',
  R$: 'BRL',

  // Prefixed symbols
  A$: 'AUD',
  AU$: 'AUD',
  C$: 'CAD',
  CA$: 'CAD',
  NZ$: 'NZD',
  S$: 'SGD',
  HK$: 'HKD',
  US$: 'USD',

  // Codes
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  JPY: 'JPY',
  INR: 'INR',
  AUD: 'AUD',
  CAD: 'CAD',
  CHF: 'CHF',
  SEK: 'SEK',
  NZD: 'NZD',
  SGD: 'SGD',
  HKD: 'HKD',
  CNY: 'CNY',
  KRW: 'KRW',
  MXN: 'MXN',
  BRL: 'BRL',
  PLN: 'PLN',
  RUB: 'RUB',
  PHP: 'PHP',
  THB: 'THB',
  ZAR: 'ZAR',
  AED: 'AED',
  ILS: 'ILS',
};

// Patterns that indicate non-numeric salary
const NON_NUMERIC_PATTERNS = [
  /^competitive/i,
  /^negotiable/i,
  /^doe$/i,
  /^tbd$/i,
  /^n\/a$/i,
  /^market\s*rate/i,
  /^not\s*specified/i,
  /depends\s*on\s*experience/i,
  /based\s*on\s*experience/i,
  /commensurate/i,
];

// Period detection patterns
const PERIOD_PATTERNS = {
  hour: /\/(hr|hour)|per\s*hour|hourly|\bhr\b/i,
  day: /\/day|per\s*day|daily/i,
  week: /\/week|per\s*week|weekly/i,
  month: /\/(mo|month)|per\s*month|monthly/i,
  year: /\/(yr|year)|per\s*year|yearly|annual|p\.?a\.?|\bpa\b/i,
};

/**
 * Main normalization function
 */
function normalizeSalary(salary, rates) {
  if (salary === null || salary === undefined || salary === '') {
    return { salaryUsd: null, confidence: 0 };
  }

  // Handle structured object
  if (typeof salary === 'object') {
    return normalizeObject(salary, rates);
  }

  const str = String(salary).trim();

  // Check for non-numeric patterns
  for (const pattern of NON_NUMERIC_PATTERNS) {
    if (pattern.test(str)) {
      return { salaryUsd: null, confidence: 0 };
    }
  }

  // Detect currency
  const currency = detectCurrency(str);

  // Detect explicit period (hourly, monthly, etc.)
  const explicitPeriod = detectPeriod(str);

  // Extract numbers
  const { min, max } = extractNumbers(str);

  if (min === null && max === null) {
    return { salaryUsd: null, confidence: 0 };
  }

  // Infer period from amount if not explicitly stated
  const avgAmount = min !== null && max !== null ? (min + max) / 2 : min || max;
  const period = inferPeriodFromAmount(avgAmount, explicitPeriod, str);

  // Annualize if needed - but use smart per-number logic for mixed cases
  // Large numbers (>= 15000) are likely already annual regardless of detected period
  const annualMin = min !== null ? smartAnnualize(min, period) : null;
  const annualMax = max !== null ? smartAnnualize(max, period) : null;

  // Calculate average
  let amount;
  if (annualMin !== null && annualMax !== null) {
    amount = (annualMin + annualMax) / 2;
  } else {
    amount = annualMin || annualMax;
  }

  // Convert to USD
  const rate = rates[currency] || 1;
  const salaryUsd = roundToThousand(amount / rate);
  const salaryMinUsd =
    annualMin !== null ? roundToThousand(annualMin / rate) : null;
  const salaryMaxUsd =
    annualMax !== null ? roundToThousand(annualMax / rate) : null;

  return {
    salaryUsd,
    salaryMin: salaryMinUsd,
    salaryMax: salaryMaxUsd,
    salaryCurrency: currency,
    confidence: 0.8,
  };
}

/**
 * Normalize structured salary object
 */
function normalizeObject(salary, rates) {
  const currency = salary.currency || 'USD';
  const period = salary.period || 'year';

  // Extract values from various possible keys
  let min = salary.min || salary.minimum || salary.low || salary.from;
  let max = salary.max || salary.maximum || salary.high || salary.to;
  const single = salary.amount || salary.value || salary.salary;

  if (single !== undefined && min === undefined && max === undefined) {
    min = single;
    max = single;
  }

  if (min !== undefined) min = Number(min);
  if (max !== undefined) max = Number(max);

  if ((min === undefined || isNaN(min)) && (max === undefined || isNaN(max))) {
    return { salaryUsd: null, confidence: 0 };
  }

  // Annualize
  const annualMin =
    min !== undefined && !isNaN(min) ? annualize(min, period) : null;
  const annualMax =
    max !== undefined && !isNaN(max) ? annualize(max, period) : null;

  // Calculate average
  let amount;
  if (annualMin !== null && annualMax !== null) {
    amount = (annualMin + annualMax) / 2;
  } else {
    amount = annualMin || annualMax;
  }

  // Convert to USD
  const rate = rates[currency] || 1;
  const salaryUsd = roundToThousand(amount / rate);
  const salaryMinUsd =
    annualMin !== null ? roundToThousand(annualMin / rate) : null;
  const salaryMaxUsd =
    annualMax !== null ? roundToThousand(annualMax / rate) : null;

  return {
    salaryUsd,
    salaryMin: salaryMinUsd,
    salaryMax: salaryMaxUsd,
    salaryCurrency: currency,
    confidence: 0.9,
  };
}

/**
 * Detect currency from string
 */
function detectCurrency(str) {
  // Check for explicit currency codes first (most reliable)
  const codeMatch = str.match(
    /\b(USD|EUR|GBP|JPY|INR|AUD|CAD|CHF|SEK|NZD|SGD|HKD|CNY|KRW|MXN|BRL|PLN|RUB|PHP|THB|ZAR|AED|ILS)\b/i
  );
  if (codeMatch) {
    return codeMatch[1].toUpperCase();
  }

  // Check for prefixed $ symbols (US$, A$, AU$, C$, CA$, etc.)
  // IMPORTANT: Check longer prefixes first (CA$ before A$) to avoid false matches
  if (/US\$/i.test(str)) return 'USD';
  if (/CA\$|C\$/i.test(str)) return 'CAD';
  if (/AU\$|A\$/i.test(str)) return 'AUD';
  if (/NZ\$/i.test(str)) return 'NZD';
  if (/HK\$/i.test(str)) return 'HKD';
  if (/S\$/i.test(str)) return 'SGD';

  // Check for prefixed symbols (A$, C$, etc.) - must check before single $
  for (const [symbol, code] of Object.entries(CURRENCY_MAP)) {
    if (symbol.length > 1 && str.includes(symbol)) {
      return code;
    }
  }

  // Check for single character symbols
  if (str.includes('€')) return 'EUR';
  if (str.includes('£')) return 'GBP';
  if (str.includes('₹')) return 'INR';
  if (str.includes('₩')) return 'KRW';
  if (str.includes('₽')) return 'RUB';
  if (str.includes('₱')) return 'PHP';
  if (str.includes('฿')) return 'THB';
  if (str.includes('₪')) return 'ILS';
  if (str.includes('¥')) {
    // Could be JPY or CNY - check for explicit indicator
    if (/CNY|yuan|rmb/i.test(str)) return 'CNY';
    return 'JPY'; // Default to JPY
  }
  if (str.includes('R') && /\bR\s*[\d,]+/.test(str)) return 'ZAR'; // South African Rand

  // Check for LPA (Lakhs Per Annum - Indian)
  if (/\d+\s*LPA/i.test(str)) return 'INR';

  // Default to USD if $ or no currency
  if (str.includes('$')) return 'USD';

  return 'USD';
}

/**
 * Detect salary period
 */
function detectPeriod(str) {
  for (const [period, pattern] of Object.entries(PERIOD_PATTERNS)) {
    if (pattern.test(str)) {
      return period;
    }
  }
  return 'year';
}

/**
 * Infer period from amount magnitude (for ambiguous cases)
 */
function inferPeriodFromAmount(amount, explicitPeriod, originalStr) {
  // If period was explicitly detected from text, always use it
  if (explicitPeriod !== 'year') {
    return explicitPeriod;
  }

  // Check if original string had period indicators (double check)
  if (originalStr && PERIOD_PATTERNS.hour.test(originalStr)) {
    return 'hour';
  }
  if (originalStr && PERIOD_PATTERNS.month.test(originalStr)) {
    return 'month';
  }
  if (originalStr && PERIOD_PATTERNS.week.test(originalStr)) {
    return 'week';
  }
  if (originalStr && PERIOD_PATTERNS.day.test(originalStr)) {
    return 'day';
  }

  // Heuristic: if number is very small and no explicit period, likely hourly
  if (amount < 500) {
    return 'hour';
  }

  // If between 500 and 15000 and no explicit period, could be monthly
  // But only if it doesn't look like a K notation was used
  if (amount >= 500 && amount < 15000) {
    return 'month';
  }

  return 'year';
}

/**
 * Extract numbers from salary string
 */
function extractNumbers(str) {
  // Clean the string - remove currency symbols, words like "base", "salary", etc.
  let cleaned = str
    .replace(/[€£¥₹₩₽₱฿₪]/g, '')
    .replace(
      /\b(USD|EUR|GBP|JPY|INR|AUD|CAD|CHF|SEK|NZD|SGD|HKD|CNY|KRW|MXN|BRL|PLN|RUB|PHP|THB|ZAR|AED|ILS)\b/gi,
      ''
    )
    .replace(/(US|AU|CA|NZ|HK|SG?)\$/gi, '') // Remove prefixed $ symbols
    .replace(/\b(base|salary|total|comp|tc|ote|cash)\b:?/gi, '')
    .replace(
      /\b(around|about|approximately|approx|up\s*to|starting\s*at|from|between|and|minimum|min|maximum|max|plus)\b/gi,
      ' '
    )
    .replace(/[~≈]/g, '')
    .trim();

  // Remove equity/stock/bonus/percentage parts (keep only base/cash)
  // Pattern 1: Remove "+ $50k equity" or ", $50k stock" (explicit additional equity compensation)
  cleaned = cleaned.replace(
    /[+,]\s*\$?\s*[\d,.]+[kK]?\s*(equity|stock|options|rsus?)\b/gi,
    ''
  );
  // Pattern 2: Remove "$50k+ equity" (number immediately followed by +, then equity - no text between)
  cleaned = cleaned.replace(
    /\$?\s*[\d,.]+[kK]?\+\s*(equity|stock|options|rsus?)\b/gi,
    ''
  );
  // Pattern 3: Remove standalone equity/stock mentions like "+ equity", ", stock options", "+ benefits"
  cleaned = cleaned.replace(
    /[+,]\s*(equity|stock|options|rsus?|benefits?|bonus)\b[^,]*/gi,
    ''
  );
  // Pattern 4: Remove percentage mentions like "20% bonus"
  cleaned = cleaned.replace(/\d+\s*%[^,]*/gi, '');
  // Now remove remaining + signs (after equity patterns processed)
  cleaned = cleaned.replace(/\+/g, '');

  // Handle Indian Lakh notation (L, LPA, Lakhs)
  // LPA = Lakhs Per Annum, L = Lakhs

  // Handle "X-Y LPA" range notation
  const lpaRangeMatch = cleaned.match(
    /(\d+(?:\.\d+)?)\s*[-–—]\s*(\d+(?:\.\d+)?)\s*LPA/i
  );
  if (lpaRangeMatch) {
    const min = parseFloat(lpaRangeMatch[1]) * 100000;
    const max = parseFloat(lpaRangeMatch[2]) * 100000;
    return { min, max };
  }

  // Handle single LPA
  const lpaMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*LPA/i);
  if (lpaMatch) {
    const lakhs = parseFloat(lpaMatch[1]);
    const amount = lakhs * 100000; // Convert lakhs to actual number
    return { min: amount, max: amount };
  }

  // Handle "XL-YL" or "X-YL" or "X L - Y Lakhs" notation (ranges)
  // Pattern 1: Both have L suffix (₹19L-30L)
  const lakhRangeBothMatch = cleaned.match(
    /(\d+(?:\.\d+)?)\s*(?:L|Lakhs?)\s*[-–—]\s*(\d+(?:\.\d+)?)\s*(?:L|Lakhs?)\b/i
  );
  if (lakhRangeBothMatch) {
    const min = parseFloat(lakhRangeBothMatch[1]) * 100000;
    const max = parseFloat(lakhRangeBothMatch[2]) * 100000;
    return { min, max };
  }

  // Pattern 2: Only second has L suffix (35-80L)
  const lakhRangeMatch = cleaned.match(
    /(\d+(?:\.\d+)?)\s*[-–—]\s*(\d+(?:\.\d+)?)\s*(?:L|Lakhs?)\b/i
  );
  if (lakhRangeMatch) {
    const min = parseFloat(lakhRangeMatch[1]) * 100000;
    const max = parseFloat(lakhRangeMatch[2]) * 100000;
    return { min, max };
  }

  // Handle single "XL" notation
  const lakhSingleMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*(?:L|Lakhs?)\b/i);
  if (lakhSingleMatch) {
    const amount = parseFloat(lakhSingleMatch[1]) * 100000;
    return { min: amount, max: amount };
  }

  // Handle shorthand ranges like "80-120k", "$100-150k", "100-150K"
  // Where K is only at the end but applies to both numbers
  const shorthandRange = cleaned.match(
    /\$?\s*(\d+(?:\.\d+)?)\s*[-–—]\s*\$?\s*(\d+(?:\.\d+)?)\s*[kK]\b/
  );
  if (shorthandRange) {
    const min = parseFloat(shorthandRange[1]) * 1000;
    const max = parseFloat(shorthandRange[2]) * 1000;
    return { min, max };
  }

  // Handle K notation: 100k, 150K, etc.
  cleaned = cleaned.replace(/(\d+(?:\.\d+)?)\s*[kK]\b/g, (_, num) =>
    String(parseFloat(num) * 1000)
  );

  // Handle ranges with various separators
  // Patterns: "100,000 - 150,000", "100-150k", "$100 - $150 per hour"
  const rangeMatch = cleaned.match(
    /(\d[\d,.\s']*)\s*[-–—to]+\s*\$?\s*(\d[\d,.\s']*)/i
  );
  if (rangeMatch) {
    const min = parseNumber(rangeMatch[1]);
    const max = parseNumber(rangeMatch[2]);
    if (min !== null && max !== null) {
      return { min, max };
    }
  }

  // Try to find any numbers
  const numbers = [];
  const numPattern = /\$?\s*(\d[\d,.\s']*)/g;
  let match;
  while ((match = numPattern.exec(cleaned)) !== null) {
    const num = parseNumber(match[1]);
    if (num !== null && num > 0) {
      numbers.push(num);
    }
  }

  if (numbers.length === 0) {
    return { min: null, max: null };
  }

  if (numbers.length === 1) {
    return { min: numbers[0], max: numbers[0] };
  }

  // Multiple numbers - assume first two are min/max
  const sorted = numbers.slice(0, 2).sort((a, b) => a - b);
  return { min: sorted[0], max: sorted[1] };
}

/**
 * Parse a number string handling various formats
 */
function parseNumber(str) {
  if (!str) return null;

  // Remove spaces, quotes, and normalize
  let cleaned = str.replace(/[\s']/g, '');

  // Handle European format (period as thousands, comma as decimal)
  // e.g., "100.000,00" or "100.000"
  if (/^\d{1,3}(\.\d{3})+([,]\d{2})?$/.test(cleaned)) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  }
  // Handle US format (comma as thousands, period as decimal)
  // e.g., "100,000.00" or "100,000"
  else {
    cleaned = cleaned.replace(/,/g, '');
  }

  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Annualize salary based on period
 */
function annualize(amount, period) {
  switch (period) {
    case 'hour':
      return amount * 40 * 52; // 40 hours/week, 52 weeks
    case 'day':
      return amount * 5 * 52; // 5 days/week, 52 weeks
    case 'week':
      return amount * 52;
    case 'month':
      return amount * 12;
    case 'year':
    default:
      return amount;
  }
}

/**
 * Smart annualize that handles mixed-unit cases
 * Large numbers (>= 15000) are likely already annual even if period is hourly/daily
 * This handles cases like "$55/hr - $250k base" where 250k shouldn't be multiplied
 */
function smartAnnualize(amount, period) {
  // Thresholds for what's reasonable for each period
  const thresholds = {
    hour: 500, // Max reasonable hourly rate
    day: 2500, // Max reasonable daily rate
    week: 10000, // Max reasonable weekly rate
    month: 50000, // Max reasonable monthly rate
  };

  // If the amount exceeds the reasonable threshold for this period,
  // assume it's already an annual figure
  const threshold = thresholds[period];
  if (threshold && amount >= threshold) {
    return amount; // Already annual
  }

  return annualize(amount, period);
}

/**
 * Round to nearest thousand
 */
function roundToThousand(amount) {
  if (amount === null || isNaN(amount)) return null;
  return Math.round(amount / 1000) * 1000;
}

module.exports = {
  normalizeSalary,
  detectCurrency,
  detectPeriod,
  extractNumbers,
  annualize,
  roundToThousand,
};
