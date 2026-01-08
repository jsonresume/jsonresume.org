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

  return (
    jobsData?.map((job) => {
      const doc = sortedDocuments.find((d) => d.id === job.id);
      return { ...job, similarity: doc?.similarity || 0 };
    }) || []
  );
}

/**
 * Build graph data structure using incremental tree algorithm
 * Each job connects to its most similar already-placed node (job or resume)
 * This creates natural "career pathways" - chains of related jobs
 */
function buildGraphData(resumeId, allJobs, resumeEmbedding) {
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

  // Sort by resume similarity (highest first - these become branch roots)
  jobsWithEmbeddings.sort((a, b) => b.resumeSimilarity - a.resumeSimilarity);

  // Track placed nodes with their embeddings (start with resume)
  const placedNodes = [{ id: resumeId, embedding: resumeEmbedding }];

  // Build tree incrementally
  jobsWithEmbeddings.forEach((job) => {
    // Find most similar already-placed node (starting with resume)
    let bestMatch = { id: resumeId, similarity: job.resumeSimilarity };

    for (const placed of placedNodes) {
      if (placed.id === resumeId) continue; // Already checked via resumeSimilarity
      const sim = cosineSimilarity(job.embedding, placed.embedding);
      if (sim > bestMatch.similarity) {
        bestMatch = { id: placed.id, similarity: sim };
      }
    }

    // Create node
    try {
      const jobContent = JSON.parse(job.gpt_content);
      nodes.push({
        id: job.uuid,
        label: jobContent.title,
        group: bestMatch.id === resumeId ? 1 : 2, // Group 1 = direct from resume
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

    // Create edge to best match
    links.push({
      source: bestMatch.id,
      target: job.uuid,
      value: bestMatch.similarity,
    });

    // Add to placed nodes for future comparisons
    placedNodes.push({ id: job.uuid, embedding: job.embedding });
  });

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

  return { nodes, links, nearestNeighbors };
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
    } = await request.json();

    if (!embedding || !Array.isArray(embedding)) {
      return NextResponse.json(
        { error: 'Valid embedding array is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);
    const sortedJobs = await matchJobs(supabase, embedding, timeRange);

    // Build tree graph using incremental algorithm
    const graphData = buildGraphData(resumeId, sortedJobs, embedding);
    const jobInfoMap = buildJobInfoMap(sortedJobs);

    logger.info(
      { jobCount: sortedJobs.length, timeRange },
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
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error in pathways jobs');
    return NextResponse.json(
      { error: 'Failed to fetch jobs', details: error.message },
      { status: 500 }
    );
  }
}
