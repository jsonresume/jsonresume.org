'use client';

import { Button, Stack, Text, useReducedMotion } from '@jsonresume/ui';
import { motion, vars } from '@jsonresume/ui/tokens';
import { useState } from 'react';

const durations = Object.keys(motion.duration) as Array<
  keyof typeof motion.duration
>;

export default function MotionDurations() {
  const [moved, setMoved] = useState(false);
  const reduced = useReducedMotion();

  return (
    <Stack gap={4} style={{ width: '100%' }}>
      <Stack direction="row" gap={3} align="center">
        <Button variant="primary" onClick={() => setMoved((m) => !m)}>
          {moved ? 'Reset' : 'Play'}
        </Button>
        {reduced ? (
          <Text tone="muted">Reduced motion is on, so the boxes jump.</Text>
        ) : null}
      </Stack>
      {durations.map((name) => (
        <Stack key={name} direction="row" gap={4} align="center">
          <Text
            as="span"
            size="xs"
            tone="muted"
            style={{
              width: '12rem',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              fontFamily: vars.font.family.mono,
            }}
          >
            duration.{name} · {motion.duration[name]}
          </Text>
          <div style={{ flex: 1, height: '2rem', position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                insetBlock: 0,
                width: '2rem',
                borderRadius: vars.radius.sm,
                background: vars.color.action.primary,
                transform: moved
                  ? 'translateX(calc(min(24rem, 60vw)))'
                  : 'none',
                transition: reduced
                  ? 'none'
                  : `transform ${vars.motion.duration[name]} ${vars.motion.easing.standard}`,
              }}
            />
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
