'use client';

import { Card, CardContent, Grid, Stack, Text } from '@jsonresume/ui';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { useId, useState } from 'react';
import * as styles from './responsive-grid.css';

// Grid fits as many 10rem columns as the space allows: drag the slider to
// see it reflow with no breakpoints.
export default function LayoutResponsiveGrid() {
  const [percent, setPercent] = useState(100);
  const id = useId();
  return (
    <Stack gap={4}>
      <Stack direction="row" gap={3} align="center">
        <label htmlFor={id}>
          <Text as="span" size="xs" tone="muted">
            Container width: {percent}%
          </Text>
        </label>
        <input
          id={id}
          type="range"
          min={30}
          max={100}
          value={percent}
          onChange={(e) => setPercent(Number(e.target.value))}
        />
      </Stack>
      <div
        className={styles.frame}
        style={assignInlineVars({ [styles.width]: `${percent}%` })}
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
