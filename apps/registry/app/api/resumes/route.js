import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import gravatar from 'gravatar';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request) {
  try {
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

    if (search) {
      query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query;
    console.timeEnd('getResumes');

    if (error) {
      return NextResponse.json(
        { message: 'Error fetching resumes' },
        { status: 500 }
      );
    }

    console.time('mapResumes');
    const resumes = data.map((row) => {
      const resume = JSON.parse(row.resume);
      return {
        username: row.username,
        label: resume?.basics?.label,
        image:
          resume?.basics?.image ||
          gravatar.url(
            resume?.basics?.email,
            { s: '200', r: 'x', d: 'retro' },
            true
          ),
        name: resume?.basics?.name,
        location: resume?.basics?.location,
        updated_at: row.updated_at,
        created_at: row.created_at,
      };
    });
    console.timeEnd('mapResumes');

    console.time('sortResumes');
    resumes.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    console.timeEnd('sortResumes');

    return NextResponse.json(resumes);
  } catch (error) {
    console.error('Error processing resumes:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
