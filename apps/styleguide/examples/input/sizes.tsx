import { Input, Stack } from '@jsonresume/ui';

export default function InputSizes() {
  return (
    <Stack gap={3} style={{ width: 'min(100%, 28rem)' }}>
      <Input size="sm" aria-label="Small" placeholder="Small" />
      <Input aria-label="Medium" placeholder="Medium" />
      <Input
        size="lg"
        type="search"
        aria-label="Search the docs"
        placeholder="Search the docs"
      />
    </Stack>
  );
}
