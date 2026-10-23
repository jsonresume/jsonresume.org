'use client';

import { Button, Stack } from '@jsonresume/ui';
import { motion, vars } from '@jsonresume/ui/tokens';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { useState } from 'react';
import * as styles from './durations.css';

const durations = Object.keys(motion.duration) as Array<
  keyof typeof motion.duration
>;

// Each row sets the duration variable; the stylesheet does the rest.
export default function MotionDurations() {
  const [moved, setMoved] = useState(false);
  return (
    <Stack gap={4} data-moved={moved}>
      <Button
        variant="primary"
        onClick={() => setMoved((m) => !m)}
        className={styles.start}
      >
        {moved ? 'Reset' : 'Play'}
      </Button>
      {durations.map((name) => (
        <div key={name} className={styles.row}>
          <span className={styles.label}>
            duration.{name} · {motion.duration[name]}
          </span>
          <div className={styles.track}>
            <div
              className={styles.box}
              style={assignInlineVars({
                [styles.duration]: vars.motion.duration[name],
              })}
            />
          </div>
        </div>
      ))}
    </Stack>
  );
}
