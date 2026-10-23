import {
  Button,
  Card,
  CardContent,
  CardTitle,
  Link,
  Stack,
  Text,
} from '@jsonresume/ui';

// Hover and focus changes use duration.base (250ms) on color and border
// only. Hover these, then Tab through them.
export default function MotionInteraction() {
  return (
    <Stack direction="row" gap={6} align="center" wrap>
      <Button>Hover me</Button>
      <Button variant="primary">And me</Button>
      <Link href="#motion">A link</Link>
      <Card interactive style={{ width: '12rem' }}>
        <CardContent>
          <CardTitle>Interactive card</CardTitle>
          <Text size="xs" tone="muted">
            The border darkens on hover.
          </Text>
        </CardContent>
      </Card>
    </Stack>
  );
}
