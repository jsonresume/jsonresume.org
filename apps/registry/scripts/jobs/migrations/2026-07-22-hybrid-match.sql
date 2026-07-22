-- Hybrid retrieval for the jobs matcher: dense vector + full-text, fused
-- with Reciprocal Rank Fusion (k=60). Companion to match_jobs_v5.
--
-- Why: resume-vs-job cosine similarity clusters in a compressed ~0.37-0.44
-- band, so exact terms ("Rust", "Django", company names) dissolve into the
-- dense soup. RRF is rank-based, which sidesteps the band-compression
-- problem entirely. See docs/jobs-ranking/ROADMAP.md (NOW items).
--
-- Applied to prod via the Supabase Management API on 2026-07-22.
-- Rollback: DROP FUNCTION match_jobs_v5_hybrid; DROP INDEX jobs_content_fts_idx;

CREATE INDEX IF NOT EXISTS jobs_content_fts_idx
  ON jobs USING gin (to_tsvector('english', coalesce(content, '')));

CREATE OR REPLACE FUNCTION public.match_jobs_v5_hybrid(
  query_embedding vector,
  query_text text,
  match_count integer,
  created_after timestamp without time zone
)
RETURNS TABLE(id bigint, similarity double precision, rrf_score double precision)
LANGUAGE sql
STABLE
AS $function$
  WITH vec AS (
    SELECT jobs.id,
           1 - (jobs.embedding_v5 <=> query_embedding) AS similarity,
           row_number() OVER (ORDER BY jobs.embedding_v5 <=> query_embedding ASC) AS vrank
    FROM jobs
    WHERE jobs.embedding_v5 IS NOT NULL
      AND jobs.created_at > created_after
    ORDER BY jobs.embedding_v5 <=> query_embedding ASC
    LIMIT match_count
  ),
  fts AS (
    SELECT jobs.id,
           row_number() OVER (
             ORDER BY ts_rank_cd(
               to_tsvector('english', coalesce(jobs.content, '')),
               websearch_to_tsquery('english', query_text)
             ) DESC
           ) AS trank
    FROM jobs
    WHERE jobs.created_at > created_after
      AND query_text <> ''
      AND to_tsvector('english', coalesce(jobs.content, ''))
          @@ websearch_to_tsquery('english', query_text)
    LIMIT match_count
  )
  SELECT COALESCE(vec.id, fts.id) AS id,
         COALESCE(vec.similarity, 0) AS similarity,
         COALESCE(1.0 / (60 + vec.vrank), 0) +
         COALESCE(1.0 / (60 + fts.trank), 0) AS rrf_score
  FROM vec
  FULL OUTER JOIN fts ON vec.id = fts.id
  ORDER BY rrf_score DESC
  LIMIT match_count;
$function$;
