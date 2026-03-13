import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

export function getSupabase() {
  return createClient(supabaseUrl, process.env.SUPABASE_KEY);
}

export function truncCompany(name) {
  if (!name) return 'Unknown';
  const trimmed = name.split(/\.|,| is | builds | provides | turns /)[0].trim();
  return trimmed.length > 60 ? trimmed.slice(0, 57) + '...' : trimmed;
}

export function parseJobContent(job) {
  try {
    const parsed = JSON.parse(job.gpt_content);
    if (!parsed?.title) return null;
    return {
      id: job.id,
      title: parsed.title,
      company: truncCompany(parsed.company),
      remote: parsed.remote,
      experience: parsed.experience,
      type: parsed.type,
      salary: parsed.salary,
      salary_structured: parsed.salary_structured || null,
      salary_usd: job.salary_usd,
      skills: parsed.skills || [],
      location: parsed.location,
      description: parsed.description,
      visa_sponsorship: parsed.visa_sponsorship || null,
      equity: parsed.equity || null,
      posted_at: job.posted_at,
    };
  } catch {
    return null;
  }
}

export function extractUserSkills(resume) {
  const skills = new Set();
  for (const s of resume.skills || []) {
    if (s.name) skills.add(normalizeSkill(s.name));
    for (const kw of s.keywords || []) skills.add(normalizeSkill(kw));
  }
  return [...skills];
}

/** Common skill aliases → canonical form */
const SKILL_ALIASES = {
  node: 'node.js',
  nodejs: 'node.js',
  'react.js': 'react',
  reactjs: 'react',
  'vue.js': 'vue',
  vuejs: 'vue',
  'angular.js': 'angular',
  angularjs: 'angular',
  postgres: 'postgresql',
  psql: 'postgresql',
  mongo: 'mongodb',
  mongoose: 'mongodb',
  k8s: 'kubernetes',
  tf: 'terraform',
  js: 'javascript',
  es6: 'javascript',
  ts: 'typescript',
  py: 'python',
  python3: 'python',
  go: 'golang',
  cpp: 'c++',
  cplusplus: 'c++',
  csharp: 'c#',
  gcp: 'google cloud',
  'google cloud platform': 'google cloud',
  'amazon web services': 'aws',
  ci: 'ci/cd',
  cd: 'ci/cd',
  cicd: 'ci/cd',
  ml: 'machine learning',
  ai: 'artificial intelligence',
  dl: 'deep learning',
  'graphql api': 'graphql',
  restful: 'rest',
  'rest api': 'rest',
  'rest apis': 'rest',
};

export function normalizeSkill(skill) {
  const lower = skill.toLowerCase().trim();
  return SKILL_ALIASES[lower] || lower;
}

/**
 * Flatten a job's skills array into a deduplicated list of lowercase strings.
 * Extracts both skill.name and skill.keywords to bridge the taxonomy gap
 * between abstract categories ("Backend Development") and specific
 * technologies ("Node.js", "Go") that the GPT parser outputs.
 */
export function flattenJobSkills(job) {
  const out = new Set();
  for (const s of job.skills || []) {
    const name = normalizeSkill((s.name || s).toString());
    if (name) out.add(name);
    for (const kw of s.keywords || []) {
      const k = normalizeSkill(kw.toString());
      if (k) out.add(k);
    }
  }
  return [...out];
}

/**
 * Check if a job skill matches any user skill using fuzzy substring matching.
 * Handles common variations: "postgres" ↔ "postgresql", "ci/cd" ↔ "ci/cd pipelines",
 * "apis" ↔ "rest apis", "react" ↔ "react.js", etc.
 */
export function skillMatches(jobSkill, userSet) {
  if (userSet.has(jobSkill)) return true;
  for (const u of userSet) {
    if (u.includes(jobSkill) || jobSkill.includes(u)) return true;
  }
  return false;
}

export const EMPTY_REPORT = {
  pipeline: {
    totalJobs: 0,
    reviewed: 0,
    interested: 0,
    maybe: 0,
    applied: 0,
    notInterested: 0,
    dossiers: 0,
  },
  salary: { market: null, interested: null, distribution: [] },
  remoteIndex: { market: {}, interested: {} },
  dealBreakers: [],
  skills: { gaps: [], topDemanded: [], userSkills: [] },
  momentum: {
    score: 0,
    label: 'no-data',
    reviewsThisWeek: 0,
    reviewsLastWeek: 0,
  },
  topCompanies: [],
  secondLook: [],
  recentActivity: [],
  antiResume: { skills: [], attributes: [] },
  skillAdjacency: [],
  archetypes: [],
  marketDrift: { trends: [], growing: [], declining: [] },
  readiness: [],
  bestMatchSimilar: [],
};
