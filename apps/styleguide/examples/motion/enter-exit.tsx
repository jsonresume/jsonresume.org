'use client';

import { Button, Callout, Stack } from '@jsonresume/ui';
import { useState } from 'react';
import * as styles from './enter-exit.css';

export default function MotionEnterExit() {
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={4}>
      <Button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="saved-note"
      >
        {open ? 'Hide note' : 'Show note'}
      </Button>
      <div id="saved-note" className={styles.note} data-open={open}>
        <Callout tone="success" title="Saved">
          Your resume was published to the registry.
        </Callout>
      </div>
    </Stack>
  );
}
