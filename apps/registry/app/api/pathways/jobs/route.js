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

  // Track child counts for penalty calculation
  const childCounts = {};

  // Debug: track which nodes are chosen as parents
  const parentChoices = {};

  // Child count penalty factor - discourages hub formation
  // Higher values = stronger penalty for nodes with many children
  const CHILD_PENALTY_FACTOR = 0.15;

  // Add secondary jobs
  // - First secondary (#21): compares to primaries only
  // - Subsequent secondaries (#22+): compares to other secondaries only
  // - Apply child count penalty to encourage chain formation over hubs
  secondaryJobs.forEach((job, idx) => {
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
      // Apply penalty for nodes with many children to prevent hub formation
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
    }

    // Debug: log first few secondary job placements
    if (idx < 5) {
      const parentChildren = childCounts[bestMatch.id] || 0;
      logger.debug(
        {
          jobIdx: idx + 21,
          bestMatchId: bestMatch.id?.slice(0, 8),
          rawSimilarity: bestMatch.rawSimilarity?.toFixed(4),
          adjustedSimilarity: bestMatch.similarity?.toFixed(4),
          parentChildCount: parentChildren,
          poolSize: comparisonPool.length,
          poolType: idx === 0 ? 'primaries' : 'secondaries',
        },
        'Secondary job placement debug'
      );
    }

    // Track parent choices
    if (bestMatch.id) {
      parentChoices[bestMatch.id] = (parentChoices[bestMatch.id] || 0) + 1;
    }

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

    // Connect to best matching node (use raw similarity for link value, not penalty-adjusted)
    if (bestMatch.id) {
      links.push({
        source: bestMatch.id,
        target: job.uuid,
        value: bestMatch.rawSimilarity,
      });
    }

    // Add this job to secondary nodes pool for future comparisons
    secondaryNodes.push({ id: job.uuid, embedding: job.embedding });
  });

  // Debug: log parent choice distribution
  const choicesSorted = Object.entries(parentChoices)
    .map(([id, count]) => ({
      id: id === resumeId ? 'RESUME' : id.slice(0, 8),
      count,
    }))
    .sort((a, b) => b.count - a.count);

  logger.info(
    {
      totalSecondary: secondaryJobs.length,
      uniqueParents: Object.keys(parentChoices).length,
      topParents: choicesSorted.slice(0, 10),
      resumeChosen: parentChoices[resumeId] || 0,
    },
    'Parent choice distribution for secondary jobs'
  );

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

  // Calculate child count for each node (how many links have it as source)
  const childCounts = {};
  links.forEach((link) => {
    childCounts[link.source] = (childCounts[link.source] || 0) + 1;
  });

  // Add childCount to each node
  nodes.forEach((node) => {
    node.childCount = childCounts[node.id] || 0;
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
      uniqueParents: Object.keys(parentChoices).length,
      topParents: choicesSorted.slice(0, 10),
      resumeChosen: parentChoices[resumeId] || 0,
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
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error in pathways jobs');
    return NextResponse.json(
      { error: 'Failed to fetch jobs', details: error.message },
      { status: 500 }
    );
  }
}
