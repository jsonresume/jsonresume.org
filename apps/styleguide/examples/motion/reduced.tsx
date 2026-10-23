'use client';

import {
  Badge,
  Callout,
  Code,
  Stack,
  Text,
  useReducedMotion,
} from '@jsonresume/ui';

export default function MotionReduced() {
  const reduced = useReducedMotion();
  return (
    <Stack gap={3}>
      <Text>
        Your system preference:{' '}
        <Badge tone={reduced ? 'warning' : 'neutral'}>
          {reduced ? 'reduce motion' : 'no preference'}
        </Badge>
      </Text>
      <Callout title="Two layers of protection">
        CSS motion inside the <Code>base</Code> class drops to near zero
        automatically. For motion you drive from JavaScript, read{' '}
        <Code>useReducedMotion()</Code> and skip the animation.
      </Callout>
    </Stack>
  );
}
