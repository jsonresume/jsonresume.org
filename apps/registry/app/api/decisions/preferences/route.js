import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

/**
 * GET - Fetch user's job evaluation preferences
 */
export async function GET(request) {
  if (!process.env.SUPABASE_KEY) {
    return NextResponse.json(
      { message: 'API not available during build' },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { message: 'userId is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

    const { data, error } = await supabase
      .from('job_evaluation_preferences')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST - Save/update user's job evaluation preferences
 */
export async function POST(request) {
  if (!process.env.SUPABASE_KEY) {
    return NextResponse.json(
      { message: 'API not available during build' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { userId, criterion, enabled, value } = body;

    // Validation
    if (!userId || !criterion) {
      return NextResponse.json(
        { message: 'userId and criterion are required' },
        { status: 400 }
      );
    }

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { message: 'enabled must be a boolean' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

    // Upsert the preference
    const { data, error } = await supabase
      .from('job_evaluation_preferences')
      .upsert(
        {
          user_id: userId,
          criterion: criterion,
          enabled: enabled,
          value: value || {},
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,criterion' }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error saving preference:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
