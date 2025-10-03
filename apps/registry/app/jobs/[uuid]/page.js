'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import MatchingCandidates from '../components/MatchingCandidates';
import { useJobData } from '../JobDetailModule/hooks/useJobData';
import {
  parseGptContent,
  formatLocation,
  formatSalary,
  formatDate,
} from '../JobDetailModule/utils/jobFormatters';
import { LoadingState } from '../JobDetailModule/components/LoadingState';
import { NotFoundState } from '../JobDetailModule/components/NotFoundState';
import { JobHeader } from '../JobDetailModule/components/JobHeader';
import {
  DescriptionSection,
  ResponsibilitiesSection,
  RequirementsSection,
  SkillsSection,
  ExperienceSection,
  BenefitsSection,
  CultureSection,
  AdditionalSection,
} from '../JobDetailModule/components/JobSections';
import { ApplySection } from '../JobDetailModule/components/ApplySection';

export default function JobPage({ params }) {
  const router = useRouter();
  const { job, loading } = useJobData(params.uuid);

  if (loading) {
    return <LoadingState />;
  }

  if (!job) {
    return <NotFoundState onBack={() => router.push('/jobs')} />;
  }

  const gptContent = parseGptContent(job);
  const locationString = formatLocation(gptContent.location);
  const salary = formatSalary(gptContent.salary);
  const postedDate = formatDate(job.created_at);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => router.push('/jobs')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </button>

          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
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
          </div>

          <MatchingCandidates jobId={params.uuid} />
        </motion.div>
      </div>
    </div>
  );
}
