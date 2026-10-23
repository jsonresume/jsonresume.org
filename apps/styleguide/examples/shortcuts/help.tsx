'use client';

import { Kbd, ShortcutHelp, Text, useShortcut } from '@jsonresume/ui';
import { useState } from 'react';

// Press ? anywhere on this page to open the help. J and K move between jobs.
export default function ShortcutsHelp() {
  const [job, setJob] = useState(1);
  useShortcut('j', () => setJob((n) => Math.min(n + 1, 20)));
  useShortcut('k', () => setJob((n) => Math.max(n - 1, 1)));
  return (
    <>
      <Text>
        Viewing job {job} of 20. Press <Kbd>J</Kbd> / <Kbd>K</Kbd> to move,{' '}
        <Kbd>?</Kbd> for all shortcuts.
      </Text>
      <ShortcutHelp
        groups={[
          {
            title: 'Jobs graph',
            shortcuts: [
              { keys: 'j', description: 'Next job' },
              { keys: 'k', description: 'Previous job' },
              { keys: 'mod+k', description: 'Search jobs' },
            ],
          },
          {
            title: 'General',
            shortcuts: [{ keys: '?', description: 'Show this help' }],
          },
        ]}
      />
    </>
  );
}
