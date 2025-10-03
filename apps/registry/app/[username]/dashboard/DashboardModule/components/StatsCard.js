import { BarChart } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

/**
 * Statistics card component
 * @param {Object} metrics - Dashboard metrics
 */
export function StatsCard({ metrics }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <BarChart className="w-5 h-5 mr-2" />
          Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Total Jobs</p>
          <p className="text-2xl font-bold">{metrics.totalJobs}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Avg Job Duration</p>
          <p className="text-2xl font-bold">
            {`${metrics.averageJobDuration.years}y ${metrics.averageJobDuration.months}m`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
