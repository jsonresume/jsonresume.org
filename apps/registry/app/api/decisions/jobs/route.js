import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

/**
 * Remove embedding fields from job objects before sending to client
 * Embeddings are large arrays that aren't needed on the client side
 */
function stripEmbeddings(jobs) {
  return jobs.map((job) => {
    /* eslint-disable no-unused-vars */
    const {
      embedding,
      embedding_v2,
      embedding_v3,
      embedding_v4,
      embedding_v5,
      ...jobWithoutEmbeddings
    } = job;
    /* eslint-enable no-unused-vars */
    return jobWithoutEmbeddings;
  });
}

export async function POST(request) {
  // During build time or when SUPABASE_KEY is not available
  if (!process.env.SUPABASE_KEY) {
    return NextResponse.json(
      { message: 'API not available during build' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { userId, limit = 100 } = body;

    const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

    // Get jobs from the last 90 days, sorted by creation date descending
    let query = supabase
      .from('jobs')
      .select('*')
      .gte(
        'created_at',
        new Date(Date.now() - 60 * 24 * 60 * 90 * 1000).toISOString()
      )
      .order('created_at', { ascending: false });

    // Apply limit if specified
    if (limit) {
      query = query.limit(Math.min(limit, 1000)); // Cap at 1000 max
    }

    const { data: jobs, error } = await query;

    if (error) throw error;

    // If userId provided, filter out jobs the user has already decided on
    if (userId && jobs && jobs.length > 0) {
      const jobIds = jobs.map((job) => job.id);

      // Get all decisions for this user on these jobs
      const { data: decisions, error: decisionsError } = await supabase
        .from('job_decisions')
        .select('job_id')
        .eq('user_id', userId)
        .in('job_id', jobIds);

      if (decisionsError) throw decisionsError;

      // Create a Set of decided job IDs for fast lookup
      const decidedJobIds = new Set(decisions?.map((d) => d.job_id) || []);

      // Filter out jobs that have been decided on
      const undecidedJobs = jobs.filter((job) => !decidedJobIds.has(job.id));

      return NextResponse.json(stripEmbeddings(undecidedJobs));
    }

    return NextResponse.json(stripEmbeddings(jobs || []));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
