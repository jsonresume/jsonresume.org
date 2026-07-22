/**
 * Embedding generation for the jobs matcher — resume embeddings and HyDE
 * (hypothetical document embeddings) blended toward the ideal job posting.
 *
 * Determinism: embeddings used to be regenerated per request with a
 * temperature-1 HyDE doc, producing ±0.015 similarity jitter that reordered
 * near-ties in the compressed score band and shifted the candidate-pool
 * boundary between runs (2026-07 eval). HyDE now runs at temperature 0 and
 * both resume and HyDE embeddings are memoized per warm lambda.
 */
import crypto from 'node:crypto';
import { embed, generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { interpolate } from './vectorMath';

// Simple FIFO memo caches (per warm serverless instance).
const CACHE_MAX = 200;
const resumeCache = new Map();
const hydeCache = new Map();

const hashKey = (text) => crypto.createHash('sha256').update(text).digest('hex');

const cacheGet = (cache, key) => cache.get(key);
const cacheSet = (cache, key, value) => {
  if (cache.size >= CACHE_MAX) {
    cache.delete(cache.keys().next().value);
  }
  cache.set(key, value);
};

/** Generate a HyDE embedding from resume text */
export async function generateHydeEmbedding(resumeText) {
  const key = hashKey(resumeText);
  const cached = cacheGet(hydeCache, key);
  if (cached) {
    return cached;
  }

  const { text: hydePosting } = await generateText({
    model: openai('gpt-4.1-mini'),
    temperature: 0,
    system: `You are a job posting generator. Given a candidate's background, write a realistic job posting that would be their IDEAL next role. Write it like a real HN "Who is Hiring" post. Include: company type, role title, tech stack, requirements, location, salary range, remote policy. Output ONLY the job posting text. Make it specific and keyword-rich.`,
    prompt: `Candidate background:\n${resumeText}`,
    maxTokens: 400,
  });

  const [resumeResult, hydeResult] = await Promise.all([
    embed({
      model: openai.embedding('text-embedding-3-large'),
      value: resumeText,
    }),
    embed({
      model: openai.embedding('text-embedding-3-large'),
      value: hydePosting,
    }),
  ]);

  const blended = interpolate(hydeResult.embedding, resumeResult.embedding, 0.35);
  cacheSet(hydeCache, key, blended);
  return blended;
}

export async function getResumeEmbedding(resume) {
  const text = [
    resume.basics?.label,
    resume.basics?.summary,
    ...(resume.skills || []).map(
      (s) => `${s.name}: ${(s.keywords || []).join(', ')}`
    ),
    ...(resume.work || []).map(
      (w) => `${w.position} at ${w.name}: ${w.summary || ''}`
    ),
    ...(resume.education || []).map((e) =>
      `${e.studyType || ''} ${e.area || ''} at ${e.institution || ''}`.trim()
    ),
    ...(resume.projects || []).map(
      (p) =>
        `${p.name || ''}: ${p.description || ''} ${(p.highlights || []).join(
          ', '
        )}`
    ),
    ...(resume.certificates || []).map((c) => c.name || ''),
    ...(resume.languages || []).map((l) => `${l.language}: ${l.fluency || ''}`),
  ]
    .filter(Boolean)
    .join('\n');

  const key = hashKey(text);
  const cached = cacheGet(resumeCache, key);
  if (cached) {
    return { embedding: cached, text };
  }

  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-large'),
    value: text,
  });
  cacheSet(resumeCache, key, embedding);
  return { embedding, text };
}
