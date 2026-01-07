import { User } from 'lucide-react';
import { getSkillLevelPercent } from './utils';

export default function SkillsSection({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <User className="w-6 h-6 text-indigo-600" />
        Skills
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900">{skill.name}</span>
              {skill.level && (
                <span className="text-sm text-gray-600">{skill.level}</span>
              )}
            </div>
            {skill.level && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getSkillLevelPercent(skill.level)}%` }}
                />
              </div>
            )}
            {skill.keywords && skill.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {skill.keywords.map((keyword, kidx) => (
                  <span
                    key={kidx}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
