import { Grid, StatTile } from '@jsonresume/ui';

export default function StatTileDeltaTrend() {
  return (
    <Grid minColumnWidth="12rem" gap={4}>
      <StatTile
        label="Views"
        value="1,284"
        delta={{ value: 0.24, label: 'vs previous 30 days' }}
        trend={[22, 31, 28, 35, 41, 38, 52, 49, 61, 68]}
      />
      <StatTile
        label="Visitors"
        value="903"
        delta={{ value: 0.18, label: 'vs previous 30 days' }}
        trend={[16, 22, 20, 25, 30, 27, 37, 35, 44, 49]}
      />
      <StatTile
        label="Median time on page"
        value="1m 12s"
        delta={{ value: -0.06, label: 'vs previous 30 days' }}
      />
      <StatTile
        label="Bounced"
        value="31%"
        delta={{
          value: -0.08,
          label: 'vs previous 30 days',
          positiveIsGood: false,
        }}
      />
    </Grid>
  );
}
