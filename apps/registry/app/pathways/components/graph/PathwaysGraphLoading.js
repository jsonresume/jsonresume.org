import { LOADING_STAGES } from '../../hooks/usePathwaysJobData';
import { EMBEDDING_STAGES } from '../../context/PathwaysContext';

const STAGE_CONFIG = {
  // Embedding stages
  [EMBEDDING_STAGES.CHECKING_CACHE]: {
    icon: '💾',
    title: 'Checking Cache',
    subtitle: 'Looking for cached resume analysis',
    progress: 10,
  },
  [EMBEDDING_STAGES.CACHE_HIT]: {
    icon: '⚡',
    title: 'Resume Cache Found!',
    subtitle: 'Loading your saved analysis instantly',
    progress: 20,
  },
  [EMBEDDING_STAGES.GENERATING]: {
    icon: '🧠',
    title: 'Analyzing Resume',
    subtitle: 'Creating semantic embedding from your experience',
    progress: 25,
  },
  // Graph stages
  [LOADING_STAGES.CHECKING_CACHE]: {
    icon: '💾',
    title: 'Checking Job Cache',
    subtitle: 'Looking for previously matched jobs',
    progress: 40,
  },
  [LOADING_STAGES.CACHE_HIT]: {
    icon: '⚡',
    title: 'Jobs Cache Found!',
    subtitle: 'Loading your personalized job graph instantly',
    progress: 90,
  },
  [LOADING_STAGES.FETCHING_JOBS]: {
    icon: '🔍',
    title: 'Finding Jobs',
    subtitle: 'Searching through thousands of opportunities',
    progress: 60,
  },
  [LOADING_STAGES.BUILDING_GRAPH]: {
    icon: '🕸️',
    title: 'Building Graph',
    subtitle: 'Connecting jobs by skill similarity',
    progress: 80,
  },
  [LOADING_STAGES.COMPLETE]: {
    icon: '✅',
    title: 'Complete',
    subtitle: 'Your career graph is ready',
    progress: 100,
  },
};

function LoadingStep({ stage, isActive, isComplete, isCacheHit }) {
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
          {isCacheHit ? '⚡' : '✓'}
        </span>
      )}
      {isActive && !isComplete && (
        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
}

export function PathwaysGraphLoading({
  isEmbeddingLoading,
  embeddingStage,
  loadingStage,
  loadingDetails = {},
}) {
  // Determine which phase we're in
  const isInEmbeddingPhase = isEmbeddingLoading;
  const currentStage = isInEmbeddingPhase ? embeddingStage : loadingStage;
  const config =
    STAGE_CONFIG[currentStage] || STAGE_CONFIG[EMBEDDING_STAGES.CHECKING_CACHE];

  // Track if we hit caches
  const embeddingCacheHit = embeddingStage === EMBEDDING_STAGES.CACHE_HIT;
  const graphCacheHit = loadingStage === LOADING_STAGES.CACHE_HIT;

  // Calculate overall progress
  let progress = config?.progress || 10;
  if (!isInEmbeddingPhase && loadingStage) {
    progress = Math.max(progress, 30);
  }

  // Build stages to display
  const embeddingStages = embeddingCacheHit
    ? [EMBEDDING_STAGES.CHECKING_CACHE, EMBEDDING_STAGES.CACHE_HIT]
    : [EMBEDDING_STAGES.CHECKING_CACHE, EMBEDDING_STAGES.GENERATING];

  const graphStages = graphCacheHit
    ? [LOADING_STAGES.CHECKING_CACHE, LOADING_STAGES.CACHE_HIT]
    : [
        LOADING_STAGES.CHECKING_CACHE,
        LOADING_STAGES.FETCHING_JOBS,
        LOADING_STAGES.BUILDING_GRAPH,
      ];

  // Find current indices
  const embeddingIndex = embeddingStages.indexOf(embeddingStage);
  const graphIndex = graphStages.indexOf(loadingStage);

  return (
    <div className="flex items-center justify-center h-full w-full bg-gray-50/50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
        {/* Main spinner and title */}
        <div className="text-center mb-6">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">
              {config?.icon || '🔄'}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {config?.title || 'Loading...'}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {config?.subtitle || 'Please wait...'}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Embedding Phase */}
        <div className="border-t pt-4">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Resume Analysis
          </div>
          {embeddingStages.map((stage, idx) => (
            <LoadingStep
              key={stage}
              stage={stage}
              isActive={isInEmbeddingPhase && idx === embeddingIndex}
              isComplete={!isInEmbeddingPhase || idx < embeddingIndex}
              isCacheHit={stage === EMBEDDING_STAGES.CACHE_HIT}
            />
          ))}
        </div>

        {/* Graph Phase */}
        {!isInEmbeddingPhase && (
          <div className="border-t pt-4 mt-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Job Matching
            </div>
            {graphStages.map((stage, idx) => (
              <LoadingStep
                key={stage}
                stage={stage}
                isActive={idx === graphIndex}
                isComplete={idx < graphIndex}
                isCacheHit={stage === LOADING_STAGES.CACHE_HIT}
              />
            ))}
          </div>
        )}

        {/* Stats when available */}
        {loadingDetails.jobCount > 0 && (
          <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-indigo-600">
                {loadingDetails.jobCount}
              </div>
              <div className="text-xs text-gray-500">Jobs</div>
            </div>
            {loadingDetails.nodeCount > 0 && (
              <div>
                <div className="text-2xl font-bold text-indigo-600">
                  {loadingDetails.nodeCount}
                </div>
                <div className="text-xs text-gray-500">Nodes</div>
              </div>
            )}
            {loadingDetails.edgeCount > 0 && (
              <div>
                <div className="text-2xl font-bold text-indigo-600">
                  {loadingDetails.edgeCount}
                </div>
                <div className="text-xs text-gray-500">Links</div>
              </div>
            )}
          </div>
        )}

        {/* Cache indicator */}
        {(embeddingCacheHit || graphCacheHit) && (
          <div className="mt-4 text-center text-xs text-gray-400">
            ⚡ Using cached data for faster loading
          </div>
        )}
      </div>
    </div>
  );
}
