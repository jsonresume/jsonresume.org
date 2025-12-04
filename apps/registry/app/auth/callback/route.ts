import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { notifyUserSignup } from '@/lib/discord/notifiers';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Exchange code for session
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      logger.error({ error: error.message, code }, 'Auth callback error');
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${error.message}`
      );
    }

    if (session) {
      // Get GitHub user data
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        logger.error({ error: userError.message }, 'Error getting user data');
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=Failed to get user data`
        );
      }

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          username: userData.user.user_metadata.user_name,
          avatar_url: userData.user.user_metadata.avatar_url,
          provider: 'github',
          provider_id: userData.user.user_metadata.sub,
        },
      });

      if (updateError) {
        logger.error(
          {
            error: updateError.message,
            username: userData.user.user_metadata.user_name,
          },
          'Error updating user metadata'
        );
      } else {
        // Notify Discord of new user signup
        const username = userData.user.user_metadata.user_name;
        const avatarUrl = userData.user.user_metadata.avatar_url;

        try {
          await notifyUserSignup(username, 'github', avatarUrl);
          logger.debug(
            { username },
            'Discord notification sent for user signup'
          );
        } catch (discordError) {
          // Don't fail the auth flow if Discord notification fails
          logger.error(
            {
              error:
                discordError instanceof Error
                  ? discordError.message
                  : 'Unknown error',
              username,
            },
            'Failed to send Discord signup notification'
          );
        }
      }
    }
  }

  return NextResponse.redirect(requestUrl.origin);
}
