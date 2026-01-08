import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { cosineSimilarity } from '@/app/utils/vectorUtils';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

// Time range configurations (days and max jobs)
const TIME_RANGE_CONFIG = {
  '1m': { days: 35, maxJobs: 400 },
  '2m': { days: 65, maxJobs: 500 },
  '3m': { days: 95, maxJobs: 600 },
};

/**
 * Match jobs based on embedding similarity
 */
async function matchJobs(supabase, embedding, timeRange = '1m') {
  const config = TIME_RANGE_CONFIG[timeRange] || TIME_RANGE_CONFIG['1m'];
  const createdAfter = new Date(
    Date.now() - config.days * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: documents } = await supabase.rpc('match_jobs_v5', {
    query_embedding: embedding,
    match_threshold: -1,
    match_count: config.maxJobs,
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
 * Build graph data structure
 * Optimized: Pre-parse embeddings and limit comparisons to top jobs only
 */
function buildGraphData(resumeId, topJobs, otherJobs) {
  const nodes = [
    { id: resumeId, group: -1, size: 24, color: '#6366f1', x: 0, y: 0 },
  ];

  // Pre-parse embeddings for top jobs (only compare against these)
  const topJobsWithEmbeddings = topJobs
    .map((job) => {
      try {
        return {
          ...job,
          parsedEmbedding: JSON.parse(job.embedding_v5),
          parsedContent: JSON.parse(job.gpt_content),
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  // Add top job nodes
  topJobsWithEmbeddings.forEach((job) => {
    nodes.push({
      id: job.uuid,
      label: job.parsedContent.title,
      group: 1,
      size: 4,
      color: '#fff18f',
    });
  });

  // Add other job nodes
  otherJobs.forEach((job) => {
    try {
      const jobContent = JSON.parse(job.gpt_content);
      nodes.push({
        id: job.uuid,
        label: jobContent.title,
        group: 2,
        size: 4,
        color: '#fff18f',
      });
    } catch {
      // Skip invalid jobs
    }
  });

  // Build links from resume to top jobs
  const links = topJobsWithEmbeddings.map((job) => ({
    source: resumeId,
    target: job.uuid,
    value: job.similarity,
  }));

  // Connect other jobs to most similar TOP job only (not all previous jobs)
  // This reduces O(n²) to O(n*k) where k=10 (top jobs)
  otherJobs.forEach((lessRelevantJob) => {
    try {
      const lessRelevantVector = JSON.parse(lessRelevantJob.embedding_v5);

      let bestMatch = { job: null, similarity: -1 };
      topJobsWithEmbeddings.forEach((topJob) => {
        const similarity = cosineSimilarity(
          lessRelevantVector,
          topJob.parsedEmbedding
        );
        if (similarity > bestMatch.similarity) {
          bestMatch = { job: topJob, similarity };
        }
      });

      if (bestMatch.job) {
        links.push({
          source: bestMatch.job.uuid,
          target: lessRelevantJob.uuid,
          value: bestMatch.similarity,
        });
      }
    } catch {
      // Skip invalid embeddings
    }
  });

  return { nodes, links };
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

    const topJobs = sortedJobs.slice(0, 10);
    const otherJobs = sortedJobs.slice(10);

    const graphData = buildGraphData(resumeId, topJobs, otherJobs);
    const jobInfoMap = buildJobInfoMap(sortedJobs);

    logger.info(
      { jobCount: sortedJobs.length, topCount: topJobs.length, timeRange },
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
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error in pathways jobs');
    return NextResponse.json(
      { error: 'Failed to fetch jobs', details: error.message },
      { status: 500 }
    );
  }
}
