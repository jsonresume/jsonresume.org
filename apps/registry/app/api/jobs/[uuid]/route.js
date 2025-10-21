import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

// This ensures the route is always dynamic
export const dynamic = 'force-dynamic';

/**
 * Remove embedding fields from job object before sending to client
 * Embeddings are large arrays that aren't needed on the client side
 */
function stripEmbeddings(job) {
  if (!job) return job;
  const {
    embedding,
    embedding_v2,
    embedding_v3,
    embedding_v4,
    embedding_v5,
    ...jobWithoutEmbeddings
  } = job;
  return jobWithoutEmbeddings;
}

export async function GET(request, { params }) {
  // During build time or when SUPABASE_KEY is not available
  if (!process.env.SUPABASE_KEY) {
    return NextResponse.json(
      { message: 'API not available during build' },
      { status: 503 }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

    const { data: job, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('uuid', params.uuid)
      .single();

    if (error) {
      return NextResponse.json(
        { message: 'Error fetching job' },
        { status: 500 }
      );
    }

    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(stripEmbeddings(job));
  } catch (error) {
    logger.error({ error: error.message, uuid: params.uuid }, 'Jobs API error');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
