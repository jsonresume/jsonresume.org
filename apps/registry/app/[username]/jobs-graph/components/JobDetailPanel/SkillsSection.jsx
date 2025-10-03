import { highlightText } from '../../utils/textUtils';

export function SkillsSection({ skills, filterText }) {
  if (!skills || skills.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900 mb-2">Skills</h4>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
          >
            {filterText ? highlightText(skill.name, filterText) : skill.name}
            {skill.level && (
              <span className="ml-1 text-gray-400">
                •{' '}
                {filterText
                  ? highlightText(skill.level, filterText)
                  : skill.level}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
