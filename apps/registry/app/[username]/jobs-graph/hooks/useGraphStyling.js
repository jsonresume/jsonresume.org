import { useMemo } from 'react';
import { getEdgeStyle } from '../utils/colorUtils';

/**
 * Calculate salary level (0-1) for gradient coloring
 */
function getSalaryLevel(salary, salaryRange) {
  if (!salary || !salaryRange) return 0.5;

  const str = String(salary).toLowerCase();
  const numbers = str.match(/[\d,]+/g);
  if (!numbers) return 0.5;

  const values = numbers.map((n) => parseInt(n.replace(/,/g, ''), 10));
  const normalized = values.map((v) => (v < 1000 ? v * 1000 : v));
  const avg = normalized.reduce((a, b) => a + b, 0) / normalized.length;

  // Use salaryRange if available, otherwise use defaults
  const min = salaryRange?.min || 50000;
  const max = salaryRange?.max || 300000;

  return Math.min(1, Math.max(0, (avg - min) / (max - min)));
}

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

        const jobData = jobInfo[node.id];
        const isRead = readJobs?.has(`${username}_${node.id}`);
        const salaryLevel = getSalaryLevel(jobData?.salary, salaryRange);

        return {
          ...node,
          type: 'jobNode', // Use custom node type
          data: {
            ...node.data,
            jobInfo: jobData,
            isRead,
            showSalaryGradient,
            salaryLevel,
          },
          style: {
            ...node.style,
            opacity: shouldDim ? 0.2 : 1,
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
