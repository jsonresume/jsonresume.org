import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

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
    const limit = parseInt(searchParams.get('limit')) || 750;

    const queryStart = Date.now();
    const { data, error } = await supabase
      .from('jobs')
      .select('uuid, embedding_v5, gpt_content')
      .not('embedding_v5', 'is', null)
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error(
        { error: error.message, limit },
        'Error fetching job similarity data'
      );
      return NextResponse.json(
        { message: 'Error fetching job similarity data' },
        { status: 500 }
      );
    }

    const queryDuration = Date.now() - queryStart;
    logger.debug(
      { duration: queryDuration, limit },
      'Fetched job similarity data'
    );

    // Parse embeddings and job titles
    const parsedData = data
      .map((item) => {
        let jobTitle = 'Unknown Position';
        let gptContent = null;
        try {
          gptContent = JSON.parse(item.gpt_content);
          jobTitle = gptContent?.title || 'Unknown Position';
        } catch (e) {
          logger.warn(
            { error: e.message, uuid: item.uuid },
            'Failed to parse gpt_content for job'
          );
        }

        return {
          uuid: item.uuid,
          title: jobTitle,
          company: gptContent?.company,
          countryCode: gptContent?.countryCode,
          embedding:
            typeof item.embedding_v5 === 'string'
              ? JSON.parse(item.embedding_v5)
              : Array.isArray(item.embedding_v5)
              ? item.embedding_v5
              : null,
        };
      })
      .filter((item) => item.embedding !== null);

    return NextResponse.json(parsedData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control':
          'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error in job similarity endpoint');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
