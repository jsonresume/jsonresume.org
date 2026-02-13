export default function PathwaysLoading() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading Pathways...</p>
      </div>
    </div>
  );
}
