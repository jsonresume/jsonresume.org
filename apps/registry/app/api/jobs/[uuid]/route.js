import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

// This ensures the route is always dynamic
export const dynamic = 'force-dynamic';

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

    return NextResponse.json(job);
  } catch (error) {
    logger.error({ error: error.message, uuid: params.uuid }, 'Jobs API error');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
