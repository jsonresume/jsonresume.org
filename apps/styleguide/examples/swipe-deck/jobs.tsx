'use client';

import { Badge, Stack, SwipeDeck, Text } from '@jsonresume/ui';
import { useState } from 'react';
import * as styles from './jobs.css';

const jobs = [
  {
    id: 1,
    title: 'Senior Engineer',
    company: 'Stripe',
    salary: '$180k–$220k',
    tags: ['Go', 'Kafka'],
  },
  {
    id: 2,
    title: 'Staff Frontend Engineer',
    company: 'Vercel',
    salary: '$200k+',
    tags: ['React', 'Next.js'],
  },
  {
    id: 3,
    title: 'Platform Engineer',
    company: 'Fly.io',
    salary: '$170k',
    tags: ['Rust', 'Linux'],
  },
];

export default function SwipeDeckJobs() {
  const [log, setLog] = useState<string[]>([]);
  return (
    <Stack gap={4} align="center" className={styles.root}>
      <SwipeDeck
        items={jobs}
        itemLabel={(j) => `${j.title} at ${j.company}`}
        onDecision={(j, d) =>
          setLog((l) => [`${d === 'right' ? '✓' : '✕'} ${j.company}`, ...l])
        }
        renderCard={(j) => (
          <Stack gap={3} className={styles.card}>
            <Text caps tone="muted">
              {j.company}
            </Text>
            <Text size="lg" weight="semibold">
              {j.title}
            </Text>
            <Text tone="muted">{j.salary}</Text>
            <Stack direction="row" gap={2}>
              {j.tags.map((t) => (
                <Badge key={t} tone="outline">
                  {t}
                </Badge>
              ))}
            </Stack>
          </Stack>
        )}
        emptyState="You're all caught up. New matches arrive daily."
      />
      <Text size="xs" tone="muted">
        {log.join('  ') ||
          'Drag a card, use the buttons, or focus the deck and press ← / →.'}
      </Text>
    </Stack>
  );
}
