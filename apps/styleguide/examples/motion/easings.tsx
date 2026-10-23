'use client';

import { Button, Stack, Text, useReducedMotion } from '@jsonresume/ui';
import { vars } from '@jsonresume/ui/tokens';
import { useState } from 'react';

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
  const reduced = useReducedMotion();

  return (
    <Stack gap={4} style={{ width: '100%' }}>
      <Button
        variant="primary"
        onClick={() => setMoved((m) => !m)}
        style={{ alignSelf: 'flex-start' }}
      >
        {moved ? 'Reset' : 'Compare'}
      </Button>
      {curves.map((curve) => (
        <Stack key={curve.label} gap={1}>
          <Text size="xs" tone="muted">
            <strong>{curve.label}</strong> · {curve.use}
          </Text>
          <div
            style={{
              height: '1.5rem',
              position: 'relative',
              background: vars.color.surface.subtle,
            }}
          >
            <div
              style={{
                position: 'absolute',
                insetBlock: 0,
                width: '1.5rem',
                background: vars.color.action.ink,
                transform: moved
                  ? 'translateX(calc(min(30rem, 70vw)))'
                  : 'none',
                // A slow duration so the curve is visible; real UI uses base.
                transition: reduced ? 'none' : `transform 900ms ${curve.value}`,
              }}
            />
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
