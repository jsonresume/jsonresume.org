import { dotProduct, normalizeInPlace, preNormalizeAll } from './vectorOps';
import { VPTree } from './vpTree';
import { ensureConnectivity } from './graphConnectivity';
import { logger } from '@/lib/logger';

const PRIMARY_BRANCHES = 20;
const MAX_CHILDREN_PER_NODE = 15;
const SECONDARY_SEARCH_K = 20;

/**
 * Build graph data using VP-tree for efficient nearest-neighbor queries.
 * Pre-normalizes vectors so cosine similarity = dot product.
 */
export function buildGraphData(
  resumeId,
  allJobs,
  resumeEmbedding,
  primaryCount = PRIMARY_BRANCHES
) {
  const nodes = [
    { id: resumeId, group: -1, size: 24, color: '#6366f1', x: 0, y: 0 },
  ];
  const links = [];

  // Parse and pre-normalize all embeddings
  const embeddings = new Map();
  allJobs.forEach((job) => {
    try {
      embeddings.set(job.uuid, JSON.parse(job.embedding_v5));
    } catch {
      /* skip invalid */
    }
  });
  preNormalizeAll(embeddings);

  const normalizedResume = [...resumeEmbedding];
  normalizeInPlace(normalizedResume);

  // Filter to jobs with valid embeddings, compute resume similarity
  const jobsWithEmbeddings = allJobs
    .filter((job) => embeddings.has(job.uuid))
    .map((job) => ({
      ...job,
      embedding: embeddings.get(job.uuid),
      resumeSimilarity: dotProduct(embeddings.get(job.uuid), normalizedResume),
    }));
  jobsWithEmbeddings.sort((a, b) => b.resumeSimilarity - a.resumeSimilarity);

  const primaryJobs = jobsWithEmbeddings.slice(0, primaryCount);
  const secondaryJobs = jobsWithEmbeddings.slice(primaryCount);

  // Build VP-tree from all job embeddings
  const treePoints = jobsWithEmbeddings.map((j) => ({
    id: j.uuid,
    embedding: j.embedding,
  }));
  const vpTree = new VPTree(treePoints);

  // Place primary jobs (direct resume connections)
  const placedIds = new Set([resumeId]);
  const childCounts = {};

  primaryJobs.forEach((job) => {
    nodes.push({
      id: job.uuid,
      label: job.parsedContent?.title || 'Unknown',
      group: 1,
      size: 4,
      color: '#fff18f',
    });
    links.push({
      source: resumeId,
      target: job.uuid,
      value: job.resumeSimilarity,
    });
    placedIds.add(job.uuid);
    childCounts[resumeId] = (childCounts[resumeId] || 0) + 1;
  });

  // Place secondary jobs using VP-tree (replaces O(N^2) scan + reranking)
  let cappedCount = 0;
  secondaryJobs.forEach((job) => {
    const candidates = vpTree.kNearest(
      job.embedding,
      SECONDARY_SEARCH_K,
      placedIds
    );

    let bestMatch = null;
    for (const candidate of candidates) {
      if (candidate.id === job.uuid) continue;
      if ((childCounts[candidate.id] || 0) < MAX_CHILDREN_PER_NODE) {
        bestMatch = candidate;
        break;
      }
      cappedCount++;
    }

    if (!bestMatch) {
      bestMatch = {
        id: resumeId,
        similarity: dotProduct(job.embedding, normalizedResume),
      };
    }

    nodes.push({
      id: job.uuid,
      label: job.parsedContent?.title || 'Unknown',
      group: 2,
      size: 4,
      color: '#fff18f',
    });
    links.push({
      source: bestMatch.id,
      target: job.uuid,
      value: bestMatch.similarity,
    });
    childCounts[bestMatch.id] = (childCounts[bestMatch.id] || 0) + 1;
    placedIds.add(job.uuid);
  });

  // Connectivity check
  const orphanCount = ensureConnectivity(
    resumeId,
    nodes,
    links,
    embeddings,
    normalizedResume
  );

  // Nearest neighbors via VP-tree
  const nearestNeighbors = computeNearestNeighbors(
    jobsWithEmbeddings,
    vpTree,
    resumeId,
    normalizedResume
  );

  // Final child counts and top branches
  const finalChildCounts = {};
  links.forEach((l) => {
    finalChildCounts[l.source] = (finalChildCounts[l.source] || 0) + 1;
  });
  nodes.forEach((n) => {
    n.childCount = finalChildCounts[n.id] || 0;
  });

  const topBranches = nodes
    .filter((n) => n.childCount > 0)
    .sort((a, b) => b.childCount - a.childCount)
    .slice(0, 10)
    .map((n) => ({ label: n.label || 'Resume', childCount: n.childCount }));

  logger.info(
    {
      totalSecondary: secondaryJobs.length,
      cappedCount,
      orphanCount,
      maxChildrenCap: MAX_CHILDREN_PER_NODE,
    },
    'Graph built with VP-tree'
  );

  return {
    nodes,
    links,
    nearestNeighbors,
    topBranches,
    debug: {
      totalSecondary: secondaryJobs.length,
      cappedCount,
      orphanCount,
      maxChildrenCap: MAX_CHILDREN_PER_NODE,
    },
  };
}

function computeNearestNeighbors(jobs, vpTree, resumeId, normalizedResume) {
  const nearestNeighbors = {};
  jobs.forEach((job) => {
    const treeNeighbors = vpTree
      .kNearest(job.embedding, 6)
      .filter((n) => n.id !== job.uuid)
      .slice(0, 5);

    const resumeSim = {
      id: resumeId,
      similarity: dotProduct(job.embedding, normalizedResume),
    };
    nearestNeighbors[job.uuid] = [...treeNeighbors, resumeSim]
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);
  });
  return nearestNeighbors;
}
