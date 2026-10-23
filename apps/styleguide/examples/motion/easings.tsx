'use client';

import { Button, Stack, Text } from '@jsonresume/ui';
import { vars } from '@jsonresume/ui/tokens';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { useState } from 'react';
import * as styles from './easings.css';

const curves = [
  {
    label: 'easing.standard',
    value: vars.motion.easing.standard,
    use: 'Things that move or change state',
  },
  {
    label: 'easing.out',
    value: vars.motion.easing.out,
    use: 'Things that enter the screen',
  },
  {
    label: 'linear (avoid)',
    value: 'linear',
    use: 'Only spinners and progress',
  },
];

export default function MotionEasings() {
  const [moved, setMoved] = useState(false);
  return (
    <Stack gap={4} data-moved={moved}>
      <Button
        variant="primary"
        onClick={() => setMoved((m) => !m)}
        className={styles.start}
      >
        {moved ? 'Reset' : 'Compare'}
      </Button>
      {curves.map((curve) => (
        <Stack key={curve.label} gap={1}>
          <Text size="xs" tone="muted">
            <strong>{curve.label}</strong> · {curve.use}
          </Text>
          <div className={styles.track}>
            <div
              className={styles.box}
              style={assignInlineVars({ [styles.easing]: curve.value })}
            />
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
