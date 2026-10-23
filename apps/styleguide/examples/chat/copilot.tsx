'use client';

import {
  ChatComposer,
  ChatMessage,
  ChatMessages,
  ChatToolCall,
  Markdown,
  Stack,
} from '@jsonresume/ui';
import { useState } from 'react';
import * as styles from './copilot.css';

interface Turn {
  role: 'user' | 'assistant';
  text: string;
}

export default function ChatCopilot() {
  const [turns, setTurns] = useState<Turn[]>([
    { role: 'user', text: 'Add Rust to my skills.' },
    {
      role: 'assistant',
      text: 'Done. I added **Rust** under *Backend*. Want me to mention it in your summary too?',
    },
  ]);
  const [pending, setPending] = useState(false);
  return (
    <Stack gap={3} className={styles.root}>
      <ChatMessages
        label="Copilot conversation"
        scrollKey={turns.length + Number(pending)}
        className={styles.log}
      >
        {turns.map((t, i) =>
          t.role === 'user' ? (
            <ChatMessage key={i} role="user">
              {t.text}
            </ChatMessage>
          ) : (
            <ChatMessage key={i} role="assistant" author="Copilot">
              {i === 1 ? (
                <ChatToolCall
                  name="update_resume"
                  status="done"
                  summary="skills +1"
                  details={'{ "skills.backend": ["Rust"] }'}
                />
              ) : null}
              <Markdown>{t.text}</Markdown>
            </ChatMessage>
          )
        )}
        {pending ? (
          <ChatMessage role="assistant" author="Copilot" pending />
        ) : null}
      </ChatMessages>
      <ChatComposer
        busy={pending}
        onSubmit={(text) => {
          setTurns((all) => [...all, { role: 'user', text }]);
          setPending(true);
          setTimeout(() => {
            setPending(false);
            setTurns((all) => [
              ...all,
              {
                role: 'assistant',
                text: 'Good idea. I can draft that for you.',
              },
            ]);
          }, 1200);
        }}
      />
    </Stack>
  );
}
