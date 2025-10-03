import { Star } from 'lucide-react';

export function SkillsList({ skills }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-3 text-gray-800">Skills</h2>
      {skills?.length ? (
        skills.map((skill, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              {skill.name}
            </h3>
            <div className="flex items-center mb-2">
              <Star className="w-5 h-5 mr-2 text-warning-500" />
              <span>{skill.level}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {skill.keywords?.length ? (
                skill.keywords.map((keyword, kidx) => (
                  <span
                    key={kidx}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))
              ) : (
                <p>Not available</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>Not available</p>
      )}
    </div>
  );
}
