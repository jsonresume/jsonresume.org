'use client';

import { ChipGroup } from '@jsonresume/ui';
import { useState } from 'react';

export default function ChipGroupFilter() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <ChipGroup
      label="Category"
      allLabel="All"
      value={value}
      onValueChange={setValue}
      options={[
        { value: 'cli', label: 'Command-line tools', count: 5 },
        { value: 'editor', label: 'Editors', count: 2 },
        { value: 'ai', label: 'AI', count: 3 },
      ]}
    />
  );
}
