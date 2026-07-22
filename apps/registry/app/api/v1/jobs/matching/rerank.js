/**
 * LLM reranking for job matches.
 *
 * One LISTWISE call scores the whole candidate window 0-100 (2026-07 eval:
 * per-job integer 1-10 scoring produced huge tie-bands that recency then
 * broke arbitrarily, cost ~30 LLM calls per request, and silently scored
 * parse failures as 5). The scorer now also sees the candidate's location so
 * geo-impossible roles can't crack the top of a remote-only candidate's list.
 */
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { logger } from '@/lib/logger';

/** Compact one-job block for the listwise prompt. */
const jobBlock = (job) => {
  const skills = (job.skills || [])
    .map((s) => s?.name || s)
    .filter(Boolean)
    .slice(0, 12)
    .join(', ');
  return [
    `[${job.id}] ${job.title} @ ${job.company}`,
    `  location: ${job.location || 'unspecified'} | remote: ${
      job.remote || 'unspecified'
    } | salary: ${job.salary || 'unspecified'} | experience: ${
      job.experience || 'unspecified'
    }`,
    skills ? `  skills: ${skills}` : null,
    job.description ? `  ${String(job.description).slice(0, 350)}` : null,
  ]
    .filter(Boolean)
    .join('\n');
};

/** Extract the first JSON array from a model reply (tolerates code fences). */
const parseScores = (text) => {
  const cleaned = text.replace(/```(?:json)?/g, '').trim();
  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');
  if (start === -1 || end <= start) {
    throw new Error('no JSON array in rerank reply');
  }
  return JSON.parse(cleaned.slice(start, end + 1));
};

// Jobs per listwise call. The calibrated 0-100 rubric keeps scores
// comparable across chunks, so chunks can run in parallel and merge.
const CHUNK_SIZE = 50;

const scoreChunk = async (jobs, context, locationLine) => {
  const { text } = await generateText({
    model: openai('gpt-4.1-mini'),
    temperature: 0,
    system: `You are a job-match scorer. Score EVERY job posting 0-100 for this candidate.
Calibration: 85+ exceptional fit (skills, seniority, location all align); 60-84 strong; 40-59 plausible; 20-39 weak; <20 mismatch.
Hard rules:
- If the candidate's location makes the role impossible (onsite/hybrid elsewhere, geo-fenced remote excluding them, timezone-incompatible), score it 25 or lower no matter how good the skill fit.
- Seniority mismatches (junior/entry roles for a senior candidate), per-task gig pay, or salary far below the candidate's level cap at 35.
- Use the full 0-100 range; avoid ties — differentiate adjacent jobs.
Output ONLY a JSON array: [{"id": <job id>, "score": <0-100>}, ...] with one entry per job, no prose.`,
    prompt: `${context}\n${locationLine}\n\nJob postings:\n\n${jobs
      .map(jobBlock)
      .join('\n\n')}`,
    maxTokens: 1800,
  });

  const parsed = parseScores(text);
  const byId = new Map(jobs.map((j) => [Number(j.id), j]));
  const scores = [];
  for (const row of parsed) {
    const id = Number(row?.id);
    if (!byId.has(id) || typeof row?.score !== 'number') {
      continue;
    }
    scores.push({
      id,
      rerank_score: Math.min(100, Math.max(0, Math.round(row.score))),
    });
  }
  return scores;
};

/**
 * Score jobs 0-100 against the candidate via parallel listwise calls over
 * CHUNK_SIZE-job chunks (the vector ordering is too compressed to trust a
 * shallow window — gold-set jobs sat at vector ranks 17-147 in the 2026-07
 * eval, so callers pass a deep window and this fans out cheap chunk calls).
 * @returns {Array<{id: number, rerank_score: number}>} scores on a 0-100
 *   scale; jobs the model omitted are simply absent (caller decides fallback).
 */
export async function rerankJobs(jobs, resumeText, searchPrompt, candidate) {
  const context = searchPrompt
    ? `The candidate is specifically looking for: ${searchPrompt}\n\nTheir background:\n${resumeText}`
    : `Candidate background:\n${resumeText}`;

  const locationLine = candidate?.location
    ? `The candidate is based in: ${candidate.location}.${
        candidate.remoteOnly
          ? ' They can ONLY take fully-remote roles workable from that location/timezone.'
          : ''
      }`
    : '';

  const chunks = [];
  for (let i = 0; i < jobs.length; i += CHUNK_SIZE) {
    chunks.push(jobs.slice(i, i + CHUNK_SIZE));
  }

  const settled = await Promise.allSettled(
    chunks.map((chunk) => scoreChunk(chunk, context, locationLine))
  );

  const scores = [];
  settled.forEach((res, i) => {
    if (res.status === 'fulfilled') {
      scores.push(...res.value);
    } else {
      logger.warn(
        { chunk: i, error: res.reason?.message },
        'Rerank chunk failed'
      );
    }
  });

  if (scores.length === 0) {
    throw new Error('all rerank chunks failed');
  }
  if (scores.length < jobs.length) {
    logger.warn(
      { expected: jobs.length, scored: scores.length },
      'Listwise rerank returned partial scores'
    );
  }

  return scores;
}
