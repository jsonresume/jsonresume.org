import { Code, Kbd, Text } from '@jsonresume/ui';

export default function InlineCode() {
  return (
    <Text>
      Install with <Code>npm install -g resume-cli</Code>, then press{' '}
      <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd> to stop the server.
    </Text>
  );
}
