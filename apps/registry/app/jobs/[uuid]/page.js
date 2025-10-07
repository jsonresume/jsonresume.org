'use client';

import { useRouter } from 'next/navigation';
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
import { BackButton } from './components/BackButton';
import { JobContent } from './components/JobContent';

export default function JobPage({ params }) {
  const router = useRouter();
  const { job, loading } = useJobData(params.uuid);

  if (loading) return <LoadingState />;
  if (!job) return <NotFoundState onBack={() => router.push('/jobs')} />;

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
          <BackButton onClick={() => router.push('/jobs')} />
          <JobContent
            gptContent={gptContent}
            locationString={locationString}
            salary={salary}
            postedDate={postedDate}
            job={job}
          />
          <MatchingCandidates jobId={params.uuid} />
        </motion.div>
      </div>
    </div>
  );
}
