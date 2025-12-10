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
}) {
  // Check if any filter is active
  const hasActiveFilter = filterText || remoteOnly;

  const nodesWithStyle = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        style: {
          ...node.style,
          opacity:
            hasActiveFilter &&
            !node.data.isResume &&
            !filteredNodes.has(node.id)
              ? 0.2
              : 1,
          background: getNodeBackground({
            node,
            jobData: jobInfo[node.id],
            username,
            readJobs,
            showSalaryGradient,
            salaryRange,
            filterText: hasActiveFilter ? 'active' : '', // Signal that filter is active
            filteredNodes,
          }),
        },
      })),
    [
      nodes,
      jobInfo,
      username,
      readJobs,
      showSalaryGradient,
      salaryRange,
      hasActiveFilter,
      filteredNodes,
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
