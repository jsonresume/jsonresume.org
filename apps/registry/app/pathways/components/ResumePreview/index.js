'use client';

import HeaderSection from './HeaderSection';
import WorkSection from './WorkSection';
import EducationSection from './EducationSection';
import SkillsSection from './SkillsSection';
import AwardsSection from './AwardsSection';
import VolunteerSection from './VolunteerSection';
import PublicationsSection from './PublicationsSection';

export default function ResumePreview({ resumeData }) {
  if (!resumeData) return null;

  const { basics, work, education, skills, awards, publications, volunteer } =
    resumeData;

  return (
    <div className="min-h-full bg-white">
      <div className="max-w-4xl mx-auto p-8 lg:p-12">
        <HeaderSection basics={basics} />
        <WorkSection work={work} />
        <EducationSection education={education} />
        <SkillsSection skills={skills} />
        <AwardsSection awards={awards} />
        <VolunteerSection volunteer={volunteer} />
        <PublicationsSection publications={publications} />
      </div>
    </div>
  );
}
