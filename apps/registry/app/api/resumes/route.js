import { NextResponse } from 'next/server';
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

    console.time('getResumes');
    const query = buildResumesQuery(supabase, searchParams);
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching resumes:', error);
      return NextResponse.json(
        { message: 'Error fetching resumes' },
        { status: 500 }
      );
    }

    console.timeEnd('getResumes');

    if (!data) {
      return NextResponse.json(
        { message: 'No resumes found' },
        { status: 404 }
      );
    }

    console.time('mapResumes');
    const resumes = formatResumes(data);
    console.timeEnd('mapResumes');

    return NextResponse.json(resumes);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
