import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import logger from '@/lib/logger';

const SUPABASE_URL = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

/**
 * DELETE /api/privacy/delete-cache
 * Deletes cached resume data from Supabase for the authenticated user
 */
export async function DELETE(request: Request) {
  try {
    // Verify user authentication via Supabase Auth
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session) {
      logger.warn('Unauthorized cache deletion attempt');
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to delete your cached data.' },
        { status: 401 }
      );
    }

    // Get GitHub username from user metadata
    const username = session.user.user_metadata?.user_name;

    if (!username) {
      logger.error(
        { userId: session.user.id },
        'User session missing GitHub username'
      );
      return NextResponse.json(
        { error: 'Unable to determine GitHub username from session' },
        { status: 400 }
      );
    }

    // Create admin client for deletion
    const supabaseKey = process.env.SUPABASE_KEY;
    if (!supabaseKey) {
      logger.error('SUPABASE_KEY environment variable not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const adminClient = createClient(SUPABASE_URL, supabaseKey);

    // Delete cached resume data
    const { error: deleteError, count } = await adminClient
      .from('resumes')
      .delete({ count: 'exact' })
      .eq('username', username);

    if (deleteError) {
      logger.error(
        { error: deleteError.message, username },
        'Failed to delete cached resume'
      );
      return NextResponse.json(
        { error: 'Failed to delete cached data' },
        { status: 500 }
      );
    }

    logger.info(
      { username, deletedCount: count || 0 },
      'Successfully deleted cached resume data'
    );

    return NextResponse.json({
      success: true,
      message: 'Cached resume data deleted successfully',
      deletedCount: count || 0,
      username,
    });
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      'Unexpected error during cache deletion'
    );

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
