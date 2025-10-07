import { Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { SkillsList } from './SkillsList';

/**
 * Skills card component with SkillsList
 * @param {Array} skills - Array of skills
 */
export function SkillsCard({ skills }) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Code className="w-5 h-5 mr-2" />
          Skills
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SkillsList skills={skills} />
      </CardContent>
    </Card>
  );
}
