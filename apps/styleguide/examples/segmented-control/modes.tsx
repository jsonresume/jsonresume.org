'use client';

import { SegmentedControl, Stack, Text } from '@jsonresume/ui';
import { Braces, FormInput, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function SegmentedControlModes() {
  const [mode, setMode] = useState('form');
  return (
    <Stack gap={3}>
      <SegmentedControl
        label="Editor mode"
        value={mode}
        onValueChange={setMode}
        options={[
          { value: 'form', label: 'Form', icon: <FormInput /> },
          { value: 'json', label: 'JSON', icon: <Braces /> },
          { value: 'ai', label: 'AI', icon: <Sparkles /> },
        ]}
      />
      <Text size="xs" tone="muted">
        Editing in {mode.toUpperCase()} mode.
      </Text>
    </Stack>
  );
}
