import { LOADING_STAGES } from '../../hooks/usePathwaysJobData';

const STAGE_CONFIG = {
  embedding: {
    icon: '🧠',
    title: 'Analyzing Resume',
    subtitle: 'Creating semantic embedding from your experience',
    progress: 20,
  },
  [LOADING_STAGES.CHECKING_CACHE]: {
    icon: '💾',
    title: 'Checking Cache',
    subtitle: 'Looking for previously computed results',
    progress: 30,
  },
  [LOADING_STAGES.CACHE_HIT]: {
    icon: '⚡',
    title: 'Cache Found!',
    subtitle: 'Loading your personalized job graph',
    progress: 90,
  },
  [LOADING_STAGES.FETCHING_JOBS]: {
    icon: '🔍',
    title: 'Finding Jobs',
    subtitle: 'Searching through thousands of opportunities',
    progress: 50,
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

function LoadingStep({ stage, isActive, isComplete, details }) {
  const config = STAGE_CONFIG[stage];
  if (!config) return null;

  return (
    <div
      className={`flex items-center gap-3 py-2 transition-opacity duration-300 ${
        isActive ? 'opacity-100' : isComplete ? 'opacity-50' : 'opacity-30'
      }`}
    >
      <span className="text-xl w-8 text-center">{config.icon}</span>
      <div className="flex-1">
        <div className="font-medium text-gray-700 text-sm">{config.title}</div>
        {isActive && details?.message && (
          <div className="text-xs text-gray-500">{details.message}</div>
        )}
      </div>
      {isComplete && <span className="text-green-500 text-sm">✓</span>}
      {isActive && !isComplete && (
        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
}

export function PathwaysGraphLoading({
  isEmbeddingLoading,
  loadingStage,
  loadingDetails = {},
}) {
  // Determine current stage
  const currentStage = isEmbeddingLoading ? 'embedding' : loadingStage;
  const config = STAGE_CONFIG[currentStage] || STAGE_CONFIG.embedding;

  // Build ordered stages for display
  const stages = isEmbeddingLoading
    ? ['embedding']
    : [
        LOADING_STAGES.CHECKING_CACHE,
        loadingStage === LOADING_STAGES.CACHE_HIT
          ? LOADING_STAGES.CACHE_HIT
          : LOADING_STAGES.FETCHING_JOBS,
        loadingStage !== LOADING_STAGES.CACHE_HIT &&
          LOADING_STAGES.BUILDING_GRAPH,
      ].filter(Boolean);

  const currentIndex = stages.indexOf(currentStage);

  return (
    <div className="flex items-center justify-center h-full w-full bg-gray-50/50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
        {/* Main spinner and title */}
        <div className="text-center mb-6">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">
              {config.icon}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {config.title}
          </h3>
          <p className="text-gray-500 text-sm mt-1">{config.subtitle}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${config.progress}%` }}
          />
        </div>

        {/* Stage steps */}
        <div className="border-t pt-4">
          {stages.map((stage, idx) => (
            <LoadingStep
              key={stage}
              stage={stage}
              isActive={idx === currentIndex}
              isComplete={idx < currentIndex}
              details={idx === currentIndex ? loadingDetails : null}
            />
          ))}
        </div>

        {/* Stats when available */}
        {loadingDetails.jobCount > 0 && (
          <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-indigo-600">
                {loadingDetails.jobCount}
              </div>
              <div className="text-xs text-gray-500">Jobs Found</div>
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
                <div className="text-xs text-gray-500">Connections</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
