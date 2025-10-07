import { GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';

/**
 * Education card component
 * @param {string} educationLevel - Highest education level
 */
export function EducationCard({ educationLevel }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <GraduationCap className="w-5 h-5 mr-2" />
          Education
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{educationLevel}</p>
        <p className="text-sm text-gray-500">Highest Degree Achieved</p>
      </CardContent>
    </Card>
  );
}
