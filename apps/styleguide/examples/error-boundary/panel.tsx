'use client';

import {
  Button,
  Card,
  CardContent,
  ErrorBoundary,
  Stack,
  Text,
} from '@jsonresume/ui';
import { useState } from 'react';

function Salary({ broken }: { broken: boolean }) {
  if (broken) throw new Error('salary.median is undefined');
  return <Text>Median salary for your skills: $165k</Text>;
}

// Only the broken panel is replaced; the rest of the page keeps working.
export default function ErrorBoundaryPanel() {
  const [broken, setBroken] = useState(false);
  return (
    <Stack gap={3} align="start">
      <Button variant="danger" onClick={() => setBroken(true)}>
        Break this panel
      </Button>
      <Card>
        <CardContent>
          <ErrorBoundary
            resetKeys={[broken]}
            fallback={(error, reset) => (
              <Stack gap={2} align="start">
                <Text weight="semibold">The salary panel failed to load.</Text>
                <Text size="xs" tone="muted">
                  {error.message}
                </Text>
                <Button
                  size="sm"
                  onClick={() => {
                    setBroken(false);
                    reset();
                  }}
                >
                  Try again
                </Button>
              </Stack>
            )}
          >
            <Salary broken={broken} />
          </ErrorBoundary>
        </CardContent>
      </Card>
    </Stack>
  );
}
