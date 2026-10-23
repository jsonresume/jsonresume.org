'use client';

import { Pagination, Text, Stack } from '@jsonresume/ui';
import { useState } from 'react';

export default function PaginationPages() {
  const [page, setPage] = useState(5);
  return (
    <Stack gap={3}>
      <Pagination page={page} pageCount={12} onPageChange={setPage} />
      <Text size="xs" tone="muted">
        Page {page} of 12. Pass href instead of onPageChange to render links.
      </Text>
    </Stack>
  );
}
