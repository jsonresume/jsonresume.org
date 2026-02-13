import { LOADING_STAGES } from '../../hooks/usePathwaysJobData';
import { EMBEDDING_STAGES } from '../../context/PathwaysContext';
import { STAGE_CONFIG, LoadingStep } from './loadingStageConfig';

export function PathwaysGraphLoading({
  isEmbeddingLoading,
  embeddingStage,
  loadingStage,
  loadingDetails = {},
}) {
  const isInEmbeddingPhase = isEmbeddingLoading;
  const currentStage = isInEmbeddingPhase ? embeddingStage : loadingStage;
  const config =
    STAGE_CONFIG[currentStage] || STAGE_CONFIG[EMBEDDING_STAGES.CHECKING_CACHE];

  const embeddingCacheHit = embeddingStage === EMBEDDING_STAGES.CACHE_HIT;
  const graphCacheHit = loadingStage === LOADING_STAGES.CACHE_HIT;

  let progress = config?.progress || 10;
  if (!isInEmbeddingPhase && loadingStage) {
    progress = Math.max(progress, 30);
  }

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
              {config?.icon || '\u{1F504}'}
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
            \u26A1 Using cached data for faster loading
          </div>
        )}
      </div>
    </div>
  );
}
