import { Skeleton, Spinner, Stack } from '@jsonresume/ui';

export default function Loading() {
  return (
    <Stack direction="row" gap={8} align="center" wrap>
      <Spinner label="Loading themes" />
      <Stack gap={2} style={{ width: '16rem' }} aria-busy="true">
        <Skeleton height="1.25rem" width="60%" />
        <Skeleton />
        <Skeleton width="85%" />
      </Stack>
    </Stack>
  );
}
