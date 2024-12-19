import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

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
    const limit = parseInt(searchParams.get('limit')) || 1500;

    console.time('getJobSimilarityData');
    const { data, error } = await supabase
      .from('jobs')
      .select('uuid, embedding_v5, gpt_content')
      .not('embedding_v5', 'is', null)
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching job similarity data:', error);
      return NextResponse.json(
        { message: 'Error fetching job similarity data' },
        { status: 500 }
      );
    }

    console.timeEnd('getJobSimilarityData');

    // Parse embeddings and job titles
    const parsedData = data.map(item => {
      let jobTitle = 'Unknown Position';
      let gptContent = null;
      try {
        gptContent = JSON.parse(item.gpt_content);
        jobTitle = gptContent?.title || 'Unknown Position';
      } catch (e) {
        console.warn('Failed to parse gpt_content for job:', item.uuid);
      }

      return {
        uuid: item.uuid,
        title: jobTitle,
        company: gptContent?.company,
        countryCode: gptContent?.countryCode,
        embedding: typeof item.embedding_v5 === 'string' 
          ? JSON.parse(item.embedding_v5)
          : Array.isArray(item.embedding_v5)
            ? item.embedding_v5
            : null
      };
    }).filter(item => item.embedding !== null);

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error in job similarity endpoint:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
