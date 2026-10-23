import { Card, CardContent, Grid, Stack, Text } from '@jsonresume/ui';

// Default (auto-fill) keeps column widths steady and leaves empty tracks;
// stretch (auto-fit) lets a few items fill the row.
export default function GridStretch() {
  return (
    <Stack gap={4} style={{ width: '100%' }}>
      <Text size="xs" tone="muted">
        Default
      </Text>
      <Grid minColumnWidth="10rem" gap={4}>
        <Card tone="subtle">
          <CardContent>One</CardContent>
        </Card>
        <Card tone="subtle">
          <CardContent>Two</CardContent>
        </Card>
      </Grid>
      <Text size="xs" tone="muted">
        stretch
      </Text>
      <Grid minColumnWidth="10rem" gap={4} stretch>
        <Card tone="subtle">
          <CardContent>One</CardContent>
        </Card>
        <Card tone="subtle">
          <CardContent>Two</CardContent>
        </Card>
      </Grid>
    </Stack>
  );
}
