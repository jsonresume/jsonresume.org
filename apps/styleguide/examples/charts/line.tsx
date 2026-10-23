import { LineChart } from '@jsonresume/ui';

export default function ChartsLine() {
  return (
    <LineChart
      title="Weekly job matches"
      summary="Matches grew from 8 to 21 over six weeks; strong matches doubled."
      labels={['W1', 'W2', 'W3', 'W4', 'W5', 'W6']}
      series={[
        { name: 'All matches', values: [8, 11, 10, 15, 18, 21] },
        { name: 'Strong matches', values: [3, 4, 4, 5, 6, 7] },
      ]}
    />
  );
}
