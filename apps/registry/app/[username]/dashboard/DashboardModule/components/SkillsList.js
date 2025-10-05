import { Badge } from '@repo/ui';

/**
 * Skills list component with categories and keywords
 * @param {Array} skills - Array of skill objects
 */
export function SkillsList({ skills }) {
  if (!skills || skills.length === 0) {
    return <p>No skills listed.</p>;
  }

  return (
    <div className="space-y-4">
      {skills.map((skill, index) => (
        <div key={index} className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
          {skill.level && (
            <p className="text-sm text-gray-600 mb-2">Level: {skill.level}</p>
          )}
          {skill.keywords && skill.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skill.keywords.map((keyword, keywordIndex) => (
                <Badge key={keywordIndex} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
