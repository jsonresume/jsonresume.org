import { TimeSeriesChart } from '@jsonresume/ui';
import { resumeViews } from './data';

export default function TimeSeriesEmpty() {
  return (
    <TimeSeriesChart
      title="Views per day"
      summary="No views in the last 7 days."
      data={resumeViews.slice(-7).map((d) => ({ ...d, values: { views: 0 } }))}
      series={[{ key: 'views', label: 'Views' }]}
      height={180}
      emptyLabel="No views in the last 7 days"
    />
  );
}
