'use client';

import { VolunteerSection } from './EducationSection/VolunteerSection';
import { EducationFields } from './EducationSection/EducationFields';

export const EducationSection = ({ resume, handlers }) => {
  return (
    <>
      <VolunteerSection resume={resume} handlers={handlers} />
      <EducationFields resume={resume} handlers={handlers} />
    </>
  );
};
