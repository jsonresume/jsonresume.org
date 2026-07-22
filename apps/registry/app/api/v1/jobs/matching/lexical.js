/**
 * Lexical query builders for hybrid (vector + full-text) retrieval.
 *
 * The dense embedding dissolves exact terms ("Rust", "Django", company
 * names) into a compressed similarity band; the tsvector arm of
 * match_jobs_v5_hybrid rescues them. Queries use websearch_to_tsquery
 * syntax: OR-joined terms, quoted phrases.
 */

const STOPWORDS = new Set([
  'and',
  'the',
  'for',
  'with',
  'that',
  'this',
  'from',
  'are',
  'was',
  'have',
  'has',
  'had',
  'not',
  'but',
  'all',
  'any',
  'can',
  'will',
  'into',
  'over',
  'more',
  'than',
  'very',
  'such',
  'some',
  'other',
  'about',
  'their',
  'them',
  'they',
  'its',
  'our',
  'your',
  'out',
  'who',
  'what',
  'when',
  'where',
  'how',
  'why',
  'a',
  'an',
  'of',
  'in',
  'on',
  'at',
  'to',
  'is',
  'it',
  'as',
  'by',
  'or',
  'be',
  'looking',
  'developer',
  'engineer',
  'engineering',
  'software',
  'senior',
  'junior',
  'remote',
  'role',
  'roles',
  'job',
  'jobs',
  'work',
  'working',
  'team',
  'company',
  'experience',
  'years',
]);

const MAX_TERMS = 25;

const sanitize = (term) =>
  String(term)
    .trim()
    .replace(/["'()|&!:*<>]/g, '')
    .trim();

const formatTerm = (term) => {
  const t = sanitize(term);
  if (!t) return null;
  return /\s/.test(t) ? `"${t}"` : t;
};

/**
 * Build an OR-joined lexical query from a resume's skills (names +
 * keywords). Generic filler is dropped; multi-word skills are quoted.
 * Returns '' when there is nothing distinctive to search for.
 */
export function buildLexicalQuery(resume) {
  const terms = [];
  const seen = new Set();

  for (const skill of resume?.skills || []) {
    for (const raw of [skill?.name, ...(skill?.keywords || [])]) {
      if (!raw) continue;
      const key = String(raw).toLowerCase().trim();
      if (!key || seen.has(key) || STOPWORDS.has(key)) continue;
      seen.add(key);
      const formatted = formatTerm(raw);
      if (formatted) terms.push(formatted);
      if (terms.length >= MAX_TERMS) break;
    }
    if (terms.length >= MAX_TERMS) break;
  }

  return terms.join(' OR ');
}

/**
 * Turn a free-text search prompt into an OR-joined lexical query
 * (websearch_to_tsquery ANDs plain words, which is far too strict for a
 * descriptive prompt like "remote founding engineer TypeScript Node").
 */
export function promptToLexicalQuery(prompt) {
  const words = String(prompt || '')
    .toLowerCase()
    .split(/[^a-z0-9.+#-]+/)
    .map(sanitize)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
  return [...new Set(words)].slice(0, 12).join(' OR ');
}
