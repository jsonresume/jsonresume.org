import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createSupabaseClient } from './utils/supabaseClient';
import { buildResumesQuery } from './utils/queryBuilder';
import { formatResumes } from './utils/formatResumes';

// This ensures the route is always dynamic
export const dynamic = 'force-dynamic';

export async function GET(request) {
  // During build time or when SUPABASE_KEY is not available
  if (!process.env.SUPABASE_KEY) {
    return NextResponse.json(
      { message: 'API not available during build' },
      { status: 503 }
    );
  }

  try {
    const supabase = createSupabaseClient();
    const { searchParams } = new URL(request.url);

    const queryStart = Date.now();
    const query = buildResumesQuery(supabase, searchParams);
    const { data, error } = await query;

    if (error) {
      logger.error({ error: error.message }, 'Error fetching resumes');
      return NextResponse.json(
        { message: 'Error fetching resumes' },
        { status: 500 }
      );
    }

    const queryDuration = Date.now() - queryStart;
    logger.debug({ duration: queryDuration }, 'Fetched resumes from database');

    if (!data) {
      return NextResponse.json(
        { message: 'No resumes found' },
        { status: 404 }
      );
    }

    const formatStart = Date.now();
    const resumes = formatResumes(data);
    const formatDuration = Date.now() - formatStart;
    logger.debug(
      { duration: formatDuration, count: resumes.length },
      'Formatted resumes'
    );

    return NextResponse.json(resumes);
  } catch (error) {
    logger.error({ error: error.message }, 'Resumes API error');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
