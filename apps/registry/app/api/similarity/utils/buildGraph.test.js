import { describe, it, expect } from 'vitest';
import { buildSimilarityGraph } from './buildGraph';
import { cosineSimilarity } from '../../../utils/vectorUtils';

// The previous client-side algorithm: average of every pairwise similarity.
const bruteForceLinks = (items, threshold) => {
  const groups = {};
  items.forEach((item) => {
    (groups[item.position] = groups[item.position] || []).push(item);
  });
  const entries = Object.entries(groups);
  const links = [];
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      let total = 0;
      let n = 0;
      entries[i][1].forEach((a) =>
        entries[j][1].forEach((b) => {
          total += cosineSimilarity(a.embedding, b.embedding);
          n++;
        })
      );
      const value = total / n;
      if (value > threshold) {
        links.push({ source: entries[i][0], target: entries[j][0], value });
      }
    }
  }
  return links;
};

// Deterministic pseudo-random vectors clustered around a few directions
const seeded = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};

const makeItems = (count, dims, rand) => {
  const bases = [0, 1, 2].map(() =>
    Array.from({ length: dims }, () => rand() - 0.5)
  );
  return Array.from({ length: count }, (_, i) => ({
    username: `user${i}`,
    position: `Role ${i % 7}`,
    embedding: bases[i % 3].map((x) => x + (rand() - 0.5) * 0.3),
  }));
};

describe('buildSimilarityGraph', () => {
  it('matches the pairwise-average algorithm exactly', () => {
    const items = makeItems(60, 32, seeded(42));
    const { links } = buildSimilarityGraph(items, 0.7);
    const expected = bruteForceLinks(items, 0.7);

    expect(links.map((l) => [l.source, l.target])).toEqual(
      expected.map((l) => [l.source, l.target])
    );
    links.forEach((l, i) => expect(l.value).toBeCloseTo(expected[i].value, 10));
  });

  it('treats vectors of different lengths as unrelated, like cosineSimilarity', () => {
    const rand = seeded(7);
    const items = [
      ...makeItems(20, 16, rand),
      ...makeItems(20, 24, rand).map((item, i) => ({
        ...item,
        username: `long${i}`,
      })),
    ];
    const { links } = buildSimilarityGraph(items, 0.2);
    const expected = bruteForceLinks(items, 0.2);

    expect(links.map((l) => [l.source, l.target])).toEqual(
      expected.map((l) => [l.source, l.target])
    );
    links.forEach((l, i) => expect(l.value).toBeCloseTo(expected[i].value, 10));
  });

  it('returns one node per position with its members', () => {
    const { nodes } = buildSimilarityGraph(
      [
        { username: 'a', position: 'Dev', embedding: [1, 0] },
        { username: 'b', position: 'Dev', embedding: [1, 0] },
        { username: 'c', position: 'PM', embedding: [0, 1] },
      ],
      0.7
    );

    expect(nodes).toEqual([
      { id: 'Dev', group: 0, count: 2, usernames: ['a', 'b'] },
      { id: 'PM', group: 1, count: 1, usernames: ['c'] },
    ]);
  });
});
