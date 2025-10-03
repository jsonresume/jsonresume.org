import { CheckCircle } from 'lucide-react';

export const DescriptionSection = ({ description }) => {
  if (!description) return null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">About This Role</h2>
      <div
        className="text-gray-600"
        dangerouslySetInnerHTML={{
          __html: description.replace(/\n/g, '<br />'),
        }}
      />
    </div>
  );
};

export const ResponsibilitiesSection = ({ responsibilities }) => {
  if (!responsibilities || responsibilities.length === 0) return null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Key Responsibilities</h2>
      <ul className="space-y-2">
        {responsibilities.map((resp, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">{resp}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const RequirementsSection = ({ requirements }) => {
  if (!requirements || requirements.length === 0) return null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Requirements</h2>
      <ul className="space-y-2">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">{req}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

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

export const ExperienceSection = ({ experience }) => {
  if (!experience) return null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Experience Level</h2>
      <p className="text-gray-600">{experience}</p>
    </div>
  );
};

export const BenefitsSection = ({ benefits }) => {
  if (!benefits || benefits.length === 0) return null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Benefits & Perks</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((benefit, index) => (
          <li
            key={index}
            className="flex items-center bg-gray-50 rounded-lg p-3"
          >
            <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            <span className="text-gray-600">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const CultureSection = ({ culture }) => {
  if (!culture) return null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Company Culture</h2>
      <p className="text-gray-600">{culture}</p>
    </div>
  );
};

export const AdditionalSection = ({ additional }) => {
  if (!additional) return null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
      <p className="text-gray-600">{additional}</p>
    </div>
  );
};
