import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { cosineSimilarity } from '@/app/utils/vectorUtils';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

// Time range configurations (days)
const TIME_RANGE_DAYS = {
  '1m': 35,
  '2m': 65,
  '3m': 95,
};

const MAX_JOBS = 300;
const PRIMARY_BRANCHES = 20; // Number of jobs that connect directly to resume
const MAX_CHILDREN_PER_NODE = 15; // Soft cap to prevent mega-hubs

/**
 * Check if a job has valid data (title and company)
 */
function isValidJob(job) {
  try {
    const content = JSON.parse(job.gpt_content);
    const title = content?.title?.toLowerCase() || '';
    const company = content?.company?.toLowerCase() || '';

    // Filter out jobs with unknown/missing title or company
    if (!content?.title || !content?.company) return false;
    if (title === 'unknown' || title === 'unknown job') return false;
    if (company === 'unknown' || company === 'unknown company') return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Match jobs based on embedding similarity
 */
async function matchJobs(supabase, embedding, timeRange = '1m') {
  const days = TIME_RANGE_DAYS[timeRange] || 35;
  const createdAfter = new Date(
    Date.now() - days * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: documents } = await supabase.rpc('match_jobs_v5', {
    query_embedding: embedding,
    match_threshold: -1,
    match_count: MAX_JOBS,
    created_after: createdAfter,
  });

  const sortedDocuments =
    documents?.sort((a, b) => b.similarity - a.similarity) || [];
  const jobIds = sortedDocuments.map((doc) => doc.id);

  if (jobIds.length === 0) {
    return [];
  }

  const { data: jobsData } = await supabase
    .from('jobs')
    .select('*')
    .in('id', jobIds)
    .gte('created_at', createdAfter)
    .order('created_at', { ascending: false });

  // Filter out invalid jobs and add similarity score
  const validJobs = (jobsData || []).filter(isValidJob).map((job) => {
    const doc = sortedDocuments.find((d) => d.id === job.id);
    return { ...job, similarity: doc?.similarity || 0 };
  });

  return validJobs;
}

/**
 * Build graph data structure with primary branches from resume
 * Top N jobs connect directly to resume, others branch from those
 */
function buildGraphData(
  resumeId,
  allJobs,
  resumeEmbedding,
  primaryCount = PRIMARY_BRANCHES
) {
  const nodes = [
    { id: resumeId, group: -1, size: 24, color: '#6366f1', x: 0, y: 0 },
  ];
  const links = [];

  // Parse all embeddings once for efficiency
  const embeddings = new Map();
  allJobs.forEach((job) => {
    try {
      embeddings.set(job.uuid, JSON.parse(job.embedding_v5));
    } catch {
      // Skip invalid embeddings
    }
  });

  // Filter to jobs with valid embeddings and calculate resume similarity
  const jobsWithEmbeddings = allJobs
    .filter((job) => embeddings.has(job.uuid))
    .map((job) => ({
      ...job,
      embedding: embeddings.get(job.uuid),
      resumeSimilarity: cosineSimilarity(
        embeddings.get(job.uuid),
        resumeEmbedding
      ),
    }));

  // Sort by resume similarity (highest first - these become primary branches)
  jobsWithEmbeddings.sort((a, b) => b.resumeSimilarity - a.resumeSimilarity);

  // Split into primary jobs (connect to resume) and secondary jobs (branch from primary)
  const primaryJobs = jobsWithEmbeddings.slice(0, primaryCount);
  const secondaryJobs = jobsWithEmbeddings.slice(primaryCount);

  // Track primary nodes for secondary job connections
  const primaryNodes = primaryJobs.map((job) => ({
    id: job.uuid,
    embedding: job.embedding,
  }));

  // Add primary jobs - all connect directly to resume
  primaryJobs.forEach((job) => {
    try {
      const jobContent = JSON.parse(job.gpt_content);
      nodes.push({
        id: job.uuid,
        label: jobContent.title,
        group: 1, // Group 1 = direct from resume
        size: 4,
        color: '#fff18f',
      });
    } catch {
      nodes.push({
        id: job.uuid,
        label: 'Unknown',
        group: 1,
        size: 4,
        color: '#fff18f',
      });
    }

    // Connect directly to resume
    links.push({
      source: resumeId,
      target: job.uuid,
      value: job.resumeSimilarity,
    });
  });

  // Track secondary nodes separately (for secondary-to-secondary comparisons)
  const secondaryNodes = [];

  // Debug: track which nodes are chosen as parents
  const parentChoices = {};

  // Add secondary jobs
  // ALL secondaries compare to ALL placed nodes (primaries + already-placed secondaries)
  // This ensures every node can find a parent and stay connected to the main tree
  secondaryJobs.forEach((job, idx) => {
    let bestMatch = { id: null, similarity: -1 };

    // Build comparison pool: all primaries + all already-placed secondaries
    const comparisonPool = [...primaryNodes, ...secondaryNodes];

    for (const node of comparisonPool) {
      const sim = cosineSimilarity(job.embedding, node.embedding);
      if (sim > bestMatch.similarity) {
        bestMatch = { id: node.id, similarity: sim };
      }
    }

    // FALLBACK: If no match found (shouldn't happen), connect to resume
    if (!bestMatch.id) {
      bestMatch = {
        id: resumeId,
        similarity: cosineSimilarity(job.embedding, resumeEmbedding),
      };
      logger.warn(
        { jobUuid: job.uuid, poolSize: comparisonPool.length },
        'Secondary job had no match, falling back to resume'
      );
    }

    // Track parent choices
    parentChoices[bestMatch.id] = (parentChoices[bestMatch.id] || 0) + 1;

    // Create node
    try {
      const jobContent = JSON.parse(job.gpt_content);
      nodes.push({
        id: job.uuid,
        label: jobContent.title,
        group: 2, // Group 2 = secondary jobs
        size: 4,
        color: '#fff18f',
      });
    } catch {
      nodes.push({
        id: job.uuid,
        label: 'Unknown',
        group: 2,
        size: 4,
        color: '#fff18f',
      });
    }

    // Connect to best matching node (guaranteed to have a valid id now)
    links.push({
      source: bestMatch.id,
      target: job.uuid,
      value: bestMatch.similarity,
    });

    // Add this job to secondary nodes pool for future comparisons
    secondaryNodes.push({ id: job.uuid, embedding: job.embedding });
  });

  // === RERANKING PASS ===
  // Now that all nodes are placed, re-evaluate each secondary's connection
  // by comparing to ALL placed nodes (primaries + all secondaries)
  // With MAX_CHILDREN_PER_NODE cap to prevent mega-hubs
  const allPlacedNodes = [...primaryNodes, ...secondaryNodes];

  // Build a map of embeddings for quick lookup
  const embeddingMap = new Map();
  allPlacedNodes.forEach((node) => {
    embeddingMap.set(node.id, node.embedding);
  });

  // Track child counts during reranking (will be updated as we go)
  const rerankChildCounts = {};
  links.forEach((l) => {
    rerankChildCounts[l.source] = (rerankChildCounts[l.source] || 0) + 1;
  });

  // Track reranking changes for debugging
  let rerankedCount = 0;
  let cappedCount = 0;
  const rerankChoices = {};

  // Re-evaluate each secondary node's connection
  // CRITICAL: Apply cap strictly - force moves away from over-cap parents
  secondaryNodes.forEach((node) => {
    // Find current link for this node
    const currentLinkIdx = links.findIndex((l) => l.target === node.id);
    if (currentLinkIdx === -1) return;

    const currentLink = links[currentLinkIdx];
    const currentParent = currentLink.source;

    // Collect all candidates with their similarities
    const candidates = [];
    for (const candidate of allPlacedNodes) {
      if (candidate.id === node.id) continue; // Skip self
      const sim = cosineSimilarity(node.embedding, candidate.embedding);
      candidates.push({ id: candidate.id, similarity: sim });
    }

    // Sort by similarity (highest first)
    candidates.sort((a, b) => b.similarity - a.similarity);

    // Find best match that isn't over the cap
    let bestMatch = null;
    let wasCapped = false;

    for (const candidate of candidates) {
      const candidateChildren = rerankChildCounts[candidate.id] || 0;

      // Only accept candidates under the cap
      if (candidateChildren < MAX_CHILDREN_PER_NODE) {
        bestMatch = { id: candidate.id, similarity: candidate.similarity };
        break; // Found best valid candidate
      } else {
        wasCapped = true;
      }
    }

    // Fallback: if ALL candidates are over cap, keep current parent
    if (!bestMatch) {
      bestMatch = { id: currentParent, similarity: currentLink.value };
    }

    if (wasCapped) cappedCount++;

    // Update link if we found a better match (or forced move)
    if (bestMatch.id !== currentParent) {
      // Decrement old parent's count
      rerankChildCounts[currentParent] =
        (rerankChildCounts[currentParent] || 1) - 1;
      // Increment new parent's count
      rerankChildCounts[bestMatch.id] =
        (rerankChildCounts[bestMatch.id] || 0) + 1;

      links[currentLinkIdx] = {
        source: bestMatch.id,
        target: node.id,
        value: bestMatch.similarity,
      };
      rerankedCount++;
    }

    // Track choices for debug
    rerankChoices[bestMatch.id] = (rerankChoices[bestMatch.id] || 0) + 1;
  });

  logger.info(
    {
      rerankedCount,
      cappedCount,
      maxChildrenCap: MAX_CHILDREN_PER_NODE,
      totalSecondary: secondaryNodes.length,
      percentReranked: ((rerankedCount / secondaryNodes.length) * 100).toFixed(
        1
      ),
    },
    'Reranking pass completed'
  );

  // Debug: log post-rerank parent choice distribution
  const rerankSorted = Object.entries(rerankChoices)
    .map(([id, count]) => ({
      id: id === resumeId ? 'RESUME' : id.slice(0, 8),
      count,
    }))
    .sort((a, b) => b.count - a.count);

  logger.info(
    {
      totalSecondary: secondaryJobs.length,
      uniqueParents: Object.keys(rerankChoices).length,
      topParents: rerankSorted.slice(0, 10),
      maxChildrenCap: MAX_CHILDREN_PER_NODE,
    },
    'Post-rerank parent distribution'
  );

  // === CONNECTIVITY CHECK ===
  // Ensure all nodes are reachable from the resume node
  // Find any orphaned nodes (nodes with no incoming link) and connect them
  const nodesWithIncomingLinks = new Set(links.map((l) => l.target));
  const allNodeIds = new Set(nodes.map((n) => n.id));
  let orphanCount = 0;

  for (const nodeId of allNodeIds) {
    // Resume has no incoming links (it's the root) - that's expected
    if (nodeId === resumeId) continue;

    // Check if this node has an incoming link
    if (!nodesWithIncomingLinks.has(nodeId)) {
      // Orphan found! Connect it to the resume
      const orphanNode = secondaryNodes.find((n) => n.id === nodeId);
      const orphanPrimary = primaryNodes.find((n) => n.id === nodeId);

      if (orphanNode) {
        const sim = cosineSimilarity(orphanNode.embedding, resumeEmbedding);
        links.push({
          source: resumeId,
          target: nodeId,
          value: sim,
        });
        orphanCount++;
      } else if (orphanPrimary) {
        // Primary without a link - shouldn't happen but handle it
        const sim = cosineSimilarity(orphanPrimary.embedding, resumeEmbedding);
        links.push({
          source: resumeId,
          target: nodeId,
          value: sim,
        });
        orphanCount++;
      }
    }
  }

  if (orphanCount > 0) {
    logger.warn(
      { orphanCount, totalNodes: nodes.length },
      'Found and reconnected orphaned nodes to resume'
    );
  }

  // Compute nearest neighbors for each job (top 5 most similar)
  // Include resume in neighbors for smart reconnection when filtering
  const nearestNeighbors = {};
  const allEmbeddings = [
    { id: resumeId, embedding: resumeEmbedding },
    ...jobsWithEmbeddings.map((j) => ({ id: j.uuid, embedding: j.embedding })),
  ];

  jobsWithEmbeddings.forEach((job) => {
    const similarities = allEmbeddings
      .filter((n) => n.id !== job.uuid)
      .map((n) => ({
        id: n.id,
        similarity: cosineSimilarity(job.embedding, n.embedding),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    nearestNeighbors[job.uuid] = similarities;
  });

  // Calculate final child count for each node (how many links have it as source)
  const finalChildCounts = {};
  links.forEach((link) => {
    finalChildCounts[link.source] = (finalChildCounts[link.source] || 0) + 1;
  });

  // Add childCount to each node
  nodes.forEach((node) => {
    node.childCount = finalChildCounts[node.id] || 0;
  });

  // Get top nodes by child count for logging
  const topBranches = nodes
    .filter((n) => n.childCount > 0)
    .sort((a, b) => b.childCount - a.childCount)
    .slice(0, 10)
    .map((n) => ({ label: n.label || 'Resume', childCount: n.childCount }));

  return {
    nodes,
    links,
    nearestNeighbors,
    topBranches,
    debug: {
      totalSecondary: secondaryJobs.length,
      uniqueParents: Object.keys(rerankChoices).length,
      topParents: rerankSorted.slice(0, 10),
      maxChildrenCap: MAX_CHILDREN_PER_NODE,
      rerankedCount,
      cappedCount,
      orphanCount,
    },
  };
}

/**
 * Build job info map with normalized salary data
 */
function buildJobInfoMap(jobs) {
  const jobInfoMap = {};
  jobs.forEach((job) => {
    try {
      const parsed = JSON.parse(job.gpt_content);
      // Include normalized salary data from database columns
      jobInfoMap[job.uuid] = {
        ...parsed,
        // Override with normalized salary data if available
        salaryUsd: job.salary_usd,
        salaryMin: job.salary_min,
        salaryMax: job.salary_max,
        salaryCurrency: job.salary_currency,
      };
    } catch {
      jobInfoMap[job.uuid] = { title: 'Unknown Job', error: 'Failed to parse' };
    }
  });
  return jobInfoMap;
}

/**
 * POST /api/pathways/jobs
 * Get matched jobs for a resume embedding
 */
export async function POST(request) {
  if (!process.env.SUPABASE_KEY) {
    return NextResponse.json(
      { error: 'API not available during build' },
      { status: 503 }
    );
  }

  try {
    const {
      embedding,
      resumeId = 'resume',
      timeRange = '1m',
      primaryBranches = PRIMARY_BRANCHES,
    } = await request.json();

    if (!embedding || !Array.isArray(embedding)) {
      return NextResponse.json(
        { error: 'Valid embedding array is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);
    const sortedJobs = await matchJobs(supabase, embedding, timeRange);

    // Build tree graph with configurable primary branches
    const graphData = buildGraphData(
      resumeId,
      sortedJobs,
      embedding,
      primaryBranches
    );
    const jobInfoMap = buildJobInfoMap(sortedJobs);

    logger.info(
      {
        jobCount: sortedJobs.length,
        timeRange,
        topBranches: graphData.topBranches,
      },
      'Matched jobs for pathways'
    );

    return NextResponse.json({
      graphData: {
        nodes: graphData.nodes.sort((a, b) => a.id.localeCompare(b.id)),
        links: graphData.links.sort(
          (a, b) =>
            a.source.localeCompare(b.source) || a.target.localeCompare(b.target)
        ),
      },
      jobInfoMap,
      allJobs: sortedJobs,
      // Nearest neighbors for smart reconnection when filtering
      nearestNeighbors: graphData.nearestNeighbors,
      // Top branches by child count
      topBranches: graphData.topBranches,
      // Debug info for analyzing parent distribution
      debug: graphData.debug,
      // Version for deployment verification
      _version: 'v6-connected-graph',
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error in pathways jobs');
    return NextResponse.json(
      { error: 'Failed to fetch jobs', details: error.message },
      { status: 500 }
    );
  }
}
