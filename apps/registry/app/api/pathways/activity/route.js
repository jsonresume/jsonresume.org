import { getSupabase } from '../supabase';
import { logger } from '@/lib/logger';

// GET - Fetch activity history with pagination
export async function GET(request) {
  const supabase = getSupabase();
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');
    const activityType = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    if (!sessionId && !userId) {
      return Response.json(
        { error: 'Either sessionId or userId is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('pathways_activity_log')
      .select('*', { count: 'exact' })
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);

    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.eq('session_id', sessionId);
    }

    if (activityType) {
      query = query.eq('activity_type', activityType);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return Response.json({
      activities: data || [],
      total: count || 0,
      hasMore: offset + limit < (count || 0),
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to fetch activities');
    return Response.json(
      { error: 'Failed to fetch activities', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Log a new activity
export async function POST(request) {
  const supabase = getSupabase();
  try {
    const { sessionId, userId, activityType, details } = await request.json();

    if (!sessionId && !userId) {
      return Response.json(
        { error: 'Either sessionId or userId is required' },
        { status: 400 }
      );
    }

    if (!activityType) {
      return Response.json(
        { error: 'activityType is required' },
        { status: 400 }
      );
    }

    const insertData = {
      activity_type: activityType,
      details: details || {},
    };

    if (userId) {
      insertData.user_id = userId;
    } else {
      insertData.session_id = sessionId;
    }

    const { data, error } = await supabase
      .from('pathways_activity_log')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return Response.json({ activity: data });
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to log activity');
    return Response.json(
      { error: 'Failed to log activity', details: error.message },
      { status: 500 }
    );
  }
}

// POST batch - Log multiple activities at once
export async function PUT(request) {
  const supabase = getSupabase();
  try {
    const { sessionId, userId, activities } = await request.json();

    if (!sessionId && !userId) {
      return Response.json(
        { error: 'Either sessionId or userId is required' },
        { status: 400 }
      );
    }

    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      return Response.json(
        { error: 'activities array is required' },
        { status: 400 }
      );
    }

    const insertData = activities.map((activity) => ({
      activity_type: activity.activityType,
      details: activity.details || {},
      ...(userId ? { user_id: userId } : { session_id: sessionId }),
    }));

    const { data, error } = await supabase
      .from('pathways_activity_log')
      .insert(insertData)
      .select();

    if (error) {
      throw error;
    }

    return Response.json({ activities: data });
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to log activities');
    return Response.json(
      { error: 'Failed to log activities', details: error.message },
      { status: 500 }
    );
  }
}
