import { ScoringTable } from './ScoringTable';
import { BestPractices } from './BestPractices';
import { RequestExample, ResponseExample, UsageExample } from './CodeExamples';
import { RatingScale, SeverityLevels } from './Ratings';

export const ATSEndpoint = () => {
  return (
    <section id="ats" className="mt-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        ATS Compatibility Analysis
      </h2>
      <p className="text-gray-600 mb-6">
        Analyze your resume for Applicant Tracking System (ATS) compatibility.
        Get a detailed score, recommendations, and insights to improve your
        resume's chances of passing through automated screening systems.
      </p>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        Endpoint
      </h3>
      <div className="bg-gray-900 rounded-lg p-4 mb-4">
        <code className="text-green-400 text-sm">POST /api/ats</code>
      </div>

      <RequestExample />
      <ResponseExample />
      <ScoringTable />
      <RatingScale />
      <SeverityLevels />
      <BestPractices />
      <UsageExample />

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        View Your ATS Score
      </h3>
      <p className="text-gray-600 mb-4">
        Visit{' '}
        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
          https://registry.jsonresume.org/[username]/ats
        </code>{' '}
        to see a detailed visual breakdown of your resume's ATS compatibility
        with actionable recommendations.
      </p>
    </section>
  );
};
