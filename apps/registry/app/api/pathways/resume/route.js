import { createClient } from '@supabase/supabase-js';
import applyResumeChanges from '@/app/pathways/utils/applyResumeChanges';

function getSupabase() {
  if (!process.env.SUPABASE_KEY) {
    throw new Error('SUPABASE_KEY environment variable is required');
  }
  return createClient(
    'https://itxuhvvwryeuzuyihpkp.supabase.co',
    process.env.SUPABASE_KEY
  );
}

/**
 * GET - Fetch resume for user or session
 */
export async function GET(request) {
  const supabase = getSupabase();
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');

    if (!sessionId && !userId) {
      return Response.json(
        { error: 'Either sessionId or userId is required' },
        { status: 400 }
      );
    }

    const query = supabase.from('pathways_resumes').select('*').limit(1);

    if (userId) {
      query.eq('user_id', userId);
    } else {
      query.eq('session_id', sessionId);
    }

    const { data, error } = await query.single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return Response.json({ resume: data || null });
  } catch (error) {
    console.error('Failed to load resume:', error.message);
    return Response.json(
      { error: 'Failed to load resume', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST - Create initial resume
 */
export async function POST(request) {
  const supabase = getSupabase();
  try {
    const { sessionId, userId, resume } = await request.json();

    if (!sessionId && !userId) {
      return Response.json(
        { error: 'Either sessionId or userId is required' },
        { status: 400 }
      );
    }

    const insertData = {
      resume: resume || {},
    };

    if (userId) {
      insertData.user_id = userId;
    } else {
      insertData.session_id = sessionId;
    }

    const { data, error } = await supabase
      .from('pathways_resumes')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return Response.json({ resume: data });
  } catch (error) {
    console.error('Failed to create resume:', error.message);
    return Response.json(
      { error: 'Failed to create resume', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Apply diff to resume and save to history
 * If replace=true, replaces entire resume instead of merging
 */
export async function PATCH(request) {
  const supabase = getSupabase();
  try {
    const { sessionId, userId, diff, explanation, source, replace } =
      await request.json();

    if (!sessionId && !userId) {
      return Response.json(
        { error: 'Either sessionId or userId is required' },
        { status: 400 }
      );
    }

    if (!diff || typeof diff !== 'object') {
      return Response.json(
        { error: 'diff object is required' },
        { status: 400 }
      );
    }

    if (!source) {
      return Response.json({ error: 'source is required' }, { status: 400 });
    }

    // Fetch existing resume
    const existingQuery = supabase
      .from('pathways_resumes')
      .select('*')
      .limit(1);

    if (userId) {
      existingQuery.eq('user_id', userId);
    } else {
      existingQuery.eq('session_id', sessionId);
    }

    const { data: existing, error: fetchError } = await existingQuery.single();

    // Handle case where resume doesn't exist yet
    if (fetchError && fetchError.code === 'PGRST116') {
      // Create new resume with the diff as initial data
      const insertData = {
        resume: diff,
      };
      if (userId) {
        insertData.user_id = userId;
      } else {
        insertData.session_id = sessionId;
      }

      const { data: newResume, error: insertError } = await supabase
        .from('pathways_resumes')
        .insert(insertData)
        .select()
        .single();

      if (insertError) throw insertError;

      // Save to history
      const historyData = {
        resume_id: newResume.id,
        diff,
        explanation: explanation || null,
        source,
      };
      if (userId) {
        historyData.user_id = userId;
      } else {
        historyData.session_id = sessionId;
      }

      await supabase.from('pathways_resume_history').insert(historyData);

      return Response.json({ resume: newResume, created: true });
    }

    if (fetchError) throw fetchError;

    // Apply diff to existing resume, or replace entirely if replace=true
    const updatedResume = replace
      ? diff
      : applyResumeChanges(existing.resume || {}, diff);

    // Update resume
    const { data: updated, error: updateError } = await supabase
      .from('pathways_resumes')
      .update({ resume: updatedResume })
      .eq('id', existing.id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Save to history
    const historyData = {
      resume_id: existing.id,
      diff,
      explanation: explanation || null,
      source,
    };
    if (userId) {
      historyData.user_id = userId;
    } else {
      historyData.session_id = sessionId;
    }

    await supabase.from('pathways_resume_history').insert(historyData);

    return Response.json({ resume: updated, created: false });
  } catch (error) {
    console.error('Failed to update resume:', error.message);
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

    if (!sessionId && !userId) {
      return Response.json(
        { error: 'Either sessionId or userId is required' },
        { status: 400 }
      );
    }

    const query = supabase.from('pathways_resumes').delete();

    if (userId) {
      query.eq('user_id', userId);
    } else {
      query.eq('session_id', sessionId);
    }

    const { error } = await query;

    if (error) throw error;

    // History is cascade deleted via foreign key

    return Response.json({ success: true });
  } catch (error) {
    console.error('Failed to delete resume:', error.message);
    return Response.json(
      { error: 'Failed to delete resume', details: error.message },
      { status: 500 }
    );
  }
}
