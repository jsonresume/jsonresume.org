import { getSupabase } from '../supabase';
import { logger } from '@/lib/logger';
import {
  buildUserQuery,
  buildInsertData,
  validateIdentifier,
  applyResumePatch,
} from './resumeHelpers';

/**
 * GET - Fetch resume for user or session
 */
export async function GET(request) {
  const supabase = getSupabase();
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');

    const invalid = validateIdentifier({ sessionId, userId });
    if (invalid) return invalid;

    const query = buildUserQuery(supabase, 'pathways_resumes', {
      userId,
      sessionId,
    });
    const { data, error } = await query.single();

    if (error && error.code !== 'PGRST116') throw error;

    return Response.json({ resume: data || null });
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to load resume');
    return Response.json(
      { error: 'Failed to load resume', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST - Create initial resume or handle sendBeacon save-on-unload.
 * If diff + replace + source are provided, delegates to PATCH logic.
 */
export async function POST(request) {
  const supabase = getSupabase();
  try {
    const body = await request.json();
    const { sessionId, userId, resume, diff, replace, source, explanation } =
      body;

    // Handle sendBeacon save-on-unload (POST with diff + replace)
    if (diff && replace && source) {
      return applyResumePatch(supabase, {
        sessionId,
        userId,
        diff,
        replace,
        source,
        explanation,
      });
    }

    const invalid = validateIdentifier({ sessionId, userId });
    if (invalid) return invalid;

    const insertData = buildInsertData(
      { resume: resume || {} },
      { userId, sessionId }
    );

    const { data, error } = await supabase
      .from('pathways_resumes')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    return Response.json({ resume: data });
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to create resume');
    return Response.json(
      { error: 'Failed to create resume', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Apply diff to resume and save to history
 */
export async function PATCH(request) {
  const supabase = getSupabase();
  try {
    const { sessionId, userId, diff, explanation, source, replace } =
      await request.json();

    const invalid = validateIdentifier({ sessionId, userId });
    if (invalid) return invalid;

    if (!diff || typeof diff !== 'object') {
      return Response.json(
        { error: 'diff object is required' },
        { status: 400 }
      );
    }
    if (!source) {
      return Response.json({ error: 'source is required' }, { status: 400 });
    }

    return applyResumePatch(supabase, {
      sessionId,
      userId,
      diff,
      explanation,
      source,
      replace,
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to update resume');
    return Response.json(
      { error: 'Failed to update resume', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Remove resume and all history
 */
export async function DELETE(request) {
  const supabase = getSupabase();
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');

    const invalid = validateIdentifier({ sessionId, userId });
    if (invalid) return invalid;

    const query = supabase.from('pathways_resumes').delete();
    if (userId) {
      query.eq('user_id', userId);
    } else {
      query.eq('session_id', sessionId);
    }

    const { error } = await query;
    if (error) throw error;

    return Response.json({ success: true });
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to delete resume');
    return Response.json(
      { error: 'Failed to delete resume', details: error.message },
      { status: 500 }
    );
  }
}
