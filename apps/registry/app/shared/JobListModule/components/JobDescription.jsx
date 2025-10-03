import React, { useState } from 'react';
import { JobHeader } from './JobHeader';
import { JobDescriptionText } from './JobDescriptionText';
import { ResponsibilitiesList } from './ResponsibilitiesList';
import { QualificationsList } from './QualificationsList';
import { SkillsList } from './SkillsList';
import { JobActions } from './JobActions';

export function JobDescription({ job, makeCoverletter }) {
  const [expanded, setExpanded] = useState(false);
  console.log({ job });

  return (
    <div
      className="p-6 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105 cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <JobHeader job={job} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 mt-2">
        <JobDescriptionText description={job.description} expanded={expanded} />
      </div>

      {expanded && (
        <div className="mt-4">
          <ResponsibilitiesList responsibilities={job.responsibilities} />
          <QualificationsList qualifications={job.qualifications} />
          <SkillsList skills={job.skills} />
          <JobActions job={job} makeCoverletter={makeCoverletter} />
        </div>
      )}
    </div>
  );
}
