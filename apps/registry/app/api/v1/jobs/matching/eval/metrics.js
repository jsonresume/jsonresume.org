/**
 * Pure ranking-quality metrics for the jobs matcher eval harness.
 *
 * Used by the deterministic CI gates in rankingEval.test.js today; designed
 * so a future nightly LIVE eval (real LLM rerank) can reuse them unchanged.
 * No dependencies, no I/O.
 */

/**
 * Normalized Discounted Cumulative Gain at cutoff k.
 *
 * @param {Array<string|number>} rankedIds - ids in ranked order (best first)
 * @param {Object} relevanceMap - id -> graded relevance (missing ids count 0).
 *   The eval convention: gold-best = 3, ungraded = 1, gold-worst = 0.
 * @param {number} k - cutoff
 * @returns {number} NDCG@k in [0, 1]; 0 when the ideal DCG is 0
 */
export function ndcgAtK(rankedIds, relevanceMap, k) {
  const rel = (id) => relevanceMap[id] ?? 0;
  const dcg = rankedIds
    .slice(0, k)
    .reduce((sum, id, i) => sum + rel(id) / Math.log2(i + 2), 0);
  const idealRels = rankedIds.map(rel).sort((a, b) => b - a);
  const idcg = idealRels
    .slice(0, k)
    .reduce((sum, r, i) => sum + r / Math.log2(i + 2), 0);
  return idcg === 0 ? 0 : dcg / idcg;
}

/**
 * Fraction of goldIds present in the top k of rankedIds.
 *
 * @param {Array<string|number>} rankedIds - ids in ranked order
 * @param {Array<string|number>} goldIds - ids that should be retrieved
 * @param {number} k - cutoff
 * @returns {number} recall@k in [0, 1]; 1 when goldIds is empty (vacuous)
 */
export function recallAtK(rankedIds, goldIds, k) {
  if (goldIds.length === 0) {
    return 1;
  }
  const top = new Set(rankedIds.slice(0, k));
  const hits = goldIds.filter((id) => top.has(id)).length;
  return hits / goldIds.length;
}

/**
 * Count of known-bad ids leaking into the top k of rankedIds.
 *
 * @param {Array<string|number>} rankedIds - ids in ranked order
 * @param {Array<string|number>} worstIds - ids that should never rank high
 * @param {number} k - cutoff
 * @returns {number} integer count in [0, min(k, worstIds.length)]
 */
export function worstLeakage(rankedIds, worstIds, k) {
  const top = new Set(rankedIds.slice(0, k));
  return worstIds.filter((id) => top.has(id)).length;
}
