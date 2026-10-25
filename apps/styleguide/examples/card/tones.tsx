import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Grid,
} from '@jsonresume/ui';

export default function CardTones() {
  return (
    <Grid minColumnWidth="12rem" gap={4}>
      {(['outline', 'subtle', 'raised', 'danger'] as const).map((tone) => (
        <Card key={tone} tone={tone}>
          <CardHeader>
            <CardTitle>{tone}</CardTitle>
            <CardDescription>tone=&quot;{tone}&quot;</CardDescription>
          </CardHeader>
          <CardContent>Cards hold one idea each.</CardContent>
        </Card>
      ))}
    </Grid>
  );
}
