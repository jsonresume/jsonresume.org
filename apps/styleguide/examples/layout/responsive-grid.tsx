'use client';

import { Card, CardContent, Grid, Stack, Text } from '@jsonresume/ui';
import { vars } from '@jsonresume/ui/tokens';
import { useId, useState } from 'react';

// Grid fits as many 10rem columns as the space allows: drag the slider to
// see it reflow with no breakpoints.
export default function LayoutResponsiveGrid() {
  const [width, setWidth] = useState(100);
  const id = useId();
  return (
    <Stack gap={4} style={{ width: '100%' }}>
      <Stack direction="row" gap={3} align="center">
        <label htmlFor={id}>
          <Text as="span" size="xs" tone="muted">
            Container width: {width}%
          </Text>
        </label>
        <input
          id={id}
          type="range"
          min={30}
          max={100}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
      </Stack>
      <div
        style={{
          width: `${width}%`,
          outline: `1px dashed ${vars.color.border.strong}`,
          padding: vars.space[2],
        }}
      >
        <Grid minColumnWidth="10rem" gap={4}>
          {Array.from({ length: 6 }, (_, i) => (
            <Card key={i} tone="subtle">
              <CardContent>Theme {i + 1}</CardContent>
            </Card>
          ))}
        </Grid>
      </div>
    </Stack>
  );
}
