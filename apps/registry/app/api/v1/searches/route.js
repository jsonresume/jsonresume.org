import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { embed, generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { authenticate } from '../auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const PROMPT_WEIGHT = 0.65;

function getSupabase() {
  return createClient(supabaseUrl, process.env.SUPABASE_KEY);
}

function extractResumeText(resume) {
  return [
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
}

/** Normalize a vector to unit length */
function normalize(vec) {
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  if (norm === 0) return vec;
  return vec.map((v) => v / norm);
}

/** Weighted interpolation of two vectors, normalized */
function interpolate(vecA, vecB, alpha) {
  const blended = vecA.map((v, i) => alpha * v + (1 - alpha) * vecB[i]);
  return normalize(blended);
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
 * Uses two techniques to make the prompt actually matter:
 *
 * 1. HyDE (Hypothetical Document Embedding): Instead of blending prompt
 *    into resume text, we generate a hypothetical ideal job posting that
 *    matches the user's preferences. This creates a document-to-document
 *    comparison with job embeddings (much more effective).
 *
 * 2. Embedding interpolation: We embed the resume and the HyDE job posting
 *    separately, then combine vectors with α=0.65 weighting toward the
 *    prompt. This gives the search intent real influence on rankings.
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
    const res = await fetch(
      `https://registry.jsonresume.org/${user.username}.json`
    );
    if (!res.ok) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }
    const resume = await res.json();
    const resumeText = extractResumeText(resume);

    // Step 1: HyDE — generate a hypothetical ideal job posting
    const { text: hydeJobPosting } = await generateText({
      model: openai('gpt-4.1-mini'),
      system: `You are a job posting generator. Given a candidate's background and what they're looking for, write a realistic job posting that would be their IDEAL match. Write it exactly like a real HN "Who is Hiring" post. Include: company description, role title, tech stack, requirements, location, salary range, and remote policy. Output ONLY the job posting text — no markdown, no explanations. Make it specific and keyword-rich.`,
      prompt: `Candidate background:\n${resumeText}\n\nWhat they're looking for:\n${prompt}`,
      maxTokens: 500,
    });

    // Step 2: Embed both separately
    const [resumeResult, hydeResult] = await Promise.all([
      embed({
        model: openai.embedding('text-embedding-3-large'),
        value: resumeText,
      }),
      embed({
        model: openai.embedding('text-embedding-3-large'),
        value: hydeJobPosting,
      }),
    ]);

    // Step 3: Interpolate with prompt-heavy weighting
    const embedding = interpolate(
      hydeResult.embedding,
      resumeResult.embedding,
      PROMPT_WEIGHT
    );

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
