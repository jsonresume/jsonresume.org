import { DocHeader } from './components/DocHeader';
import { OverviewSection } from './components/OverviewSection';
import { ResumeEndpoint } from './components/ResumeEndpoint';
import { JobsEndpoint } from './components/JobsEndpoint';
import { LegacyJobsEndpoint } from './components/LegacyJobsEndpoint';

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
              <LegacyJobsEndpoint />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
