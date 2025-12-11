export function PathwaysGraphLoading() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          {/* Animated circles */}
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
        </div>
        <p className="text-gray-600 font-medium">Finding matching jobs...</p>
        <p className="text-gray-400 text-sm mt-1">
          Analyzing your resume for the best opportunities
        </p>
      </div>
    </div>
  );
}
