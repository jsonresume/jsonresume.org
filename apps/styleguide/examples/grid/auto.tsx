import { Card, CardContent, Grid } from '@jsonresume/ui';

export default function GridAuto() {
  return (
    <Grid minColumnWidth="10rem" gap={4}>
      {['Even', 'Pro', 'Elegant', 'Flat', 'Kendall', 'Macchiato'].map(
        (name) => (
          <Card key={name} tone="subtle">
            <CardContent>{name}</CardContent>
          </Card>
        )
      )}
    </Grid>
  );
}
