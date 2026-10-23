import { Card, CardContent, CardTitle, Grid, Text } from '@jsonresume/ui';

// Most things sit on the page (borders, no shadow). Only things that float
// above it get elevation.
export default function ShapeElevation() {
  return (
    <Grid minColumnWidth="12rem" gap={6} style={{ width: '100%' }}>
      <Card>
        <CardContent>
          <CardTitle>On the page</CardTitle>
          <Text size="xs" tone="muted">
            tone=&quot;outline&quot;: 1px border, no shadow. The default.
          </Text>
        </CardContent>
      </Card>
      <Card tone="subtle">
        <CardContent>
          <CardTitle>Grouped</CardTitle>
          <Text size="xs" tone="muted">
            tone=&quot;subtle&quot;: gray fill for secondary groups.
          </Text>
        </CardContent>
      </Card>
      <Card tone="raised">
        <CardContent>
          <CardTitle>Floating</CardTitle>
          <Text size="xs" tone="muted">
            tone=&quot;raised&quot;: shadow.md, for popovers and menus.
          </Text>
        </CardContent>
      </Card>
    </Grid>
  );
}
