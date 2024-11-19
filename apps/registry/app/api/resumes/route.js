import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import gravatar from 'gravatar';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

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
    const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 3000;
    const page = parseInt(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';

    console.time('getResumes');
    const query = supabase
      .from('resumes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
      .range((page - 1) * limit, page * limit - 1);

    if (search && search.trim() !== '') {
      query.textSearch('resume', search.trim(), {
        config: 'english',
        type: 'websearch',
      });
    }

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
    const resumes = data.map((row) => {
      try {
        const resume = JSON.parse(row.resume);
        return {
          username: row.username,
          label: resume?.basics?.label,
          image:
            resume?.basics?.image ||
            gravatar.url(
              resume?.basics?.email || '',
              {
                s: '200',
                r: 'x',
                d: 'retro',
              },
              true
            ),
          name: resume?.basics?.name,
          location: resume?.basics?.location,
          updated_at: row.updated_at,
          created_at: row.created_at,
        };
      } catch (e) {
        console.error('Error parsing resume:', e);
        return {
          username: row.username,
          label: 'Error parsing resume',
          image: gravatar.url('', { s: '200', r: 'x', d: 'retro' }, true),
          name: row.username,
          location: null,
          updated_at: row.updated_at,
          created_at: row.created_at,
        };
      }
    });
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
