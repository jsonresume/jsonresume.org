export const LoadingState = () => (
  <div className="prose max-w-3xl mx-auto h-[calc(100vh-32rem)] flex items-start justify-center bg-white pt-16">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-secondary-600 border-t-transparent rounded-full animate-spin"></div>
      <div className="text-lg text-secondary-600 font-medium">
        Loading graph data...
      </div>
    </div>
  </div>
);
