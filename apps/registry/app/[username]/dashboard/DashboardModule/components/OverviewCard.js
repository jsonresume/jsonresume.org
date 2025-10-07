import { Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';

/**
 * Overview metrics card component
 * @param {Object} metrics - Dashboard metrics
 */
export function OverviewCard({ metrics }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Briefcase className="w-5 h-5 mr-2" />
          Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Total Experience</p>
          <p className="text-2xl font-bold">
            {metrics.totalExperience.years} y {metrics.totalExperience.months} m
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Projects</p>
          <p className="text-2xl font-bold">{metrics.totalProjects}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Skills</p>
          <p className="text-2xl font-bold">{metrics.totalSkills}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Certifications</p>
          <p className="text-2xl font-bold">
            {metrics.totalCertifications ?? 0}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
