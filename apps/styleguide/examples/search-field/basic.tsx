'use client';

import { Field, SearchField, Stack, Text } from '@jsonresume/ui';
import { useState } from 'react';
import * as styles from './basic.css';

export default function SearchFieldBasic() {
  const [query, setQuery] = useState('');
  return (
    <Stack gap={3} className={styles.root}>
      <Field label="Search jobs">
        <SearchField
          placeholder="Title, company or skill"
          onSearch={setQuery}
        />
      </Field>
      <Text size="xs" tone="muted" aria-live="polite">
        {query
          ? `Searching for “${query}”`
          : 'Type to search; results update when you pause.'}
      </Text>
    </Stack>
  );
}
