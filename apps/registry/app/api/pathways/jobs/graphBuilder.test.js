import { describe, it, expect, vi } from 'vitest';
import { buildGraphData } from './graphBuilder';

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

/**
 * Create a fake job with a normalized embedding vector
 */
function makeJob(uuid, embeddingValues, title = 'Test Job') {
  const dim = 10;
  const vec = new Array(dim).fill(0);
  for (const [i, v] of Object.entries(embeddingValues)) {
    vec[Number(i)] = v;
  }
  return {
    uuid,
    embedding_v5: JSON.stringify(vec),
    parsedContent: { title, company: 'Test Co' },
  };
}

function makeResumeEmbedding(dim = 10) {
  // Simple resume embedding pointing mostly in dimension 0
  const vec = new Array(dim).fill(0);
  vec[0] = 1;
  return vec;
}

describe('buildGraphData', () => {
  it('returns nodes, links, nearestNeighbors, topBranches, and debug', () => {
    const jobs = [
      makeJob('j1', { 0: 1 }),
      makeJob('j2', { 1: 1 }),
      makeJob('j3', { 0: 0.7, 1: 0.3 }),
    ];
    const resumeEmb = makeResumeEmbedding();

    const result = buildGraphData('resume', jobs, resumeEmb);

    expect(result).toHaveProperty('nodes');
    expect(result).toHaveProperty('links');
    expect(result).toHaveProperty('nearestNeighbors');
    expect(result).toHaveProperty('topBranches');
    expect(result).toHaveProperty('debug');
  });

  it('always includes root/resume node', () => {
    const jobs = [makeJob('j1', { 0: 1 })];
    const result = buildGraphData('resume', jobs, makeResumeEmbedding());

    const rootNode = result.nodes.find((n) => n.id === 'resume');
    expect(rootNode).toBeDefined();
    expect(rootNode.group).toBe(-1);
  });

  it('creates nodes for all jobs', () => {
    const jobs = [
      makeJob('j1', { 0: 1 }),
      makeJob('j2', { 1: 1 }),
      makeJob('j3', { 2: 1 }),
    ];
    const result = buildGraphData('resume', jobs, makeResumeEmbedding());

    // root + 3 jobs
    expect(result.nodes).toHaveLength(4);
    expect(result.nodes.map((n) => n.id)).toContain('j1');
    expect(result.nodes.map((n) => n.id)).toContain('j2');
    expect(result.nodes.map((n) => n.id)).toContain('j3');
  });

  it('creates links connecting all jobs', () => {
    const jobs = [makeJob('j1', { 0: 1 }), makeJob('j2', { 1: 1 })];
    const result = buildGraphData('resume', jobs, makeResumeEmbedding());

    // Each job should have at least one link
    expect(result.links.length).toBeGreaterThanOrEqual(2);
  });

  it('assigns primary jobs direct links to root', () => {
    // With primaryCount=2, first 2 jobs should link to resume
    const jobs = [
      makeJob('j1', { 0: 1 }, 'Best Match'),
      makeJob('j2', { 0: 0.9, 1: 0.1 }, 'Good Match'),
      makeJob('j3', { 1: 1 }, 'Poor Match'),
    ];
    const result = buildGraphData('resume', jobs, makeResumeEmbedding(), 2);

    const resumeLinks = result.links.filter((l) => l.source === 'resume');
    expect(resumeLinks.length).toBeGreaterThanOrEqual(2);
  });

  it('computes nearestNeighbors for each job', () => {
    const jobs = [
      makeJob('j1', { 0: 1 }),
      makeJob('j2', { 0: 0.8, 1: 0.2 }),
      makeJob('j3', { 1: 1 }),
    ];
    const result = buildGraphData('resume', jobs, makeResumeEmbedding());

    expect(result.nearestNeighbors).toBeDefined();
    expect(result.nearestNeighbors['j1']).toBeDefined();
    expect(Array.isArray(result.nearestNeighbors['j1'])).toBe(true);
  });

  it('skips jobs with invalid embeddings', () => {
    const jobs = [
      makeJob('j1', { 0: 1 }),
      {
        uuid: 'bad',
        embedding_v5: 'not-json',
        parsedContent: { title: 'Bad' },
      },
    ];
    const result = buildGraphData('resume', jobs, makeResumeEmbedding());

    // Should have root + j1 only (bad job skipped)
    expect(result.nodes.find((n) => n.id === 'bad')).toBeUndefined();
  });

  it('handles empty jobs array', () => {
    const result = buildGraphData('resume', [], makeResumeEmbedding());
    expect(result.nodes).toHaveLength(1); // just root
    expect(result.links).toHaveLength(0);
  });

  it('debug contains expected fields', () => {
    const jobs = [makeJob('j1', { 0: 1 })];
    const result = buildGraphData('resume', jobs, makeResumeEmbedding());

    expect(result.debug).toHaveProperty('totalSecondary');
    expect(result.debug).toHaveProperty('cappedCount');
    expect(result.debug).toHaveProperty('orphanCount');
    expect(result.debug).toHaveProperty('maxChildrenCap');
  });
});
