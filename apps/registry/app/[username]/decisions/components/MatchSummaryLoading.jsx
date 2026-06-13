/**
 * MatchSummaryLoading
 * Animated loading state for the AI match analysis section.
 */

'use client';

export function LoadingSummary({ matchResult }) {
  return (
    <div className="relative p-6 rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
      {/* Animated background gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'linear-gradient(45deg, transparent 25%, rgba(59, 130, 246, 0.1) 25%, rgba(59, 130, 246, 0.1) 50%, transparent 50%, transparent 75%, rgba(59, 130, 246, 0.1) 75%)',
          backgroundSize: '30px 30px',
          animation: 'slide 2s linear infinite',
        }}
      />

      {/* Content */}
      <div className="relative">
        {/* Spinning loader icon */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full"
            style={{ animation: 'spin 1s linear infinite' }}
          />
          <div className="font-semibold text-lg text-slate-900">
            {matchResult.bucket}
          </div>
        </div>

        {/* Loading steps with pulsing dots */}
        <div className="space-y-3">
          {matchResult.reasons.map(([criterion, reasoning], idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 text-sm"
              style={{
                animation: `fadeIn 0.5s ease-in-out ${idx * 0.1}s both`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"
                style={{
                  animation: 'pulse 1.5s ease-in-out infinite',
                  animationDelay: `${idx * 0.2}s`,
                }}
              />
              <div className="flex-1">
                <span className="font-medium text-slate-900">{criterion}</span>
                <div className="text-slate-600 mt-0.5">{reasoning}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            style={{ animation: 'progress 2s ease-in-out infinite' }}
          />
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.3);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(30px);
          }
        }
        @keyframes progress {
          0% {
            width: 0%;
            opacity: 0.6;
          }
          50% {
            width: 70%;
            opacity: 1;
          }
          100% {
            width: 100%;
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}
