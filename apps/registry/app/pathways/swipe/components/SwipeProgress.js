'use client';

export default function SwipeProgress({ processed, total }) {
  const percentage = total > 0 ? (processed / total) * 100 : 0;

  return (
    <div className="px-4 py-2 bg-gray-50">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
          <span>{processed} reviewed</span>
          <span>{total - processed} remaining</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
