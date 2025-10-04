'use client';

import { motion } from 'framer-motion';
import { JobHeader } from '../../JobDetailModule/components/JobHeader';
import {
  DescriptionSection,
  ResponsibilitiesSection,
  RequirementsSection,
  SkillsSection,
  ExperienceSection,
  BenefitsSection,
  CultureSection,
  AdditionalSection,
} from '../../JobDetailModule/components/JobSections';
import { ApplySection } from '../../JobDetailModule/components/ApplySection';

export const JobContent = ({
  gptContent,
  locationString,
  salary,
  postedDate,
  job,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm p-8 mb-8"
    >
      <JobHeader
        title={gptContent.title}
        company={gptContent.company}
        locationString={locationString}
        salary={salary}
        postedDate={postedDate}
        jobType={gptContent.type}
      />

      <div className="prose max-w-none">
        <div className="space-y-8">
          <DescriptionSection description={gptContent.description} />
          <ResponsibilitiesSection
            responsibilities={gptContent.responsibilities}
          />
          <RequirementsSection requirements={gptContent.requirements} />
          <SkillsSection skills={gptContent.skills} />
          <ExperienceSection experience={gptContent.experience} />
          <BenefitsSection benefits={gptContent.benefits} />
          <CultureSection culture={gptContent.culture} />
          <AdditionalSection additional={gptContent.additional} />
        </div>
      </div>

      <ApplySection
        jobUrl={job.url}
        contactEmail={job.contact_email}
        jobTitle={gptContent.title}
      />
    </motion.div>
  );
};
