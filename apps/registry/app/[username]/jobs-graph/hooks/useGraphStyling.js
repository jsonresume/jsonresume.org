import { useMemo } from 'react';
import { getEdgeStyle } from '../utils/colorUtils';

/**
 * Calculate salary level (0-1) for gradient coloring
 * Uses normalized salaryMax from database for accurate percentile-based distribution
 */
function getSalaryLevel(jobData, salaryRange) {
  // Prefer normalized salaryMax from database
  const salaryMax = jobData?.salaryMax || jobData?.salaryUsd;

  if (salaryMax && salaryRange?.p5 && salaryRange?.p95) {
    // Use percentile range for better distribution (handles outliers)
    const range = salaryRange.p95 - salaryRange.p5;
    if (range > 0) {
      return Math.min(1, Math.max(0, (salaryMax - salaryRange.p5) / range));
    }
  }

  if (salaryMax) {
    // Fallback to static range if no salaryRange provided
    return Math.min(1, Math.max(0, (salaryMax - 50000) / 250000));
  }

  // Fallback to parsing salary string for legacy data
  const salary = jobData?.salary;
  if (!salary) return 0.5;

  const str = String(salary).toLowerCase();
  const numbers = str.match(/[\d,]+/g);
  if (!numbers) return 0.5;

  const values = numbers.map((n) => parseInt(n.replace(/,/g, ''), 10));
  const normalized = values.map((v) => (v < 1000 ? v * 1000 : v));
  const max = Math.max(...normalized);

  return Math.min(1, Math.max(0, (max - 50000) / 250000));
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
        const salaryLevel = getSalaryLevel(jobData, salaryRange);

        return {
          ...node,
          type: 'jobNode', // Use custom node type
          data: {
            ...node.data,
            jobInfo: jobData,
            isRead,
            showSalaryGradient,
            salaryLevel,
            salaryRange, // Pass for JobNode fallback calculations
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
