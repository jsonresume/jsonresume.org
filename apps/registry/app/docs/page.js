import { DocHeader } from './components/DocHeader.jsx';
import { OverviewSection } from './components/OverviewSection.jsx';
import { ResumeEndpoint } from './components/ResumeEndpoint.jsx';
import { JobsEndpoint } from './components/JobsEndpoint.jsx';
import { LegacyJobsEndpoint } from './components/LegacyJobsEndpoint.jsx';
import { ATSEndpoint } from './components/ATSEndpoint.jsx';

export default function Docs() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-8">
            <div className="prose prose-blue max-w-none">
              <DocHeader />
              <OverviewSection />
              <ResumeEndpoint />
              <JobsEndpoint />
              <ATSEndpoint />
              <LegacyJobsEndpoint />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
