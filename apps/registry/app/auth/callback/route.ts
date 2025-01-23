import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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
      console.error('Auth callback error:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${error.message}`
      );
    }

    if (session) {
      // Get GitHub user data
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        console.error('Error getting user data:', userError);
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
        console.error('Error updating user metadata:', updateError);
      }
    }
  }

  return NextResponse.redirect(requestUrl.origin);
}
