/**
 * Job matching orchestrator — fetch candidates from the vector RPC, parse,
 * filter, decay-score, and optionally LLM-rerank into the final result set.
 *
 * Every result carries a unified `score` field holding the value the list is
 * actually ordered by (decayed similarity, or the rerank blend when
 * reranking) — clients must display `score`, not raw `similarity` (the
 * 2026-07 eval found the CLI/TUI showing raw similarity against a
 * decay-ordered list, which looks shuffled).
 */
import { logger } from '@/lib/logger';
import { getSupabase } from './supabaseClient';
import { timeDecayScore } from './vectorMath';
import { rerankJobs } from './rerank';
import { buildJobFilter } from './filters';

// Candidate pool floor. The RPC cut happens on RAW similarity before decay,
// filters, and rerank get a say; a pool of top*5 starved every downstream
// stage (8 of 12 gold-set jobs never surfaced in the eval). With a corpus of
// only hundreds of jobs per 90 days, fetching wide is nearly free.
const MIN_POOL = 300;

/** Fetch, parse, filter, and optionally rerank job matches. */
export async function matchJobs({
  embedding,
  resumeText,
  searchPrompt,
  lexicalQuery = '',
  top,
  days,
  remote,
  minSalary,
  includeUnknownSalary,
  search,
  shouldRerank,
  stateMap,
  candidate,
}) {
  const supabase = getSupabase();
  const createdAfter = new Date(
    Date.now() - days * 24 * 60 * 60 * 1000
  ).toISOString();
  const matchCount = Math.max(MIN_POOL, top * 5);

  // Hybrid retrieval (vector + tsvector fused with RRF) when a lexical
  // query is available — exact terms like "Rust" or a company name get a
  // rank-based second chance instead of dissolving into the compressed
  // dense-similarity band. Falls back to pure vector search otherwise.
  const { data: matched, error } = lexicalQuery
    ? await supabase.rpc('match_jobs_v5_hybrid', {
        query_embedding: embedding,
        query_text: lexicalQuery,
        match_count: matchCount,
        created_after: createdAfter,
      })
    : await supabase.rpc('match_jobs_v5', {
        query_embedding: embedding,
        match_threshold: -1,
        match_count: matchCount,
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

  const rowFilter = buildJobFilter({
    stateMap,
    remote,
    minSalary,
    includeUnknownSalary,
    search,
  });

  let results = (jobs || [])
    .map((job) => {
      try {
        const parsed = JSON.parse(job.gpt_content);
        if (!parsed?.title || !parsed?.company) {
          return null;
        }
        const match = matched.find((m) => m.id === job.id);
        const similarity = Number(match?.similarity) || 0;
        const rrf = Number(match?.rrf_score) || 0;
        const decayed =
          Math.round(timeDecayScore(similarity, job.posted_at) * 1000) / 1000;
        return {
          rrf_score: rrf,
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
          decayed_similarity: decayed,
          score: decayed,
          state: stateMap?.[job.id] || null,
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .filter(rowFilter)
    .sort((a, b) => b.decayed_similarity - a.decayed_similarity);

  // Rerank when explicitly requested or for search profiles.
  // The window is deliberately MUCH deeper than `top`: the raw vector
  // ordering is weakly discriminative (compressed ~0.37-0.44 band) and the
  // 2026-07 eval found gold-set jobs at vector ranks 17-147. rerankJobs fans
  // the window out over parallel ~50-job listwise calls (~3 cheap calls).
  if (shouldRerank && results.length > 0) {
    const windowSize = Math.min(150, results.length);
    // Window SELECTION prefers the RRF fusion order when hybrid retrieval
    // ran (lexical hits deserve a shot at the reranker even with weak
    // vector similarity); the final order still comes from the rerank blend.
    const hasRrf = results.some((j) => j.rrf_score > 0);
    const windowOrder = hasRrf
      ? [...results].sort((a, b) => b.rrf_score - a.rrf_score)
      : results;
    const windowIds = new Set(
      windowOrder.slice(0, windowSize).map((j) => j.id)
    );
    const toRerank = results.filter((j) => windowIds.has(j.id));
    const rest = results.filter((j) => !windowIds.has(j.id));

    try {
      const scores = await rerankJobs(
        toRerank,
        resumeText,
        searchPrompt,
        candidate
      );
      const scoreMap = {};
      scores.forEach((s) => {
        scoreMap[s.id] = s;
      });

      const maxSim = Math.max(
        ...toRerank.map((j) => j.decayed_similarity),
        0.001
      );
      // Tier bands derived from the calibrated 0-100 LLM score — this is
      // what clients present instead of raw cosine numbers.
      const tierFor = (llm) =>
        llm == null
          ? null
          : llm >= 80
          ? 'strong'
          : llm >= 60
          ? 'good'
          : llm >= 40
          ? 'stretch'
          : null;
      // Jobs the model omitted get a neutral 50 — visible in the payload as
      // rerank_score: null rather than a fabricated score.
      const reranked = toRerank
        .map((j) => {
          const s = scoreMap[j.id];
          const llm = s?.rerank_score;
          const combined =
            0.35 * (j.decayed_similarity / maxSim) + 0.65 * ((llm ?? 50) / 100);
          return {
            ...j,
            rerank_score: llm ?? null,
            tier: tierFor(llm),
            reason: s?.reason || null,
            combined_score: Math.round(combined * 1000) / 1000,
            score: Math.round(combined * 1000) / 1000,
          };
        })
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
