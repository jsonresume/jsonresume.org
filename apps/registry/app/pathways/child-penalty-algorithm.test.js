/**
 * Unit test for the child count penalty algorithm
 * Tests the logic locally without needing API calls
 */

import { describe, it, expect } from 'vitest';

// Simulate cosine similarity (in real scenario would use vectorUtils)
const cosineSimilarity = (a, b) => {
  const dotProduct = a.reduce((sum, _, i) => sum + a[i] * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

// The child count penalty factor from the algorithm
const CHILD_PENALTY_FACTOR = 0.15;

// Simulate the secondary job placement algorithm
function simulateSecondaryPlacement(jobs, primaryNodes) {
  const secondaryNodes = [];
  const childCounts = {};
  const parentChoices = {};

  jobs.forEach((job, idx) => {
    let bestMatch = { id: null, similarity: -1, rawSimilarity: -1 };
    let comparisonPool = [];

    if (idx === 0) {
      // First secondary: compare to primaries only
      comparisonPool = primaryNodes;
    } else {
      // Subsequent secondaries: compare to other secondaries only
      comparisonPool = secondaryNodes;
    }

    for (const node of comparisonPool) {
      const rawSim = cosineSimilarity(job.embedding, node.embedding);
      const nodeChildCount = childCounts[node.id] || 0;
      const penalty = 1 / (1 + CHILD_PENALTY_FACTOR * nodeChildCount);
      const adjustedSim = rawSim * penalty;

      if (adjustedSim > bestMatch.similarity) {
        bestMatch = {
          id: node.id,
          similarity: adjustedSim,
          rawSimilarity: rawSim,
        };
      }
    }

    // Update child count for chosen parent
    if (bestMatch.id) {
      childCounts[bestMatch.id] = (childCounts[bestMatch.id] || 0) + 1;
      parentChoices[bestMatch.id] = (parentChoices[bestMatch.id] || 0) + 1;
    }

    secondaryNodes.push({ id: job.id, embedding: job.embedding });
  });

  return { childCounts, parentChoices, secondaryNodes };
}

describe('Child Count Penalty Algorithm', () => {
  it('should distribute children across nodes instead of creating hub', () => {
    // Create mock primary nodes with diverse embeddings
    const primaryNodes = [
      { id: 'primary1', embedding: [1, 0, 0, 0, 0] },
      { id: 'primary2', embedding: [0, 1, 0, 0, 0] },
      { id: 'primary3', embedding: [0, 0, 1, 0, 0] },
      { id: 'primary4', embedding: [0, 0, 0, 1, 0] },
      { id: 'primary5', embedding: [0, 0, 0, 0, 1] },
    ];

    // Create 50 secondary jobs with similar embeddings (all similar to first direction)
    // This simulates a scenario where many jobs are similar to one central node
    const secondaryJobs = Array.from({ length: 50 }, (_, i) => ({
      id: `secondary${i + 1}`,
      // All jobs have similar embeddings (would create hub without penalty)
      embedding: [
        0.9 + Math.random() * 0.1,
        0.1 * Math.random(),
        0.1 * Math.random(),
        0.1 * Math.random(),
        0.1 * Math.random(),
      ],
    }));

    const result = simulateSecondaryPlacement(secondaryJobs, primaryNodes);

    // Get max children for any single node
    const maxChildren = Math.max(...Object.values(result.childCounts));
    const uniqueParents = Object.keys(result.parentChoices).length;

    console.log('Child counts:', result.childCounts);
    console.log('Max children on any node:', maxChildren);
    console.log('Unique parents:', uniqueParents);

    // With penalty, no single node should have majority of children
    expect(maxChildren).toBeLessThan(30); // Should be well distributed
    expect(uniqueParents).toBeGreaterThan(5); // Multiple parents should be used
  });

  it('should create chains as children accumulate', () => {
    // Single primary to test chain formation
    const primaryNodes = [{ id: 'primary1', embedding: [1, 0, 0] }];

    // 20 identical secondary jobs (perfect similarity to each other)
    const secondaryJobs = Array.from({ length: 20 }, (_, i) => ({
      id: `secondary${i + 1}`,
      embedding: [1, 0, 0], // All identical
    }));

    const result = simulateSecondaryPlacement(secondaryJobs, primaryNodes);

    console.log('\nChain test - child counts:', result.childCounts);

    // Even with identical embeddings, penalty should spread children
    const maxChildren = Math.max(...Object.values(result.childCounts));

    // Without penalty, all 20 would attach to first secondary
    // With penalty, should be more distributed
    expect(maxChildren).toBeLessThan(15);
  });

  it('penalty calculation should reduce effective similarity', () => {
    // Test the penalty math
    const rawSimilarity = 0.95;

    // 0 children: no penalty
    expect(rawSimilarity * (1 / (1 + CHILD_PENALTY_FACTOR * 0))).toBeCloseTo(
      0.95
    );

    // 5 children: ~57% of original
    expect(rawSimilarity * (1 / (1 + CHILD_PENALTY_FACTOR * 5))).toBeCloseTo(
      0.543,
      2
    );

    // 10 children: ~38% of original
    expect(rawSimilarity * (1 / (1 + CHILD_PENALTY_FACTOR * 10))).toBeCloseTo(
      0.38,
      2
    );

    // 20 children: ~24% of original
    expect(rawSimilarity * (1 / (1 + CHILD_PENALTY_FACTOR * 20))).toBeCloseTo(
      0.237,
      2
    );
  });

  it('should prefer less-connected node when similarities are close', () => {
    const nodeWithChildren = { id: 'popular', embedding: [1, 0, 0] };
    const nodeWithoutChildren = { id: 'lonely', embedding: [0.95, 0.31, 0] }; // ~0.95 similarity

    const job = { embedding: [1, 0, 0] };
    const childCounts = { popular: 10, lonely: 0 };

    // Calculate adjusted similarities
    const rawSimPopular = cosineSimilarity(
      job.embedding,
      nodeWithChildren.embedding
    );
    const rawSimLonely = cosineSimilarity(
      job.embedding,
      nodeWithoutChildren.embedding
    );

    const adjSimPopular =
      rawSimPopular * (1 / (1 + CHILD_PENALTY_FACTOR * childCounts.popular));
    const adjSimLonely =
      rawSimLonely * (1 / (1 + CHILD_PENALTY_FACTOR * childCounts.lonely));

    console.log('\nPreference test:');
    console.log(
      'Popular node - raw:',
      rawSimPopular.toFixed(3),
      'adjusted:',
      adjSimPopular.toFixed(3)
    );
    console.log(
      'Lonely node - raw:',
      rawSimLonely.toFixed(3),
      'adjusted:',
      adjSimLonely.toFixed(3)
    );

    // Popular node has perfect similarity but penalty
    // Lonely node has slightly worse similarity but no penalty
    // Adjusted similarity for lonely should win
    expect(adjSimLonely).toBeGreaterThan(adjSimPopular);
  });
});
