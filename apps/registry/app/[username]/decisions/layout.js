/**
 * Decisions Feature Layout
 * Fullscreen layout with top nav (no sidebar)
 * Uses PUBLIC_PAGES bypass in ProfileLayout
 */

import { ResumeProvider } from '../../providers/ResumeProvider';

export default function DecisionsLayout({ children, params }) {
  const { username } = params;

  return (
    <ResumeProvider targetUsername={username}>
      <div className="w-full h-screen overflow-hidden bg-slate-50">
        {children}
      </div>
    </ResumeProvider>
  );
}
