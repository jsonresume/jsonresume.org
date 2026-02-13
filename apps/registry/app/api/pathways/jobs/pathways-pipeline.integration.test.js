/**
 * Pathways Pipeline Integration Test
 *
 * Tests the full pathways pipeline against the production Supabase database:
 *   1. Fetches thomasdavis's public resume from the registry
 *   2. Grabs a real job embedding from the DB to use as resume embedding
 *   3. Runs matchJobs() against real job data
 *   4. Runs buildGraphData() to build the graph
 *   5. Runs buildJobInfoMap() to build the info map
 *   6. Verifies the pipeline produces valid, non-trivial results
 *
 * ALL OPERATIONS ARE READ-ONLY. No inserts, updates, or deletes.
 *
 * Requires: SUPABASE_KEY environment variable
 * Skips gracefully if SUPABASE_KEY is not available.
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { matchJobs, buildJobInfoMap } from './jobMatcher';
import { buildGraphData } from './graphBuilder';
import { VPTree } from './vpTree';
import { dotProduct, normalizeInPlace } from './vectorOps';

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

// retry module may not be available in test — provide a pass-through mock
vi.mock('@/lib/retry', () => ({
  retryWithBackoff: (fn) => fn(),
  createRetryFetch: () => fetch,
}));

const SUPABASE_URL = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const HAS_DB = Boolean(SUPABASE_KEY);

// Skip entire suite if no database access
const describeWithDB = HAS_DB ? describe : describe.skip;

describeWithDB('Pathways Pipeline Integration (prod data)', () => {
  let supabase;
  let resumeEmbedding;
  let thomasdavisResume;

  beforeAll(async () => {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // 1. Fetch thomasdavis's public resume (READ-ONLY)
    const res = await fetch('https://registry.jsonresume.org/thomasdavis.json');
    if (res.ok) {
      thomasdavisResume = await res.json();
    }

    // 2. Get a real embedding from the jobs table to use as resume embedding
    //    This avoids needing OPENAI_API_KEY. We just grab one job's embedding.
    //    (READ-ONLY: SELECT only)
    const { data: sampleJobs, error } = await supabase
      .from('jobs')
      .select('embedding_v5')
      .not('embedding_v5', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error)
      throw new Error(`Failed to fetch sample embedding: ${error.message}`);
    if (!sampleJobs?.length)
      throw new Error('No jobs with embeddings found in DB');

    resumeEmbedding = JSON.parse(sampleJobs[0].embedding_v5);
  }, 30000); // 30s timeout for network calls

  it('thomasdavis resume is fetchable and has expected structure', () => {
    expect(thomasdavisResume).toBeDefined();
    expect(thomasdavisResume.basics).toBeDefined();
    expect(thomasdavisResume.basics.name).toBeTruthy();
    expect(thomasdavisResume.work).toBeDefined();
    expect(Array.isArray(thomasdavisResume.work)).toBe(true);
    expect(thomasdavisResume.work.length).toBeGreaterThan(0);
  });

  it('resume embedding has correct dimensionality (3072)', () => {
    expect(resumeEmbedding).toBeDefined();
    expect(Array.isArray(resumeEmbedding)).toBe(true);
    expect(resumeEmbedding.length).toBe(3072);
  });

  describe('matchJobs — real DB matching', () => {
    let matchedJobs;

    beforeAll(async () => {
      // matchJobs uses supabase.rpc('match_jobs_v5', ...) — READ-ONLY
      matchedJobs = await matchJobs(supabase, resumeEmbedding, '1m');
    }, 30000);

    it('returns a non-empty array of matched jobs', () => {
      expect(Array.isArray(matchedJobs)).toBe(true);
      expect(matchedJobs.length).toBeGreaterThan(0);
    });

    it('returns a reasonable number of jobs (10-300)', () => {
      // With 1 month range and 300 max, we should get a decent number
      expect(matchedJobs.length).toBeGreaterThanOrEqual(10);
      expect(matchedJobs.length).toBeLessThanOrEqual(300);
    });

    it('each job has required fields', () => {
      for (const job of matchedJobs.slice(0, 10)) {
        expect(job.uuid).toBeTruthy();
        expect(job.parsedContent).toBeDefined();
        expect(job.parsedContent.title).toBeTruthy();
        expect(job.parsedContent.company).toBeTruthy();
        expect(typeof job.similarity).toBe('number');
        expect(job.embedding_v5).toBeTruthy();
      }
    });

    it('jobs are not "unknown" placeholders', () => {
      for (const job of matchedJobs.slice(0, 10)) {
        expect(job.parsedContent.title.toLowerCase()).not.toBe('unknown');
        expect(job.parsedContent.title.toLowerCase()).not.toBe('unknown job');
        expect(job.parsedContent.company.toLowerCase()).not.toBe('unknown');
        expect(job.parsedContent.company.toLowerCase()).not.toBe(
          'unknown company'
        );
      }
    });

    it('similarity scores are valid numbers between -1 and 1', () => {
      for (const job of matchedJobs) {
        expect(job.similarity).toBeGreaterThanOrEqual(-1);
        expect(job.similarity).toBeLessThanOrEqual(1);
      }
    });

    describe('buildGraphData — graph construction from real jobs', () => {
      let graphResult;

      beforeAll(() => {
        graphResult = buildGraphData(
          'resume',
          matchedJobs,
          resumeEmbedding,
          20
        );
      });

      it('produces graph with nodes and links', () => {
        expect(graphResult.nodes.length).toBeGreaterThan(0);
        expect(graphResult.links.length).toBeGreaterThan(0);
      });

      it('has resume root node', () => {
        const root = graphResult.nodes.find((n) => n.id === 'resume');
        expect(root).toBeDefined();
        expect(root.group).toBe(-1);
      });

      it('node count equals matched jobs + 1 (root)', () => {
        // Every matched job with a valid embedding should be a node
        expect(graphResult.nodes.length).toBe(matchedJobs.length + 1);
      });

      it('all jobs are connected (no orphans or very few)', () => {
        // After ensureConnectivity, orphanCount should be low
        expect(graphResult.debug.orphanCount).toBeLessThan(
          matchedJobs.length * 0.1
        );
      });

      it('top branches are populated', () => {
        expect(graphResult.topBranches.length).toBeGreaterThan(0);
        for (const branch of graphResult.topBranches) {
          expect(branch.childCount).toBeGreaterThan(0);
        }
      });

      it('every link has source and target that exist in nodes', () => {
        const nodeIds = new Set(graphResult.nodes.map((n) => n.id));
        for (const link of graphResult.links) {
          expect(nodeIds.has(link.source)).toBe(true);
          expect(nodeIds.has(link.target)).toBe(true);
        }
      });

      it('every non-root node has at least one incoming link', () => {
        const targets = new Set(graphResult.links.map((l) => l.target));
        for (const node of graphResult.nodes) {
          if (node.id === 'resume') continue;
          expect(targets.has(node.id)).toBe(true);
        }
      });

      it('nearestNeighbors are computed for each job', () => {
        expect(graphResult.nearestNeighbors).toBeDefined();
        const neighborKeys = Object.keys(graphResult.nearestNeighbors);
        // Should have neighbors for most jobs
        expect(neighborKeys.length).toBeGreaterThan(matchedJobs.length * 0.5);
      });
    });

    describe('buildJobInfoMap — job info from real jobs', () => {
      let jobInfoMap;

      beforeAll(() => {
        jobInfoMap = buildJobInfoMap(matchedJobs);
      });

      it('has an entry for every matched job', () => {
        for (const job of matchedJobs) {
          expect(jobInfoMap[job.uuid]).toBeDefined();
        }
      });

      it('each entry has title and company', () => {
        for (const job of matchedJobs.slice(0, 20)) {
          const info = jobInfoMap[job.uuid];
          expect(info.title).toBeTruthy();
          expect(info.company).toBeTruthy();
        }
      });

      it('salary fields are included when available', () => {
        const entries = Object.values(jobInfoMap);
        expect(entries.length).toBeGreaterThan(0);
        // Verify salary fields exist on entries (values may be null)
        entries.forEach((e) => {
          expect(e).toHaveProperty('salaryUsd');
        });
      });
    });
  });

  describe('vector operations with real embedding data', () => {
    it('real embedding normalizes correctly', () => {
      const vec = [...resumeEmbedding];
      const mag = normalizeInPlace(vec);
      expect(mag).toBeGreaterThan(0);
      // After normalization, dot product with itself should be ~1
      expect(dotProduct(vec, vec)).toBeCloseTo(1, 5);
    });

    it('VPTree works with real embedding dimensionality', () => {
      // Create a small VPTree with real-sized embeddings
      const points = [];
      for (let i = 0; i < 10; i++) {
        const emb = new Array(3072).fill(0);
        emb[i % 3072] = 1;
        let mag = 0;
        for (const v of emb) mag += v * v;
        mag = Math.sqrt(mag);
        for (let j = 0; j < emb.length; j++) emb[j] /= mag;
        points.push({ id: `p${i}`, embedding: emb });
      }

      const tree = new VPTree(points);
      const query = [...resumeEmbedding];
      normalizeInPlace(query);
      const results = tree.kNearest(query, 3);

      expect(results).toHaveLength(3);
      expect(results[0].similarity).toBeDefined();
    });
  });

  describe('data quality checks', () => {
    it('database has jobs with valid created_at dates within 35 days', async () => {
      const cutoff = new Date(
        Date.now() - 35 * 24 * 60 * 60 * 1000
      ).toISOString();

      const { count, error } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', cutoff);

      expect(error).toBeNull();
      expect(count).toBeGreaterThan(0);
    }, 15000);

    it('database has jobs with embeddings', async () => {
      const { count, error } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .not('embedding_v5', 'is', null);

      expect(error).toBeNull();
      expect(count).toBeGreaterThan(100);
    }, 15000);

    it('match_jobs_v5 RPC returns valid results', async () => {
      const { data, error } = await supabase.rpc('match_jobs_v5', {
        query_embedding: resumeEmbedding,
        match_threshold: -1,
        match_count: 10,
        created_after: new Date(
          Date.now() - 35 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('similarity');
    }, 15000);
  });
});
