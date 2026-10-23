'use client';

import { Button, ChatComposer, Stack, Text } from '@jsonresume/ui';
import { Mic } from 'lucide-react';
import { useState } from 'react';

export default function ChatComposerCopilot() {
  const [sent, setSent] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  return (
    <Stack gap={3}>
      {sent.map((m, i) => (
        <Text key={i} tone="muted" size="xs">
          You: {m}
        </Text>
      ))}
      <ChatComposer
        busy={busy}
        hint="Enter to send · Shift+Enter for a new line"
        actions={
          <Button variant="ghost" size="icon" aria-label="Speak your message">
            <Mic aria-hidden="true" />
          </Button>
        }
        onSubmit={(m) => {
          setSent((all) => [...all, m]);
          setBusy(true);
          setTimeout(() => setBusy(false), 1200);
        }}
      />
    </Stack>
  );
}
