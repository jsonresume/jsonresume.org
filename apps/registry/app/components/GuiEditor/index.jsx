'use client';

import { useResumeUpdates } from './useResumeUpdates';
import { BasicsSection } from './BasicsSection';
import { WorkSection } from './WorkSection';
import { EducationSection } from './EducationSection';
import { SkillsSection } from './SkillsSection';
import { AccomplishmentsSection } from './AccomplishmentsSection';

export default function GuiEditor({ resume, onChange }) {
  const handlers = useResumeUpdates(resume, onChange);

  return (
    <div className="h-full overflow-auto p-4">
      <BasicsSection resume={resume} handlers={handlers} />
      <WorkSection resume={resume} handlers={handlers} />
      <EducationSection resume={resume} handlers={handlers} />
      <SkillsSection resume={resume} handlers={handlers} />
      <AccomplishmentsSection resume={resume} handlers={handlers} />
    </div>
  );
}
