import { useMemo } from 'react';
import { getNodeBackground, getEdgeStyle } from '../utils/colorUtils';

export function useGraphStyling({
  nodes,
  edges,
  jobInfo,
  username,
  readJobs,
  showSalaryGradient,
  salaryRange,
  filterText,
  filteredNodes,
  selectedNode,
  findPathToResume,
  remoteOnly,
  hideFiltered,
}) {
  // Check if any filter is active
  const hasActiveFilter = filterText || remoteOnly;

  const nodesWithStyle = useMemo(
    () =>
      nodes.map((node) => {
        // When hideFiltered is on, filtered nodes are already removed
        // so we don't need to dim them - just show all visible nodes at full opacity
        const shouldDim =
          !hideFiltered &&
          hasActiveFilter &&
          !node.data.isResume &&
          !filteredNodes.has(node.id);

        return {
          ...node,
          style: {
            ...node.style,
            opacity: shouldDim ? 0.2 : 1,
            background: getNodeBackground({
              node,
              jobData: jobInfo[node.id],
              username,
              readJobs,
              showSalaryGradient,
              salaryRange,
              filterText: hasActiveFilter && !hideFiltered ? 'active' : '', // Only signal filter when not hiding
              filteredNodes,
            }),
          },
        };
      }),
    [
      nodes,
      jobInfo,
      username,
      readJobs,
      showSalaryGradient,
      salaryRange,
      hasActiveFilter,
      filteredNodes,
      hideFiltered,
    ]
  );

  const edgesWithStyle = useMemo(() => {
    if (!selectedNode) return edges;
    const pathToResume = findPathToResume(edges, selectedNode.id);
    return edges.map((edge) => ({
      ...edge,
      animated: pathToResume.has(edge.id),
      style: getEdgeStyle(edge, pathToResume),
    }));
  }, [edges, selectedNode, findPathToResume]);

  return { nodesWithStyle, edgesWithStyle };
}
