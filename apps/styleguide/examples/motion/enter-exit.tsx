'use client';

import { Button, Callout, Stack, useReducedMotion } from '@jsonresume/ui';
import { vars } from '@jsonresume/ui/tokens';
import { useState } from 'react';

// Enter with easing.out (fast start, gentle stop); fade and rise 8px.
// Only opacity and transform change, so nothing reflows.
export default function MotionEnterExit() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <Stack gap={4} style={{ width: 'min(100%, 28rem)' }}>
      <Button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="saved-note"
      >
        {open ? 'Hide note' : 'Show note'}
      </Button>
      <div
        id="saved-note"
        style={{
          opacity: open ? 1 : 0,
          transform: open || reduced ? 'none' : 'translateY(8px)',
          visibility: open ? 'visible' : 'hidden',
          transition: reduced
            ? 'none'
            : `opacity ${vars.motion.duration.base} ${vars.motion.easing.out}, transform ${vars.motion.duration.base} ${vars.motion.easing.out}, visibility ${vars.motion.duration.base}`,
        }}
      >
        <Callout tone="success" title="Saved">
          Your resume was published to the registry.
        </Callout>
      </div>
    </Stack>
  );
}
