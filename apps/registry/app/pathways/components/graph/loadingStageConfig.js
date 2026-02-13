import { LOADING_STAGES } from '../../hooks/usePathwaysJobData';
import { EMBEDDING_STAGES } from '../../context/PathwaysContext';

export const STAGE_CONFIG = {
  [EMBEDDING_STAGES.CHECKING_CACHE]: {
    icon: '\u{1F4BE}',
    title: 'Checking Cache',
    subtitle: 'Looking for cached resume analysis',
    progress: 10,
  },
  [EMBEDDING_STAGES.CACHE_HIT]: {
    icon: '\u26A1',
    title: 'Resume Cache Found!',
    subtitle: 'Loading your saved analysis instantly',
    progress: 20,
  },
  [EMBEDDING_STAGES.GENERATING]: {
    icon: '\u{1F9E0}',
    title: 'Analyzing Resume',
    subtitle: 'Creating semantic embedding from your experience',
    progress: 25,
  },
  [LOADING_STAGES.CHECKING_CACHE]: {
    icon: '\u{1F4BE}',
    title: 'Checking Job Cache',
    subtitle: 'Looking for previously matched jobs',
    progress: 40,
  },
  [LOADING_STAGES.CACHE_HIT]: {
    icon: '\u26A1',
    title: 'Jobs Cache Found!',
    subtitle: 'Loading your personalized job graph instantly',
    progress: 90,
  },
  [LOADING_STAGES.FETCHING_JOBS]: {
    icon: '\u{1F50D}',
    title: 'Finding Jobs',
    subtitle: 'Searching through thousands of opportunities',
    progress: 60,
  },
  [LOADING_STAGES.BUILDING_GRAPH]: {
    icon: '\u{1F578}\uFE0F',
    title: 'Building Graph',
    subtitle: 'Connecting jobs by skill similarity',
    progress: 80,
  },
  [LOADING_STAGES.COMPLETE]: {
    icon: '\u2705',
    title: 'Complete',
    subtitle: 'Your career graph is ready',
    progress: 100,
  },
};

export function LoadingStep({ stage, isActive, isComplete, isCacheHit }) {
  const config = STAGE_CONFIG[stage];
  if (!config) return null;

  return (
    <div
      className={`flex items-center gap-3 py-2 transition-all duration-300 ${
        isActive ? 'opacity-100' : isComplete ? 'opacity-50' : 'opacity-30'
      }`}
    >
      <span className="text-xl w-8 text-center">{config.icon}</span>
      <div className="flex-1">
        <div className="font-medium text-gray-700 text-sm">{config.title}</div>
        {isActive && (
          <div className="text-xs text-gray-500">{config.subtitle}</div>
        )}
      </div>
      {isComplete && (
        <span
          className={`text-sm ${
            isCacheHit ? 'text-yellow-500' : 'text-green-500'
          }`}
        >
          {isCacheHit ? '\u26A1' : '\u2713'}
        </span>
      )}
      {isActive && !isComplete && (
        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
}
