import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createSupabase } from './utils/createSupabase';
import { fetchThomasResume, fetchOtherResumes } from './utils/fetchResumeData';
import { parseResumeData } from './utils/parseResumeData';

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
    const supabase = createSupabase();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 1000;

    const fetchStart = Date.now();

    // Fetch resume data
    const thomasData = await fetchThomasResume(supabase);
    const otherData = await fetchOtherResumes(supabase, limit);

    const fetchDuration = Date.now() - fetchStart;
    logger.debug(
      { duration: fetchDuration, limit },
      'Fetched resume similarity data'
    );

    // Combine results, putting thomasdavis first if available
    const data = thomasData ? [thomasData, ...(otherData || [])] : otherData;

    // Parse embeddings and extract positions
    const parsedData = parseResumeData(data);

    return NextResponse.json(parsedData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control':
          'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error in similarity endpoint');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
