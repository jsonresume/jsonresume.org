/**
 * Decisions Feature Layout
 * Standalone fullscreen layout (no standard navigation)
 * Authenticated: requires login to access
 */

import { auth } from '../../../auth';
import { redirect } from 'next/navigation';

export default async function DecisionsLayout({ children, params }) {
  const session = await auth();
  const { username } = params;

  // Require authentication
  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  // Verify user is accessing their own decisions page
  const githubUsername = session.user.name?.toLowerCase();
  if (githubUsername !== username.toLowerCase()) {
    redirect(`/decisions/${githubUsername}`);
  }

  // Standalone layout - no nav, no header, fullscreen
  return (
    <div className="w-full h-screen overflow-hidden bg-slate-50">
      {children}
    </div>
  );
}
