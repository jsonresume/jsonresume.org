import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { embed } from 'ai';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { authenticate } from '../auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

function getSupabase() {
  return createClient(supabaseUrl, process.env.SUPABASE_KEY);
}

/**
 * GET /api/v1/searches — list search profiles for user
 */
export async function GET(request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('search_profiles')
    .select('id, name, prompt, filters, created_at, updated_at')
    .eq('user_id', user.username)
    .order('created_at', { ascending: false });

  if (
    error?.message?.includes('does not exist') ||
    error?.message?.includes('schema cache')
  ) {
    // Table doesn't exist yet — return empty
    return NextResponse.json({ searches: [] });
  }

  if (error) {
    logger.error({ error: error.message }, 'Error listing search profiles');
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ searches: data || [] });
}

/**
 * POST /api/v1/searches — create a new search profile
 *
 * Body: { name: "Rockets in Texas", prompt: "I want to work on rockets in Texas" }
 *
 * This uses AI to blend the prompt with the user's resume, then generates
 * an embedding from the blended text for vector similarity search.
 */
export async function POST(request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, prompt } = body;

  if (!name || !prompt) {
    return NextResponse.json(
      { error: 'name and prompt are required' },
      { status: 400 }
    );
  }

  try {
    // Fetch the user's resume
    const res = await fetch(
      `https://registry.jsonresume.org/${user.username}.json`
    );
    if (!res.ok) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }
    const resume = await res.json();

    // Extract resume text
    const resumeText = [
      resume.basics?.label,
      resume.basics?.summary,
      ...(resume.skills || []).map(
        (s) => `${s.name}: ${(s.keywords || []).join(', ')}`
      ),
      ...(resume.work || []).map(
        (w) => `${w.position} at ${w.name}: ${w.summary || ''}`
      ),
    ]
      .filter(Boolean)
      .join('\n');

    // Use AI to blend the search prompt with the resume into an optimized
    // search profile text that will match well against job embeddings
    const { text: blendedText } = await generateText({
      model: openai('gpt-4o-mini'),
      system: `You are a job search optimizer. Given a candidate's resume and their search preferences, create a combined profile description that will be used for semantic similarity matching against job postings. Output ONLY the blended profile text — no explanations, no markdown. Focus on:
- The candidate's relevant skills and experience
- The specific role/industry/location they're seeking
- Technical keywords that would appear in matching job posts
Keep it under 500 words.`,
      prompt: `Resume:\n${resumeText}\n\nSearch preferences:\n${prompt}`,
      maxTokens: 600,
    });

    // Generate embedding from the blended text
    const { embedding } = await embed({
      model: openai.embedding('text-embedding-3-large'),
      value: blendedText,
    });

    // Store in database
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('search_profiles')
      .insert({
        user_id: user.username,
        name,
        prompt,
        embedding,
        filters: [],
      })
      .select('id, name, prompt, filters, created_at')
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ search: data }, { status: 201 });
  } catch (err) {
    logger.error({ error: err.message }, 'Error creating search profile');
    return NextResponse.json(
      { error: 'Failed to create search profile' },
      { status: 500 }
    );
  }
}
