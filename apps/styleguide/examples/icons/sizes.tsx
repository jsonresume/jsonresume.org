import { Stack, Text } from '@jsonresume/ui';
import { FileJson, Github, Palette } from 'lucide-react';

// Three sizes, one stroke width. Icons take the color of their text.
export default function IconSizes() {
  return (
    <Stack gap={4}>
      {[16, 20, 24].map((size) => (
        <Stack key={size} direction="row" gap={4} align="center">
          <Text as="span" size="xs" tone="muted" style={{ width: '3rem' }}>
            {size}px
          </Text>
          <FileJson size={size} strokeWidth={1.75} aria-hidden="true" />
          <Palette size={size} strokeWidth={1.75} aria-hidden="true" />
          <Github size={size} strokeWidth={1.75} aria-hidden="true" />
        </Stack>
      ))}
    </Stack>
  );
}
