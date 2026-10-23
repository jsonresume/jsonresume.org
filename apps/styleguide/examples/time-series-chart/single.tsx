import { TimeSeriesChart } from '@jsonresume/ui';
import { resumeViews } from './data';

export default function TimeSeriesSingle() {
  return (
    <TimeSeriesChart
      title="Views per day"
      summary="Views rose from 12 to 68 a day, with dips at weekends."
      data={resumeViews.slice(-14)}
      series={[{ key: 'views', label: 'Views' }]}
      height={200}
    />
  );
}
