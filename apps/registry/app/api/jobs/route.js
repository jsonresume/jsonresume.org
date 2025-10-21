import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

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
    const { username, limit = 100 } = body;

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

    return NextResponse.json(jobs || []);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
