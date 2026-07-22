import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from '@/lib/supabaseConfig';
import { embed, generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { authenticate } from '../auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const supabaseUrl = SUPABASE_URL;
// Prompt-steered blend weights (see POST handler): the HyDE doc carries the
// detail, the raw prompt anchors intent, the resume keeps a small seniority
// pull. Previous 0.65 hyde / 0.35 resume blend was prompt-blind because the
// HyDE doc itself echoed the resume.
const HYDE_WEIGHT = 0.5;
const PROMPT_WEIGHT = 0.3;
const RESUME_WEIGHT = 0.2;

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

/** Weighted sum of N [vector, weight] pairs, normalized */
function weightedBlend(pairs) {
  const usable = pairs.filter(([v]) => Array.isArray(v) && v.length > 0);
  if (usable.length === 0) return null;
  const out = new Array(usable[0][0].length).fill(0);
  for (const [vec, weight] of usable) {
    for (let i = 0; i < out.length; i++) {
      out[i] += weight * vec[i];
    }
  }
  return normalize(out);
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

    // Step 1: HyDE — generate a hypothetical ideal job posting, PROMPT-FIRST.
    // The 2026-07 eval found search profiles prompt-blind at retrieval: three
    // radically different prompts overlapped 16-17/20 because the HyDE doc
    // was dominated by the resume. The prompt is now the primary spec and the
    // resume only calibrates seniority; generation runs at temperature 0.
    const { text: hydeJobPosting } = await generateText({
      model: openai('gpt-4.1-mini'),
      temperature: 0,
      system: `You are a job posting generator. The candidate has described the SPECIFIC kind of role they want — that description is your primary spec. Write a realistic job posting for exactly that role, exactly like a real HN "Who is Hiring" post: company description, role title, tech stack, requirements, location, salary range, remote policy. Use the candidate's background ONLY to calibrate seniority and salary — do NOT default to their current stack or job title if the description points elsewhere. Output ONLY the job posting text — no markdown, no explanations. Make it specific and keyword-rich for the DESCRIBED role.`,
      prompt: `The role they want:\n${prompt}\n\nBackground (for seniority calibration only):\n${resumeText}`,
      maxTokens: 500,
    });

    // Step 2: Embed the HyDE doc, the raw prompt, and the resume separately
    const [resumeResult, hydeResult, promptResult] = await Promise.all([
      embed({
        model: openai.embedding('text-embedding-3-large'),
        value: resumeText,
      }),
      embed({
        model: openai.embedding('text-embedding-3-large'),
        value: hydeJobPosting,
      }),
      embed({
        model: openai.embedding('text-embedding-3-large'),
        value: prompt,
      }),
    ]);

    // Step 3: prompt-steered blend — HyDE doc carries the detail, the raw
    // prompt embedding anchors intent, the resume keeps a small pull toward
    // the candidate's actual level.
    const embedding = weightedBlend([
      [hydeResult.embedding, HYDE_WEIGHT],
      [promptResult.embedding, PROMPT_WEIGHT],
      [resumeResult.embedding, RESUME_WEIGHT],
    ]);

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
