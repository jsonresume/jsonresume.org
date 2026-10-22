import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { getSessionUserId } from '@/lib/sessionUser';
import { getSupabase } from '../supabase';

const DEFAULTS = {
  filterText: '',
  showSalaryGradient: false,
  remoteOnly: false,
  hideFiltered: false,
  timeRange: '1m',
  viewport: { x: 0, y: 0, zoom: 1 },
};

const unauthorized = () =>
  NextResponse.json({ error: 'Sign in required' }, { status: 401 });

/**
 * GET /api/pathways/preferences
 * Load the signed-in user's Pathways graph preferences
 */
export async function GET(request) {
  const userId = await getSessionUserId(request);
  if (!userId) return unauthorized();

  try {
    const { data, error } = await getSupabase()
      .from('pathways_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json(DEFAULTS);

    return NextResponse.json({
      filterText: data.filter_text || '',
      showSalaryGradient: data.show_salary_gradient || false,
      remoteOnly: data.remote_only || false,
      hideFiltered: data.hide_filtered || false,
      timeRange: data.time_range || '1m',
      viewport: {
        x: data.viewport_x || 0,
        y: data.viewport_y || 0,
        zoom: data.viewport_zoom || 1,
      },
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error loading preferences');
    return NextResponse.json(
      { error: 'Failed to load preferences' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pathways/preferences
 * Save the signed-in user's Pathways graph preferences
 */
export async function POST(request) {
  const userId = await getSessionUserId(request);
  if (!userId) return unauthorized();

  try {
    const {
      filterText,
      showSalaryGradient,
      remoteOnly,
      hideFiltered,
      timeRange,
      viewport,
    } = await request.json();

    const { error } = await getSupabase()
      .from('pathways_preferences')
      .upsert(
        {
          user_id: userId,
          filter_text: filterText || '',
          show_salary_gradient: showSalaryGradient || false,
          remote_only: remoteOnly || false,
          hide_filtered: hideFiltered || false,
          time_range: timeRange || '1m',
          viewport_x: viewport?.x || 0,
          viewport_y: viewport?.y || 0,
          viewport_zoom: viewport?.zoom || 1,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error({ error: error.message }, 'Error saving preferences');
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
}
