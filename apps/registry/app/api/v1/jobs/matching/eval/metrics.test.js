/**
 * Hand-computed examples for the ranking metrics. Every expected value below
 * is derived on paper from the DCG formula rel_i / log2(i + 2) — if these
 * fail, the metric is wrong, not the pipeline.
 */
import { describe, it, expect } from 'vitest';
import { ndcgAtK, recallAtK, worstLeakage } from './metrics';

describe('ndcgAtK', () => {
  it('is 1 for a perfectly ordered list', () => {
    const relevance = { a: 3, b: 1, c: 0 };
    expect(ndcgAtK(['a', 'b', 'c'], relevance, 3)).toBe(1);
  });

  it('matches a hand-computed value for a shuffled list', () => {
    // ranked [c, a, b] with rel {a:3, b:1, c:0}, k=3:
    //   DCG  = 0/log2(2) + 3/log2(3) + 1/log2(4)
    //        = 0 + 1.8927892607 + 0.5            = 2.3927892607
    //   IDCG = 3/log2(2) + 1/log2(3) + 0/log2(4)
    //        = 3 + 0.6309297536                  = 3.6309297536
    //   NDCG = 2.3927892607 / 3.6309297536       = 0.6590016...
    const relevance = { a: 3, b: 1, c: 0 };
    expect(ndcgAtK(['c', 'a', 'b'], relevance, 3)).toBeCloseTo(0.659, 3);
  });

  it('worst item first is penalized more at small k', () => {
    const relevance = { best: 3, mid: 1, worst: 0 };
    const good = ndcgAtK(['best', 'mid', 'worst'], relevance, 2);
    const bad = ndcgAtK(['worst', 'mid', 'best'], relevance, 2);
    expect(good).toBe(1);
    // DCG = 0 + 1/log2(3) = 0.6309297536; IDCG = 3 + 1/log2(3) = 3.6309297536
    expect(bad).toBeCloseTo(0.6309297536 / 3.6309297536, 10);
  });

  it('treats ids missing from the relevance map as relevance 0', () => {
    // ranked [x, a], rel {a:3}: DCG = 0 + 3/log2(3); IDCG = 3/log2(2)
    expect(ndcgAtK(['x', 'a'], { a: 3 }, 2)).toBeCloseTo(
      3 / Math.log2(3) / 3,
      10
    );
  });

  it('returns 0 when there is no relevant item at all', () => {
    expect(ndcgAtK(['a', 'b'], {}, 2)).toBe(0);
    expect(ndcgAtK([], { a: 3 }, 5)).toBe(0);
  });
});

describe('recallAtK', () => {
  it('counts gold hits within the cutoff', () => {
    const ranked = ['a', 'b', 'c', 'd'];
    expect(recallAtK(ranked, ['b', 'd'], 2)).toBe(0.5); // only b in top-2
    expect(recallAtK(ranked, ['b', 'd'], 4)).toBe(1);
    expect(recallAtK(ranked, ['b', 'd'], 1)).toBe(0);
  });

  it('counts gold ids absent from the ranking as misses', () => {
    expect(recallAtK(['a', 'b'], ['a', 'ghost'], 2)).toBe(0.5);
  });

  it('is vacuously 1 for an empty gold set', () => {
    expect(recallAtK(['a', 'b'], [], 2)).toBe(1);
  });
});

describe('worstLeakage', () => {
  it('counts worst ids inside the cutoff', () => {
    const ranked = ['w1', 'a', 'w2', 'b', 'w3'];
    expect(worstLeakage(ranked, ['w1', 'w2', 'w3'], 3)).toBe(2);
    expect(worstLeakage(ranked, ['w1', 'w2', 'w3'], 5)).toBe(3);
    expect(worstLeakage(ranked, ['w1', 'w2', 'w3'], 1)).toBe(1);
  });

  it('is 0 when no worst id ranks inside the cutoff', () => {
    expect(worstLeakage(['a', 'b', 'w1'], ['w1'], 2)).toBe(0);
    expect(worstLeakage(['a', 'b'], [], 2)).toBe(0);
  });
});
