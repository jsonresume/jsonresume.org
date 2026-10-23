import { Link, Stack, Text } from '@jsonresume/ui';

export default function LinkTones() {
  return (
    <Stack gap={3}>
      <Text>
        Read the <Link href="https://jsonresume.org/schema">schema</Link> before
        you start.
      </Text>
      <Text>
        <Link tone="neutral" href="https://jsonresume.org/themes">
          Browse themes
        </Link>
      </Text>
      <Text>
        <Link href="https://github.com/jsonresume" external>
          JSON Resume on GitHub
        </Link>
      </Text>
    </Stack>
  );
}
