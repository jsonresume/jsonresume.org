import { useMemo } from 'react';
import { reconnectEdges } from '../utils/graphReconnection';
import { getLayoutedElements } from '../utils/graphLayout';
import { getJobSalary } from '../utils/salaryParser';

// Time range configurations (days)
const TIME_RANGE_DAYS = {
  '1m': 35,
  '2m': 65,
  '3m': 95,
};

/**
 * Check if a node matches the salary filter
 */
function matchesSalaryFilter(
  nodeId,
  jobInfo,
  showSalaryGradient,
  salaryFilterRange
) {
  if (!showSalaryGradient) return true; // No salary filter active

  const job = jobInfo?.[nodeId];
  const salary = job ? getJobSalary(job) : null;

  // No salary data - doesn't match salary filter
  if (salary === null) return false;

  // Check range if set
  if (salaryFilterRange) {
    if (salary < salaryFilterRange.min || salary > salaryFilterRange.max) {
      return false;
    }
  }

  return true;
}

/**
 * Hook to filter nodes and edges, with intelligent reconnection
 * Nodes are only hidden when hideFiltered is enabled
 * Otherwise, non-matching nodes are just dimmed (handled by useGraphStyling)
 * @param {Object} params - Hook parameters
 * @returns {Object} { visibleNodes, visibleEdges }
 */
export function useGraphFiltering({
  nodes,
  edges,
  filteredNodes,
  readJobs,
  hideFiltered,
  username,
  hasActiveFilter,
  jobInfo,
  salaryFilterRange,
  showSalaryGradient = false,
  timeRange = '1m',
}) {
  return useMemo(() => {
    // If hideFiltered is not enabled, don't hide anything - just return original
    // (non-matching nodes will be dimmed by useGraphStyling instead)
    if (!hideFiltered) {
      return { visibleNodes: nodes, visibleEdges: edges };
    }

    // hideFiltered is ON - actually hide non-matching nodes
    const hiddenNodeIds = new Set();

    nodes.forEach((node) => {
      // Never hide resume node
      if (node.data?.isResume) return;

      const nodeId = node.id;

      // Time-based filtering
      if (jobInfo) {
        const job = jobInfo[nodeId];
        const days = TIME_RANGE_DAYS[timeRange];
        if (days && job?.createdAt) {
          const jobDate = new Date(job.createdAt);
          const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
          if (jobDate < cutoffDate) {
            hiddenNodeIds.add(nodeId);
            return;
          }
        }
      }

      // Salary filter
      if (
        !matchesSalaryFilter(
          nodeId,
          jobInfo,
          showSalaryGradient,
          salaryFilterRange
        )
      ) {
        hiddenNodeIds.add(nodeId);
        return;
      }

      // Text/Remote filter (when a filter is active and node doesn't match)
      if (hasActiveFilter && !filteredNodes.has(nodeId)) {
        hiddenNodeIds.add(nodeId);
        return;
      }

      // Hide if marked as read
      const readKey = `${username}_${nodeId}`;
      if (readJobs.has(readKey)) {
        hiddenNodeIds.add(nodeId);
      }
    });

    // If nothing to hide, return original
    if (hiddenNodeIds.size === 0) {
      return { visibleNodes: nodes, visibleEdges: edges };
    }

    // Filter out hidden nodes
    const visibleNodes = nodes.filter((n) => !hiddenNodeIds.has(n.id));

    // Reconnect edges (orphaned children connect to grandparent)
    const reconnectedEdges = reconnectEdges(edges, hiddenNodeIds, nodes);

    // Re-run layout on the filtered graph
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      visibleNodes,
      reconnectedEdges
    );

    return { visibleNodes: layoutedNodes, visibleEdges: layoutedEdges };
  }, [
    nodes,
    edges,
    filteredNodes,
    readJobs,
    hideFiltered,
    username,
    hasActiveFilter,
    jobInfo,
    salaryFilterRange,
    showSalaryGradient,
    timeRange,
  ]);
}

// Export helper for useGraphStyling
export { matchesSalaryFilter };
