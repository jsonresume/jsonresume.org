import { Stack, Text } from '@jsonresume/ui';

const copy =
  'JSON Resume is a community driven open-source initiative to create a JSON-based standard for resumes. We believe the strengths of the JSON format make it a good fit for resumes: it is lightweight, easy to read, and easy to build tools for.';

// Keep running text to about 72 characters per line. Wider lines make the
// eye lose its place when it returns to the start of the next line.
export default function TypographyMeasure() {
  return (
    <Stack gap={6}>
      <Stack gap={1}>
        <Text caps tone="muted">
          Do: measure
        </Text>
        <Text size="md" measure>
          {copy}
        </Text>
      </Stack>
      <Stack gap={1}>
        <Text caps tone="muted">
          Don&apos;t: full width
        </Text>
        <Text size="md">{copy}</Text>
      </Stack>
    </Stack>
  );
}
