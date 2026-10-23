'use client';

import { Callout, useReducedMotion } from '@jsonresume/ui';

/** Explains why the demos on this page don't move, when that's the case. */
export function ReducedMotionNotice() {
  const reduced = useReducedMotion();
  if (!reduced) return null;
  return (
    <Callout tone="warning" title="Your system asks for reduced motion">
      So the demos on this page jump straight to their end state, and hover
      colors change instantly. That is the system working as designed. To see
      the motion, turn off “Reduce motion” in your operating system’s
      accessibility settings and reload.
    </Callout>
  );
}
