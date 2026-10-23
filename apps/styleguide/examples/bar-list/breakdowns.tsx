import { BarList, Grid } from '@jsonresume/ui';

export default function BarListBreakdowns() {
  return (
    <Grid minColumnWidth="16rem" gap={8}>
      <BarList
        title="Top sources"
        itemLabel="Source"
        valueLabel="Views"
        items={[
          { label: 'Direct', value: 412 },
          { label: 'linkedin.com', value: 236, href: 'https://linkedin.com' },
          { label: 'github.com', value: 118, href: 'https://github.com' },
          { label: 'news.ycombinator.com', value: 64 },
          { label: 'google.com', value: 41 },
          { label: 'jsonresume.org', value: 22 },
          { label: 'x.com', value: 9 },
          { label: 'bing.com', value: 4 },
        ]}
      />
      <BarList
        title="Countries"
        itemLabel="Country"
        valueLabel="Visitors"
        items={[
          { label: 'Australia', value: 182 },
          { label: 'United States', value: 151 },
          { label: 'Germany', value: 47 },
          { label: 'United Kingdom', value: 39 },
        ]}
      />
    </Grid>
  );
}
