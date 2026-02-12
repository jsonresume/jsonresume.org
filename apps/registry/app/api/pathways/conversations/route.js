import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  if (!process.env.SUPABASE_KEY) {
    throw new Error('SUPABASE_KEY environment variable is required');
  }
  return createClient(
    'https://itxuhvvwryeuzuyihpkp.supabase.co',
    process.env.SUPABASE_KEY
  );
}

export async function GET(request) {
  const supabase = getSupabase();
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    if (!sessionId && !userId) {
      return Response.json(
        { error: 'Either sessionId or userId is required' },
        { status: 400 }
      );
    }

    const query = supabase
      .from('pathways_conversations')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1);

    if (userId) {
      query.eq('user_id', userId);
    } else {
      query.eq('session_id', sessionId);
    }

    const { data, error } = await query.single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!data || !data.messages) {
      return Response.json({
        conversation: null,
        messages: [],
        total: 0,
        hasMore: false,
      });
    }

    // Messages are stored newest-last, so we need to slice from the end
    const allMessages = data.messages || [];
    const total = allMessages.length;

    // For pagination, we load from the end (most recent) and go backwards
    // offset 0 = most recent messages, offset 50 = older messages
    const startIdx = Math.max(0, total - offset - limit);
    const endIdx = Math.max(0, total - offset);
    const paginatedMessages = allMessages.slice(startIdx, endIdx);

    return Response.json({
      conversation: { ...data, messages: undefined }, // Don't send full messages
      messages: paginatedMessages,
      total,
      hasMore: startIdx > 0,
    });
  } catch (error) {
    console.error('Failed to load conversation:', error.message);
    return Response.json(
      { error: 'Failed to load conversation', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const supabase = getSupabase();
  try {
    const { sessionId, userId, messages, resumeSnapshot } =
      await request.json();

    if (!sessionId && !userId) {
      return Response.json(
        { error: 'Either sessionId or userId is required' },
        { status: 400 }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Cap stored messages to prevent unbounded growth
    const MAX_STORED_MESSAGES = 100;
    const trimmedMessages =
      messages.length > MAX_STORED_MESSAGES
        ? messages.slice(-MAX_STORED_MESSAGES)
        : messages;

    // Check for existing conversation
    const existingQuery = supabase
      .from('pathways_conversations')
      .select('id')
      .limit(1);

    if (userId) {
      existingQuery.eq('user_id', userId);
    } else {
      existingQuery.eq('session_id', sessionId);
    }

    const { data: existing } = await existingQuery.single();

    let result;
    if (existing) {
      // Update existing conversation
      const updateQuery = supabase
        .from('pathways_conversations')
        .update({
          messages: trimmedMessages,
          resume_snapshot: resumeSnapshot || null,
        })
        .eq('id', existing.id)
        .select()
        .single();

      result = await updateQuery;
    } else {
      // Insert new conversation
      const insertData = {
        messages: trimmedMessages,
        resume_snapshot: resumeSnapshot || null,
      };

      if (userId) {
        insertData.user_id = userId;
      } else {
        insertData.session_id = sessionId;
      }

      result = await supabase
        .from('pathways_conversations')
        .insert(insertData)
        .select()
        .single();
    }

    if (result.error) {
      throw result.error;
    }

    return Response.json({ conversation: result.data });
  } catch (error) {
    console.error('Failed to save conversation:', error.message);
    return Response.json(
      { error: 'Failed to save conversation', details: error.message },
      { status: 500 }
    );
  }
}

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

    const query = supabase.from('pathways_conversations').delete();

    if (userId) {
      query.eq('user_id', userId);
    } else {
      query.eq('session_id', sessionId);
    }

    const { error } = await query;

    if (error) {
      throw error;
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Failed to delete conversation:', error.message);
    return Response.json(
      { error: 'Failed to delete conversation', details: error.message },
      { status: 500 }
    );
  }
}
