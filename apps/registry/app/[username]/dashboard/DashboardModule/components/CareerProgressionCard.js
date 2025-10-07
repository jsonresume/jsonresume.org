import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Progress } from '@repo/ui';

/**
 * Career progression card component
 * @param {Array} careerProgression - Career progression data
 */
export function CareerProgressionCard({ careerProgression }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Career Progression
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {careerProgression.map((job, index) => (
            <div key={index} className="flex items-center">
              <div className="w-1/3">
                <p className="font-semibold">{job.title}</p>
                <p className="text-sm text-gray-500">
                  {job.duration.years} years {job.duration.months} months
                </p>
              </div>
              <div className="w-2/3">
                <Progress
                  value={
                    (parseInt(job.duration.years) +
                      parseInt(job.duration.months / 12)) *
                    5
                  }
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
