/**
 * Deterministic ranking-eval gates for the jobs matcher.
 *
 * No network, no LLM: the corpus fixture is a snapshot of 100 real scored
 * jobs for the thomasdavis resume, the goldset is the human-labeled
 * best/worst from the 2026-07 ranking eval (see __fixtures__ provenance
 * notes), and the clock is pinned so timeDecayScore is stable. Baseline
 * constants below are the values MEASURED at harness creation — gates sit at
 * (or just below) measured reality so they catch regressions, not noise.
 * See eval/README.md for how to regenerate fixtures after big corpus shifts.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { vi } from 'vitest';
import { timeDecayScore } from '../vectorMath';
import { buildJobFilter } from '../filters';
import { ndcgAtK, recallAtK, worstLeakage } from './metrics';
import corpusFixture from './__fixtures__/corpus.json';
import goldset from './__fixtures__/goldset.json';
import rerankFixture from './__fixtures__/rerankScores.json';

// Clock pin: decay depends on Date.now(); this freezes the ordering forever.
const PINNED_NOW = new Date('2026-07-22T00:00:00.000Z');

// Measured baselines (pinned clock, this fixture) — update deliberately, with
// a fixture regeneration, never to quiet a red build.
const BASELINE = {
  recallAt50: 6 / 12, // gold-best found in decay top-50
  worstLeakageAt10: 2, // gold-worst in decay top-10
  ndcgAt10Decay: 0.2587, // decay ordering NDCG@10 (approx, for reference)
  aiKeywordMatches: 47, // word-boundary 'ai' hits /100 (substring bug: 89)
};

// Rerank blend constants — must mirror matchJobs.js exactly.
const RERANK_WINDOW = 150;
const VECTOR_WEIGHT = 0.35;
const LLM_WEIGHT = 0.65;

const corpus = corpusFixture.jobs;
const bestIds = goldset.best.map((g) => g.id);
const worstIds = goldset.worst.map((g) => g.id);

// NDCG relevance convention: gold-best = 3, ungraded = 1, gold-worst = 0.
const relevance = {};
corpus.forEach((j) => (relevance[j.id] = 1));
bestIds.forEach((id) => (relevance[id] = 3));
worstIds.forEach((id) => (relevance[id] = 0));

const round3 = (x) => Math.round(x * 1000) / 1000;

/** Recompute the vector+decay ordering exactly like matchJobs.js. */
function decayOrdering() {
  return corpus
    .map((j) => ({
      ...j,
      decayed: round3(timeDecayScore(j.similarity, j.posted_at)),
    }))
    .sort((a, b) => b.decayed - a.decayed);
}

/** Apply recorded rerank scores through the matchJobs.js blend formula. */
function simulateRerank(ordered) {
  const windowSize = Math.min(RERANK_WINDOW, ordered.length);
  const toRerank = ordered.slice(0, windowSize);
  const rest = ordered.slice(windowSize);
  const maxSim = Math.max(...toRerank.map((j) => j.decayed), 0.001);
  const reranked = toRerank
    .map((j) => {
      const llm = rerankFixture.scores[j.id];
      const combined =
        VECTOR_WEIGHT * (j.decayed / maxSim) + LLM_WEIGHT * ((llm ?? 50) / 100);
      return { ...j, combined: round3(combined) };
    })
    .sort((a, b) => b.combined - a.combined);
  return [...reranked, ...rest];
}

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(PINNED_NOW);
});

afterAll(() => {
  vi.useRealTimers();
});

describe('fixture integrity', () => {
  it('corpus is the full 100-job snapshot', () => {
    expect(corpus).toHaveLength(100);
  });

  it('every goldset id exists in the corpus (hermetic)', () => {
    const ids = new Set(corpus.map((j) => j.id));
    [...bestIds, ...worstIds].forEach((id) => expect(ids.has(id)).toBe(true));
    expect(bestIds).toHaveLength(12);
    expect(worstIds).toHaveLength(8);
  });

  it('every corpus job has a recorded rerank score', () => {
    corpus.forEach((j) =>
      expect(rerankFixture.scores[j.id]).toBeTypeOf('number')
    );
  });
});

describe('retrieval pool (vector + decay ordering)', () => {
  it('keeps gold-best reachable: recall@50 does not regress below baseline', () => {
    const ids = decayOrdering().map((j) => j.id);
    expect(recallAtK(ids, bestIds, 50)).toBeGreaterThanOrEqual(
      BASELINE.recallAt50
    );
  });

  it('keeps ALL gold-best inside the rerank window', () => {
    const ids = decayOrdering().map((j) => j.id);
    expect(recallAtK(ids, bestIds, RERANK_WINDOW)).toBe(1);
  });

  it('gold-worst leakage into the decay top-10 does not grow', () => {
    const ids = decayOrdering().map((j) => j.id);
    expect(worstLeakage(ids, worstIds, 10)).toBeLessThanOrEqual(
      BASELINE.worstLeakageAt10
    );
  });
});

describe('time-decay properties', () => {
  const sims = [0.1, 0.37, 0.4, 0.44, 0.9];

  it('identical similarity + fresher posting never scores lower', () => {
    const dates = [
      '2026-07-21T00:00:00Z',
      '2026-07-01T00:00:00Z',
      '2026-05-01T00:00:00Z',
      '2025-07-22T00:00:00Z',
    ];
    for (const s of sims) {
      for (let i = 1; i < dates.length; i++) {
        expect(timeDecayScore(s, dates[i - 1])).toBeGreaterThanOrEqual(
          timeDecayScore(s, dates[i])
        );
      }
    }
  });

  it('recency term is bounded: 0.95*s <= score <= 0.95*s + 0.05', () => {
    const old = '2024-01-01T00:00:00Z';
    const fresh = '2026-07-22T00:00:00Z';
    for (const s of sims) {
      expect(timeDecayScore(s, old)).toBeGreaterThanOrEqual(0.95 * s);
      expect(timeDecayScore(s, fresh)).toBeLessThanOrEqual(0.95 * s + 0.05);
    }
  });

  it('missing posted_at leaves similarity untouched', () => {
    expect(timeDecayScore(0.42, null)).toBe(0.42);
  });
});

describe('filter gates over the real corpus', () => {
  it('min_salary fails closed: null salary_usd rows are excluded', () => {
    // Every job in this snapshot has salary_usd = null (the field is not yet
    // populated in prod) — exactly the condition that made the old fail-open
    // filter a silent no-op. Fail-closed must return zero rows here.
    const passed = corpus.filter(buildJobFilter({ minSalary: 150 }));
    expect(passed).toHaveLength(0);
    const optIn = corpus.filter(
      buildJobFilter({ minSalary: 150, includeUnknownSalary: true })
    );
    expect(optIn).toHaveLength(corpus.length);
  });

  it("search='ai' word-boundary matches stay far below the substring bug", () => {
    const matches = corpus.filter(buildJobFilter({ search: 'ai' }));
    // Baseline: 47/100 genuinely mention AI. The old JSON.stringify substring
    // bug matched 89/100 via "maintain"/"available". Gate well under that.
    expect(matches.length).toBeLessThan(60);
    const substringBug = corpus.filter((j) =>
      JSON.stringify(j).toLowerCase().includes('ai')
    );
    expect(matches.length).toBeLessThan(substringBug.length);
  });

  it('keyword search matches a strict subset, never the whole corpus', () => {
    for (const q of ['typescript', 'rust', 'react']) {
      const n = corpus.filter(buildJobFilter({ search: q })).length;
      expect(n).toBeGreaterThan(0);
      expect(n).toBeLessThan(corpus.length);
    }
  });
});

describe('rerank blend simulation (recorded scores, no LLM)', () => {
  it('a well-behaved reranker improves NDCG@10 over the decay ordering', () => {
    const decayIds = decayOrdering().map((j) => j.id);
    const rerankIds = simulateRerank(decayOrdering()).map((j) => j.id);
    const before = ndcgAtK(decayIds, relevance, 10);
    const after = ndcgAtK(rerankIds, relevance, 10);
    expect(after).toBeGreaterThan(before);
    expect(after).toBeGreaterThanOrEqual(0.95); // measured 1.0 at creation
  });

  it('the blend never lets gold-worst leak into the top-10', () => {
    const rerankIds = simulateRerank(decayOrdering()).map((j) => j.id);
    expect(worstLeakage(rerankIds, worstIds, 10)).toBe(0);
  });

  it('all 12 gold-best land in the blended top-12', () => {
    const rerankIds = simulateRerank(decayOrdering()).map((j) => j.id);
    expect(recallAtK(rerankIds, bestIds, 12)).toBe(1);
  });
});
