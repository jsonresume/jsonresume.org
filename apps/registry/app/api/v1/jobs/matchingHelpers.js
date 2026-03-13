import { createClient } from '@supabase/supabase-js';
import { embed, generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { logger } from '@/lib/logger';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const RERANK_BATCH_SIZE = 5;

export function getSupabase() {
  return createClient(supabaseUrl, process.env.SUPABASE_KEY);
}

/** Normalize a vector to unit length */
export function normalize(vec) {
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  if (norm === 0) return vec;
  return vec.map((v) => v / norm);
}

/** Weighted interpolation of two vectors, normalized */
export function interpolate(vecA, vecB, alpha) {
  const blended = vecA.map((v, i) => alpha * v + (1 - alpha) * vecB[i]);
  return normalize(blended);
}

/** Subtract a direction from a vector (for negative feedback) */
export function subtractDirection(vec, negVec, weight = 0.15) {
  const adjusted = vec.map((v, i) => v - weight * negVec[i]);
  return normalize(adjusted);
}

/**
 * Apply time-decay boost: more recent jobs get a recency bonus.
 * Uses exponential decay with half-life of 14 days.
 */
export function timeDecayScore(similarity, postedAt) {
  if (!postedAt) return similarity;
  const ageMs = Date.now() - new Date(postedAt).getTime();
  const ageDays = ageMs / 86400000;
  const halfLife = 14;
  const recencyBoost = Math.pow(0.5, ageDays / halfLife);
  return 0.85 * similarity + 0.15 * recencyBoost;
}

/** Generate a HyDE embedding from resume text */
export async function generateHydeEmbedding(resumeText) {
  const { text: hydePosting } = await generateText({
    model: openai('gpt-4.1-mini'),
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

  return interpolate(hydeResult.embedding, resumeResult.embedding, 0.35);
}

/** Compute average embedding from a list of embeddings */
export function averageEmbeddings(embeddings) {
  if (!embeddings.length) return null;
  const dim = embeddings[0].length;
  const avg = new Array(dim).fill(0);
  for (const emb of embeddings) {
    for (let i = 0; i < dim; i++) avg[i] += emb[i];
  }
  for (let i = 0; i < dim; i++) avg[i] /= embeddings.length;
  return normalize(avg);
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
  ]
    .filter(Boolean)
    .join('\n');

  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-large'),
    value: text,
  });
  return { embedding, text };
}

/** LLM reranking: score each job 1-10 against the search context. */
export async function rerankJobs(jobs, resumeText, searchPrompt) {
  const context = searchPrompt
    ? `The candidate is specifically looking for: ${searchPrompt}\n\nTheir background:\n${resumeText}`
    : `Candidate background:\n${resumeText}`;

  const batches = [];
  for (let i = 0; i < jobs.length; i += RERANK_BATCH_SIZE) {
    batches.push(jobs.slice(i, i + RERANK_BATCH_SIZE));
  }

  const allScores = [];
  for (const batch of batches) {
    const promises = batch.map(async (job) => {
      const jobText = [
        `Title: ${job.title}`,
        `Company: ${job.company}`,
        job.location ? `Location: ${job.location}` : null,
        job.remote ? `Remote: ${job.remote}` : null,
        job.salary ? `Salary: ${job.salary}` : null,
        job.experience ? `Experience: ${job.experience}` : null,
        job.description
          ? `Description: ${job.description.slice(0, 500)}`
          : null,
        job.skills?.length
          ? `Skills: ${job.skills.map((s) => s.name || s).join(', ')}`
          : null,
      ]
        .filter(Boolean)
        .join('\n');

      try {
        const { text } = await generateText({
          model: openai('gpt-4.1-mini'),
          system: `You are a job matching scorer. Given a candidate profile and a job posting, rate the match quality from 1-10. Consider: skill alignment, experience level, location/remote fit, salary expectations, industry match, and the candidate's stated preferences. Output ONLY a JSON object: {"score": N, "reason": "one sentence"}. Be strict — only 8+ for strong matches.`,
          prompt: `${context}\n\nJob posting:\n${jobText}`,
          maxTokens: 80,
        });
        const parsed = JSON.parse(text);
        return {
          id: job.id,
          rerank_score: Math.min(10, Math.max(1, parsed.score || 5)),
        };
      } catch {
        return { id: job.id, rerank_score: 5 };
      }
    });
    const results = await Promise.all(promises);
    allScores.push(...results);
  }

  return allScores;
}

/** Fetch, parse, filter, and optionally rerank job matches. */
export async function matchJobs({
  embedding,
  resumeText,
  searchPrompt,
  top,
  days,
  remote,
  minSalary,
  search,
  shouldRerank,
  stateMap,
}) {
  const supabase = getSupabase();
  const createdAfter = new Date(
    Date.now() - days * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: matched, error } = await supabase.rpc('match_jobs_v5', {
    query_embedding: embedding,
    match_threshold: -1,
    match_count: top * 5,
    created_after: createdAfter,
  });

  if (error) throw new Error(error.message);

  const jobIds = (matched || []).map((m) => m.id);
  if (jobIds.length === 0) return [];

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, uuid, gpt_content, posted_at, url, salary_usd')
    .in('id', jobIds);

  const HIDDEN_STATES = new Set(['not_interested', 'dismissed']);

  let results = (jobs || [])
    .map((job) => {
      try {
        const parsed = JSON.parse(job.gpt_content);
        if (!parsed?.title || !parsed?.company) return null;
        const similarity =
          matched.find((m) => m.id === job.id)?.similarity || 0;
        return {
          id: job.id,
          uuid: job.uuid,
          title: parsed.title,
          company: parsed.company,
          location: parsed.location,
          remote: parsed.remote,
          salary: parsed.salary,
          salary_usd: job.salary_usd,
          experience: parsed.experience,
          type: parsed.type,
          description: parsed.description,
          skills: parsed.skills,
          url: job.url,
          posted_at: job.posted_at,
          similarity: Math.round(similarity * 1000) / 1000,
          decayed_similarity:
            Math.round(timeDecayScore(similarity, job.posted_at) * 1000) / 1000,
          state: stateMap?.[job.id] || null,
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .filter((j) => {
      if (stateMap && HIDDEN_STATES.has(j.state)) return false;
      if (remote && j.remote !== 'Full') return false;
      if (minSalary && j.salary_usd && j.salary_usd < minSalary * 1000)
        return false;
      if (
        search &&
        !JSON.stringify(j).toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => b.decayed_similarity - a.decayed_similarity);

  // Always rerank top 30 for better quality
  const shouldActuallyRerank =
    results.length > 0 && (shouldRerank || results.length >= 5);
  if (shouldActuallyRerank) {
    const toRerank = results.slice(0, Math.min(30, top * 2));
    const rest = results.slice(Math.min(30, top * 2));

    try {
      const scores = await rerankJobs(toRerank, resumeText, searchPrompt);
      const scoreMap = {};
      scores.forEach((s) => {
        scoreMap[s.id] = s.rerank_score;
      });

      const maxSim = Math.max(
        ...toRerank.map((j) => j.decayed_similarity),
        0.001
      );
      const reranked = toRerank
        .map((j) => ({
          ...j,
          rerank_score: scoreMap[j.id] || 5,
          combined_score:
            0.35 * (j.decayed_similarity / maxSim) +
            0.65 * ((scoreMap[j.id] || 5) / 10),
        }))
        .sort((a, b) => b.combined_score - a.combined_score);

      results = [...reranked, ...rest];
    } catch (err) {
      logger.error(
        { error: err.message },
        'Reranking failed, using vector order'
      );
    }
  }

  return results.slice(0, top);
}
