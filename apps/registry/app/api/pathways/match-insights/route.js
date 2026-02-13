import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { getSupabase } from '../supabase';
import { logger } from '@/lib/logger';
import { rateLimitResponse } from '../rateLimit';
import {
  hashContent,
  insightsSchema,
  SYSTEM_PROMPT,
  buildInsightsPrompt,
} from './insightsConfig';

export async function POST(request) {
  const rateLimited = rateLimitResponse(request);
  if (rateLimited) return rateLimited;

  const supabase = getSupabase();

  try {
    const { userId, jobId, resume, job } = await request.json();

    if (!userId || !jobId || !resume || !job) {
      return Response.json(
        { error: 'userId, jobId, resume, and job are required' },
        { status: 400 }
      );
    }

    const resumeHash = hashContent(resume);
    const jobHash = hashContent(job);

    // Check cache first
    const { data: cached } = await supabase
      .from('job_match_insights')
      .select('*')
      .eq('user_id', userId)
      .eq('job_id', jobId)
      .single();

    if (
      cached &&
      cached.resume_hash === resumeHash &&
      cached.job_hash === jobHash
    ) {
      return Response.json({
        ...cached.insights,
        cached: true,
        generatedAt: cached.created_at,
      });
    }

    // Generate new insights
    const { object, usage } = await generateObject({
      model: openai('gpt-4.1'),
      schema: insightsSchema,
      system: SYSTEM_PROMPT,
      prompt: buildInsightsPrompt(resume, job),
    });

    // Upsert to cache
    const { error: upsertError } = await supabase
      .from('job_match_insights')
      .upsert(
        {
          user_id: userId,
          job_id: jobId,
          insights: object,
          resume_hash: resumeHash,
          job_hash: jobHash,
          model: 'gpt-4.1',
          tokens_used: usage?.totalTokens || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,job_id' }
      );

    if (upsertError) {
      logger.error({ error: upsertError.message }, 'Error caching insights');
    }

    return Response.json({
      ...object,
      cached: false,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error generating match insights');
    return Response.json(
      { error: error.message || 'Failed to generate insights' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const supabase = getSupabase();

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const jobId = searchParams.get('jobId');

    if (!userId || !jobId) {
      return Response.json(
        { error: 'userId and jobId are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('job_match_insights')
      .select('*')
      .eq('user_id', userId)
      .eq('job_id', jobId)
      .single();

    if (error && error.code !== 'PGRST116') {
      logger.error({ error: error.message }, 'Error fetching insights');
      return Response.json(
        { error: 'Failed to fetch insights' },
        { status: 500 }
      );
    }

    if (!data) {
      return Response.json({ exists: false });
    }

    return Response.json({
      ...data.insights,
      cached: true,
      generatedAt: data.created_at,
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error in insights GET');
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
