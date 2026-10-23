'use client';

import { Text, VirtualList } from '@jsonresume/ui';
import * as styles from './log.css';

const events = Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  text: `Matched job #${5000 - i} against your resume`,
  score: 40 + ((i * 37) % 60),
}));

// 5,000 rows; only the visible ones are in the DOM.
export default function VirtualListLog() {
  return (
    <div className={styles.frame}>
      <VirtualList
        label="Match log"
        height="18rem"
        estimateSize={44}
        items={events}
        getKey={(e) => e.id}
        renderItem={(e) => (
          <div className={styles.row}>
            <Text size="sm">{e.text}</Text>
            <Text size="xs" tone="muted">
              {e.score}% match
            </Text>
          </div>
        )}
      />
    </div>
  );
}
