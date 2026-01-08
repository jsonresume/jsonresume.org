'use client';

/**
 * StepIndicator - Shows multi-step progress for agent tool loops
 * Displays progress bar and step count during complex multi-tool operations
 */
export default function StepIndicator({ step, maxSteps = 20 }) {
  // Only show for multi-step operations
  if (!step || step < 2) return null;

  const progress = Math.min((step / maxSteps) * 100, 100);

  return (
    <div className="flex items-center gap-2 text-[10px] text-gray-400 py-1 px-1">
      <div className="flex-1 h-0.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-400 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="tabular-nums whitespace-nowrap">
        Step {step}/{maxSteps}
      </span>
    </div>
  );
}
