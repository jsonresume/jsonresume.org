export const ErrorState = ({ error }) => (
  <div className="prose max-w-3xl mx-auto h-[calc(100vh-32rem)] flex items-start justify-center bg-white pt-16">
    <div className="flex flex-col items-center gap-4 max-w-lg text-center">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100">
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div className="text-lg text-red-600 font-medium">
        Error loading graph data
      </div>
      <div className="text-sm text-gray-600">{error}</div>
    </div>
  </div>
);
