'use client';

import {
  SkillsFormSection,
  LanguagesSection,
  InterestsSection,
  ReferencesSection,
  ProjectsSection,
} from './SkillsSections';

export const SkillsSection = ({ resume, handlers }) => {
  return (
    <>
      <SkillsFormSection skills={resume.skills} handlers={handlers} />
      <LanguagesSection languages={resume.languages} handlers={handlers} />
      <InterestsSection interests={resume.interests} handlers={handlers} />
      <ReferencesSection references={resume.references} handlers={handlers} />
      <ProjectsSection projects={resume.projects} handlers={handlers} />
    </>
  );
};
