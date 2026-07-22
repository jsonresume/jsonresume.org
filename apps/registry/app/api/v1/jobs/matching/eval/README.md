# Jobs ranking eval harness

Deterministic CI gates so the matcher's rankings never silently regress
again (the 2026-07 incident: a 0.15 recency weight, a substring keyword
filter, and a fail-open salary filter shipped unnoticed).

## What is gated (rankingEval.test.js — no network, no LLM)

- **Retrieval pool**: recall@50 of gold-best in the recomputed vector+decay
  ordering (baseline 6/12), and ALL 12 gold-best inside the 150-job rerank
  window — gold must stay reachable for the reranker.
- **Leakage**: gold-worst jobs in the decay top-10 must not exceed the
  measured baseline of 2.
- **Decay math**: monotonicity (fresher ⇒ ≥ score at equal similarity) and
  the 0.95/0.05 bound (`0.95*s <= score <= 0.95*s + 0.05`).
- **Filters at pipeline level**: `min_salary` fails closed on the all-null
  snapshot; word-boundary `search='ai'` matches 47/100 (gated < 60), vs
  89/100 with the old `JSON.stringify` substring bug.
- **Blend math**: recorded rerank scores (`__fixtures__/rerankScores.json`,
  emulating a well-behaved reranker) pushed through the exact
  `0.35*(decayed/maxSim) + 0.65*(llm/100)` formula from `matchJobs.js` must
  improve NDCG@10 over the decay ordering (0.259 → 1.0 at creation) with
  zero gold-worst leakage. This gates the blend, not the LLM.

The clock is pinned to `2026-07-22T00:00:00Z` via `vi.setSystemTime`, so
decay scores are stable. `metrics.js` (NDCG@k, recall@k, worst-leakage@k) is
unit-tested against hand-computed examples in `metrics.test.js`.

## Regenerating fixtures after a big corpus shift

1. `corpus.json`: snapshot the top ~100 matcher results for the thomasdavis
   resume (no filters, no rerank). Keep only the fields in the current
   fixture and trim descriptions to 300 chars.
2. `goldset.json`: re-label best/worst by hand (or reuse
   `docs/jobs-ranking/goldset-2026-07.json` if still valid) and copy it
   here — the test must stay hermetic.
3. `rerankScores.json`: non-gold jobs get `clamp(round(similarity*100),
   30, 70)`; hand-set gold ids (best 85–95, worst 5–25) from the goldset
   `why` strings.
4. Re-measure (run the suite, read the failures), update the `BASELINE`
   constants and the pinned clock in `rankingEval.test.js`, and note the new
   numbers here. Never move a baseline just to quiet a red build.

Run: `cd apps/registry && npx vitest run app/api/v1/jobs/matching/eval`

## Aspiration (not built)

A nightly LIVE eval — real embeddings + real LLM rerank against the current
corpus — can reuse `metrics.js` verbatim and alert on drift instead of
failing CI. Keep the deterministic gates here as the merge blocker.
