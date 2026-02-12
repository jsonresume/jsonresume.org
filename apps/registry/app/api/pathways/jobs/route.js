import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { matchJobs, buildJobInfoMap } from './jobMatcher';
import { buildGraphData } from './graphBuilder';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const PRIMARY_BRANCHES = 20;

/**
 * POST /api/pathways/jobs
 * Get matched jobs for a resume embedding, build graph data
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

    const graphData = buildGraphData(
      resumeId,
      sortedJobs,
      embedding,
      primaryBranches
    );
    const jobInfoMap = buildJobInfoMap(sortedJobs);

    logger.info(
      { jobCount: sortedJobs.length, timeRange },
      'Matched jobs for pathways'
    );

    // Strip embeddings and parsedContent from response (~10MB -> ~1MB)
    const allJobsClean = sortedJobs.map(
      ({ embedding_v5, parsedContent, ...rest }) => rest
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
      allJobs: allJobsClean,
      nearestNeighbors: graphData.nearestNeighbors,
      topBranches: graphData.topBranches,
      debug: graphData.debug,
      _version: 'v9-vptree',
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error in pathways jobs');
    return NextResponse.json(
      { error: 'Failed to fetch jobs', details: error.message },
      { status: 500 }
    );
  }
}
