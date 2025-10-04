export const SkillsSection = ({ skills }) => {
  if (!skills || skills.length === 0) return null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
      <div className="space-y-4">
        {skills.map((skillGroup, index) => (
          <div key={index}>
            {skillGroup.name && (
              <h3 className="font-medium text-gray-700 mb-2">
                {skillGroup.name}
              </h3>
            )}
            <div className="flex flex-wrap gap-2">
              {(skillGroup.keywords || []).map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
