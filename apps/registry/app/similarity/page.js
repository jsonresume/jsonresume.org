'use client';

import { useSimilarityData } from './SimilarityModule/hooks/useSimilarityData';
import { useGraphInteraction } from './SimilarityModule/hooks/useGraphInteraction';
import { LoadingState } from './SimilarityModule/components/LoadingState';
import { ErrorState } from './SimilarityModule/components/ErrorState';
import { SimilarityGraph } from './SimilarityModule/components/SimilarityGraph';

export default function SimilarityPage() {
  const { graphData, loading, error } = useSimilarityData();
  const {
    highlightNodes,
    highlightLinks,
    hoverNode,
    handleNodeHover,
    handleNodeClick,
  } = useGraphInteraction(graphData);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Resume Position Network</h1>
      <p className="mb-4">
        Explore similar positions in an interactive network. Each node
        represents a position, with size indicating the number of resumes.
        Connected positions are similar based on resume content. Hover to
        highlight connections, click to view resumes.
      </p>
      <SimilarityGraph
        graphData={graphData}
        highlightNodes={highlightNodes}
        highlightLinks={highlightLinks}
        hoverNode={hoverNode}
        onNodeHover={handleNodeHover}
        onNodeClick={handleNodeClick}
      />
    </div>
  );
}
