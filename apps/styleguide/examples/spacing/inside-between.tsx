import {
  Badge,
  Button,
  Card,
  CardContent,
  CardTitle,
  Grid,
  Stack,
  Text,
} from '@jsonresume/ui';

// Tight inside, loose between: 2 (8px) between a title and its meta,
// 4 (16px) inside a card, 6 (24px) between cards.
export default function SpacingInsideBetween() {
  return (
    <Grid minColumnWidth="13rem" gap={6}>
      {['Pro', 'Even', 'Flat'].map((name) => (
        <Card key={name}>
          <CardContent>
            <Stack gap={4}>
              <Stack gap={2}>
                <CardTitle>{name}</CardTitle>
                <Text size="xs" tone="muted">
                  by JSON Resume Team
                </Text>
              </Stack>
              <Stack direction="row" gap={2}>
                <Badge>serif</Badge>
                <Badge>print</Badge>
              </Stack>
              <Button size="sm">Preview</Button>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Grid>
  );
}
