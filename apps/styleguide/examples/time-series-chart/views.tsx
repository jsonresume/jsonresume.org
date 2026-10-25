import { TimeSeriesChart } from '@jsonresume/ui';
import { resumeViews } from './data';

export default function TimeSeriesViews() {
  return (
    <TimeSeriesChart
      title="Views and visitors"
      summary="Views rose from 12 to 68 a day over 30 days, with visitors about three in four of them."
      data={resumeViews}
      series={[
        { key: 'views', label: 'Views' },
        { key: 'visitors', label: 'Visitors' },
      ]}
    />
  );
}
