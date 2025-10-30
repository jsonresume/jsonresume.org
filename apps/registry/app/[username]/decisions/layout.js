/**
 * Decisions Feature Layout
 * Fullscreen layout with top nav (no sidebar)
 * Uses PUBLIC_PAGES bypass in ProfileLayout
 * Uses PublicResumeProvider for unauthenticated access
 */

import { use } from 'react';
import { PublicResumeProvider } from '../../providers/PublicResumeProvider';

export default function DecisionsLayout({ children, params }) {
  const { username } = use(params);

  return (
    <PublicResumeProvider username={username}>
      <div className="w-full overflow-hidden bg-slate-50">{children}</div>
    </PublicResumeProvider>
  );
}
