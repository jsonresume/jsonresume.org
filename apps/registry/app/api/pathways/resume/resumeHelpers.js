import applyResumeChanges from '@/app/pathways/utils/applyResumeChanges';
import { logger } from '@/lib/logger';

/**
 * Build a Supabase query filtered by userId or sessionId
 */
export function buildUserQuery(supabase, table, { userId, sessionId }) {
  const query = supabase.from(table).select('*').limit(1);
  if (userId) {
    query.eq('user_id', userId);
  } else {
    query.eq('session_id', sessionId);
  }
  return query;
}

/**
 * Build insert data with correct user/session identifier
 */
export function buildInsertData(data, { userId, sessionId }) {
  if (userId) return { ...data, user_id: userId };
  return { ...data, session_id: sessionId };
}

/**
 * Validate that either sessionId or userId is provided
 */
export function validateIdentifier({ sessionId, userId }) {
  if (!sessionId && !userId) {
    return Response.json(
      { error: 'Either sessionId or userId is required' },
      { status: 400 }
    );
  }
  return null;
}

/**
 * Handle PATCH: apply diff to existing resume or create new one
 */
export async function applyResumePatch(supabase, params) {
  const { sessionId, userId, diff, explanation, source, replace } = params;

  // Fetch existing resume
  const existingQuery = buildUserQuery(supabase, 'pathways_resumes', {
    userId,
    sessionId,
  });
  const { data: existing, error: fetchError } = await existingQuery.single();

  // Handle case where resume doesn't exist yet — create with diff as initial data
  if (fetchError && fetchError.code === 'PGRST116') {
    return createResumeWithHistory(supabase, {
      resume: diff,
      userId,
      sessionId,
      diff,
      explanation,
      source,
    });
  }

  if (fetchError) throw fetchError;

  // Apply diff or replace entirely
  const updatedResume = replace
    ? diff
    : applyResumeChanges(existing.resume || {}, diff);

  const { data: updated, error: updateError } = await supabase
    .from('pathways_resumes')
    .update({ resume: updatedResume })
    .eq('id', existing.id)
    .select()
    .single();

  if (updateError) throw updateError;

  // Save to history
  await saveHistory(supabase, {
    resumeId: existing.id,
    userId,
    sessionId,
    diff,
    explanation,
    source,
  });

  return Response.json({ resume: updated, created: false });
}

/**
 * Create a new resume and save the initial diff to history
 */
async function createResumeWithHistory(supabase, params) {
  const { resume, userId, sessionId, diff, explanation, source } = params;

  const insertData = buildInsertData({ resume }, { userId, sessionId });
  const { data: newResume, error: insertError } = await supabase
    .from('pathways_resumes')
    .insert(insertData)
    .select()
    .single();

  if (insertError) throw insertError;

  await saveHistory(supabase, {
    resumeId: newResume.id,
    userId,
    sessionId,
    diff,
    explanation,
    source,
  });

  return Response.json({ resume: newResume, created: true });
}

/**
 * Save a change entry to pathways_resume_history
 */
async function saveHistory(supabase, params) {
  const { resumeId, userId, sessionId, diff, explanation, source } = params;

  const historyData = buildInsertData(
    {
      resume_id: resumeId,
      diff,
      explanation: explanation || null,
      source,
    },
    { userId, sessionId }
  );

  await supabase.from('pathways_resume_history').insert(historyData);
}
