import SwipeHeader from './SwipeHeader';

export default function SwipeEmptyState({ totalJobs }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SwipeHeader />
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-6 text-center">
        <div className="w-24 h-24 mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          All caught up!
        </h2>
        <p className="text-gray-600 mb-6">
          You&apos;ve reviewed all {totalJobs} jobs. Check back later for new
          opportunities.
        </p>
        <a
          href="/pathways"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          View Graph
        </a>
      </div>
    </div>
  );
}
