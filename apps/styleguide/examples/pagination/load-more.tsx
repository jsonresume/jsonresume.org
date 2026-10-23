'use client';

import { LoadMore, Stack, Text } from '@jsonresume/ui';
import { useState } from 'react';

export default function PaginationLoadMore() {
  const [shown, setShown] = useState(20);
  const [loading, setLoading] = useState(false);
  return (
    <Stack gap={3}>
      <Text tone="muted">{shown} jobs listed above…</Text>
      <LoadMore
        shown={shown}
        total={64}
        loading={loading}
        onLoadMore={() => {
          setLoading(true);
          setTimeout(() => {
            setShown((n) => Math.min(n + 20, 64));
            setLoading(false);
          }, 600);
        }}
      />
    </Stack>
  );
}
