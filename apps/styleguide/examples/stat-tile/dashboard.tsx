import { Grid, StatTile } from '@jsonresume/ui';

export default function StatTileDashboard() {
  return (
    <Grid minColumnWidth="11rem" gap={4}>
      <StatTile
        label="Applications"
        value={24}
        change={{ value: 12, period: 'vs last month' }}
      />
      <StatTile
        label="Interviews"
        value={5}
        change={{ value: 0, period: 'vs last month' }}
      />
      <StatTile
        label="Median salary"
        value="$165"
        unit="k"
        note="For your top 5 skills"
      />
      <StatTile
        label="Days to reply"
        value={9}
        change={{
          value: -3,
          period: 'faster',
          format: (n) => `${Math.abs(n)} days`,
        }}
        lowerIsBetter
      />
    </Grid>
  );
}
