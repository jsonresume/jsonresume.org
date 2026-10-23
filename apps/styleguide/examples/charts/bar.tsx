import { BarChart } from '@jsonresume/ui';

export default function ChartsBar() {
  return (
    <BarChart
      title="Applications by stage"
      summary="24 applications: most are at Applied, 2 reached an offer."
      data={[
        { label: 'Applied', value: 14 },
        { label: 'Screen', value: 5 },
        { label: 'Interview', value: 3 },
        { label: 'Offer', value: 2, highlight: true },
      ]}
    />
  );
}
