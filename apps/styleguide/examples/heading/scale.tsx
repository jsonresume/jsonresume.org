import { Heading, Stack } from '@jsonresume/ui';

export default function HeadingScale() {
  return (
    <Stack gap={4}>
      <Heading level={1} size="display">
        JSON Resume
      </Heading>
      <Heading level={2} size="title">
        Getting Started
      </Heading>
      <Heading level={3} size="section">
        What is this?
      </Heading>
      <Heading level={4} size="subsection">
        Command Line Tool
      </Heading>
      <Heading level={5} size="group">
        Exporting
      </Heading>
      <Heading level={6} size="label">
        Raw formats
      </Heading>
    </Stack>
  );
}
