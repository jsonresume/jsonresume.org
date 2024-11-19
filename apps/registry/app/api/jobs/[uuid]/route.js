import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request, { params }) {
  try {
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
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
