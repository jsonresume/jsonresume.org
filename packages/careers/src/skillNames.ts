/** Names one skill goes by, folded to one key. */
const ALIASES: Record<string, string> = {
  postgres: 'postgresql',
  pg: 'postgresql',
  psql: 'postgresql',
  k8s: 'kubernetes',
  js: 'javascript',
  ts: 'typescript',
  node: 'node.js',
  nodejs: 'node.js',
  'react.js': 'react',
  reactjs: 'react',
  'next.js': 'nextjs',
  next: 'nextjs',
  golang: 'go',
  'vue.js': 'vue',
  vuejs: 'vue',
  gcp: 'google cloud platform',
  'google cloud': 'google cloud platform',
  aws: 'amazon web services',
  llm: 'llms',
  'large language models': 'llms',
  'ai/llms': 'llms',
  'machine learning': 'ml',
  'c++': 'cpp',
  'c#': 'csharp',
  'ci/cd': 'ci-cd',
  rails: 'ruby on rails',
  ror: 'ruby on rails',
  tf: 'terraform',
  mongo: 'mongodb',
};

/** Kinds of work, not skills: posts and resumes use them as both. */
const CATEGORIES = new Set([
  'apis',
  'api',
  'backend',
  'back-end',
  'back end',
  'frontend',
  'front-end',
  'front end',
  'full-stack',
  'fullstack',
  'full stack',
  'devops',
  'ai',
  'infrastructure',
  'databases',
  'database',
  'web',
  'mobile',
  'cloud',
  'product',
  'design',
  'engineering',
  'software engineering',
  'software development',
  'programming',
  'other',
  'tools',
]);

/** A skill's key: lower-case, spaces folded, aliases joined. */
export const skillKey = (name: string): string => {
  const key = name
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return ALIASES[key] ?? key;
};

/** Whether a key names a skill, not a kind of work ("Backend", "APIs"). */
export const isSkillKey = (key: string) =>
  key.length > 0 && key.length <= 60 && !CATEGORIES.has(key);

/** The dimensions kept for matching skills by meaning: the start of a text-embedding-3 vector, renormalized. */
export const SKILL_DIMENSIONS = 256;

/** The first SKILL_DIMENSIONS of a vector, scaled to length 1. */
export const shorten = (v: Float32Array): Float32Array => {
  const out = v.slice(0, SKILL_DIMENSIONS);
  let sum = 0;
  for (const x of out) sum += x * x;
  const norm = Math.sqrt(sum) || 1;
  return out.map((x) => x / norm);
};

export const cosine = (a: Float32Array, b: Float32Array): number => {
  let sum = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++)
    sum += (a[i] ?? 0) * (b[i] ?? 0);
  return sum;
};

/** As stored in Postgres: little-endian float32s in a bytea. */
export const toBytes = (v: Float32Array): Uint8Array =>
  new Uint8Array(v.buffer, v.byteOffset, v.byteLength);

export const fromBytes = (bytes: Uint8Array): Float32Array => {
  // Copied: a Buffer from the pool may not be 4-byte aligned.
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Float32Array(copy.buffer);
};
