import { useMemo } from 'react';
import { getEdgeStyle } from '../utils/colorUtils';
import { matchesSalaryFilter } from './useGraphFiltering';

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
  interestedJobs,
  showSalaryGradient,
  salaryRange,
  filterText,
  filteredNodes,
  selectedNode,
  findPathToResume,
  remoteOnly,
  hideFiltered,
}) {
  // Check if any filter is active (for text/remote)
  const hasTextOrRemoteFilter = Boolean(filterText || remoteOnly);

  const nodesWithStyle = useMemo(
    () =>
      nodes.map((node) => {
        // Resume node is never dimmed
        if (node.data.isResume) {
          return {
            ...node,
            type: 'jobNode',
            data: {
              ...node.data,
              jobInfo: jobInfo[node.id],
              isRead: false,
              isInterested: false,
              showSalaryGradient,
              salaryLevel: 0.5,
              salaryRange,
            },
            style: { ...node.style, opacity: 1 },
          };
        }

        const nodeId = node.id;
        const jobData = jobInfo[nodeId];
        const isRead = readJobs?.has(`${username}_${nodeId}`);
        const isInterested = interestedJobs?.has(`${username}_${nodeId}`);
        const salaryLevel = getSalaryLevel(jobData, salaryRange);

        // Determine if node should be dimmed (doesn't match active filters)
        // Only dim when hideFiltered is OFF (otherwise non-matching nodes are hidden)
        let shouldDim = false;

        if (!hideFiltered) {
          // Check text/remote filter
          if (hasTextOrRemoteFilter && !filteredNodes.has(nodeId)) {
            shouldDim = true;
          }

          // Check salary filter
          if (
            showSalaryGradient &&
            !matchesSalaryFilter(
              nodeId,
              jobInfo,
              showSalaryGradient,
              salaryRange?.filterRange
            )
          ) {
            shouldDim = true;
          }
        }

        return {
          ...node,
          type: 'jobNode',
          data: {
            ...node.data,
            jobInfo: jobData,
            isRead,
            isInterested,
            showSalaryGradient,
            salaryLevel,
            salaryRange,
          },
          style: {
            ...node.style,
            opacity: shouldDim ? 0.15 : 1,
          },
        };
      }),
    [
      nodes,
      jobInfo,
      username,
      readJobs,
      interestedJobs,
      showSalaryGradient,
      salaryRange,
      hasTextOrRemoteFilter,
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
