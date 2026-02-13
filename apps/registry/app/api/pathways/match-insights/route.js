import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import crypto from 'crypto';
import { getSupabase } from '../supabase';
import { logger } from '@/lib/logger';
import { rateLimitResponse } from '../rateLimit';

// Create a hash of content for cache invalidation
function hashContent(content) {
  return crypto
    .createHash('md5')
    .update(JSON.stringify(content))
    .digest('hex')
    .slice(0, 16);
}

const insightsSchema = z.object({
  bullets: z.array(
    z.object({
      emoji: z.string().describe('A relevant emoji for this point'),
      title: z.string().describe('Short bold title (2-4 words)'),
      description: z.string().describe('Brief explanation (1-2 sentences)'),
    })
  ),
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe('Overall match percentage based on skills and experience'),
  summary: z
    .string()
    .describe('One sentence summary of why this could be a good fit'),
});

const SYSTEM_PROMPT = `You are a career advisor helping a job seeker understand why they might be a good fit for a specific role.

Analyze the resume and job posting, then provide:
1. 4-6 specific bullet points explaining why this person could be a strong candidate
2. Focus on concrete skill matches, relevant experience, and potential growth areas
3. Be honest but encouraging - mention any gaps constructively
4. Each bullet should have a relevant emoji, a short title, and a brief description

Consider:
- Direct skill matches between resume and job requirements
- Relevant experience and projects
- Transferable skills
- Company culture fit indicators
- Growth opportunities this role offers`;

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

    // Return cached if hashes match (content hasn't changed)
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
      prompt: `
RESUME:
${JSON.stringify(resume, null, 2)}

JOB POSTING:
Title: ${job.title}
Company: ${job.company}
${job.description ? `Description: ${job.description}` : ''}
${
  job.skills?.length
    ? `Required Skills: ${job.skills
        .map((s) => (typeof s === 'string' ? s : s.name))
        .join(', ')}`
    : ''
}
${
  job.bonusSkills?.length
    ? `Bonus Skills: ${job.bonusSkills
        .map((s) => (typeof s === 'string' ? s : s.name))
        .join(', ')}`
    : ''
}
${
  job.location
    ? `Location: ${
        typeof job.location === 'string'
          ? job.location
          : `${job.location.city || ''}, ${job.location.region || ''}`
      }`
    : ''
}
${job.remote ? 'Remote: Yes' : ''}
${
  job.salaryMin && job.salaryMax
    ? `Salary Range: $${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
    : ''
}

Provide specific, actionable insights about why this person could be a good fit for this role.`,
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
      // Don't fail the request, just log the error
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
      // PGRST116 = no rows returned
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
