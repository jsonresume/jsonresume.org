/**
 * Job matching helpers.
 *
 * Barrel re-export: the implementation lives in ./matching/* to keep each
 * module focused and under the 200-line file policy.
 *   - supabaseClient: shared Supabase client
 *   - vectorMath:     pure vector/scoring math
 *   - embeddings:     resume + HyDE embedding generation
 *   - rerank:         LLM reranking
 *   - matchJobs:      fetch/parse/filter/rerank orchestrator
 */
export { getSupabase } from './matching/supabaseClient';
export {
  normalize,
  interpolate,
  subtractDirection,
  averageEmbeddings,
  timeDecayScore,
} from './matching/vectorMath';
export {
  generateHydeEmbedding,
  getResumeEmbedding,
} from './matching/embeddings';
export { rerankJobs } from './matching/rerank';
export { matchJobs } from './matching/matchJobs';
