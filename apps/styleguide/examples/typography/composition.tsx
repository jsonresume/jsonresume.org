import { Heading, Link, Stack, Text } from '@jsonresume/ui';

// A docs page opening: overline, light title, lede, body, link.
export default function TypographyComposition() {
  return (
    <Stack gap={3}>
      <Text caps tone="muted">
        Getting started
      </Text>
      <Heading level={2} size="title">
        Command Line Tool
      </Heading>
      <Text size="md" tone="muted" measure>
        We&apos;ve built a CLI that runs on macOS, Linux and Windows. Use it to
        validate, export and serve your resume.
      </Text>
      <Text measure>
        Install it globally with npm, then run it from the folder that holds
        your resume.json. Every theme on the{' '}
        <Link href="#typography">theme gallery</Link> works with it.
      </Text>
    </Stack>
  );
}
