/**
 * Job matching orchestrator — fetch candidates from the vector RPC, parse,
 * filter, decay-score, and optionally LLM-rerank into the final result set.
 */
import { logger } from '@/lib/logger';
import { getSupabase } from './supabaseClient';
import { timeDecayScore } from './vectorMath';
import { rerankJobs } from './rerank';

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

  if (error) {
    throw new Error(error.message);
  }

  const jobIds = (matched || []).map((m) => m.id);
  if (jobIds.length === 0) {
    return [];
  }

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, uuid, gpt_content, posted_at, url, salary_usd')
    .in('id', jobIds);

  const HIDDEN_STATES = new Set(['not_interested', 'dismissed']);

  let results = (jobs || [])
    .map((job) => {
      try {
        const parsed = JSON.parse(job.gpt_content);
        if (!parsed?.title || !parsed?.company) {
          return null;
        }
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
          qualifications: parsed.qualifications,
          responsibilities: parsed.responsibilities,
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
      if (stateMap && HIDDEN_STATES.has(j.state)) {
        return false;
      }
      if (remote && j.remote !== 'Full') {
        return false;
      }
      if (minSalary && j.salary_usd && j.salary_usd < minSalary * 1000) {
        return false;
      }
      if (
        search &&
        !JSON.stringify(j).toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => b.decayed_similarity - a.decayed_similarity);

  // Rerank when explicitly requested or for search profiles
  if (shouldRerank && results.length > 0) {
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
