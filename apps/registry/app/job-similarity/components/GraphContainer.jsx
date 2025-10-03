import { useSimilarityGraph } from '../hooks/useSimilarityGraph';
import { useGraphInteraction } from '../hooks/useGraphInteraction';
import { GraphCanvas } from './GraphCanvas';
import { NodeTooltip } from './NodeTooltip';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';

export const GraphContainer = ({ dataSource, algorithm }) => {
  const { graphData, edges, loading, error } = useSimilarityGraph(
    dataSource,
    algorithm
  );

  const {
    highlightNodes,
    highlightLinks,
    hoverNode,
    handleNodeHover,
    handleNodeClick,
  } = useGraphInteraction(edges, dataSource);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="w-full h-[600px] relative">
      <GraphCanvas
        graphData={graphData}
        highlightNodes={highlightNodes}
        highlightLinks={highlightLinks}
        onNodeHover={handleNodeHover}
        onNodeClick={handleNodeClick}
      />
      <NodeTooltip hoverNode={hoverNode} dataSource={dataSource} />
    </div>
  );
};
