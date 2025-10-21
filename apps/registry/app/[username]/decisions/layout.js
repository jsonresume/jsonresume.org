/**
 * Decisions Feature Layout
 * Standalone fullscreen layout (no standard navigation)
 * Authenticated: requires login to access
 */

export default function DecisionsLayout({ children }) {
  // Standalone layout - no nav, no header, fullscreen
  return (
    <div className="w-full h-screen overflow-hidden bg-slate-50">
      {children}
    </div>
  );
}
