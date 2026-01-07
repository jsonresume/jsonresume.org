import { useMemo } from 'react';
import { reconnectEdges } from '../utils/graphReconnection';
import { getLayoutedElements } from '../utils/graphLayout';
import { getJobSalary } from '../utils/salaryParser';

/**
 * Hook to filter nodes and edges, with intelligent reconnection
 * When hideFiltered is enabled, removes hidden nodes and reconnects orphans
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
}) {
  return useMemo(() => {
    // If not hiding filtered nodes, return original nodes/edges
    if (!hideFiltered) {
      return { visibleNodes: nodes, visibleEdges: edges };
    }

    // Identify nodes to hide
    const hiddenNodeIds = new Set();

    nodes.forEach((node) => {
      // Never hide resume node
      if (node.data?.isResume) return;

      const nodeId = node.id;

      // Hide if filtered out (when a filter is active)
      const isFilteredOut = hasActiveFilter && !filteredNodes.has(nodeId);

      // Hide if marked as read
      const readKey = `${username}_${nodeId}`;
      const isRead = readJobs.has(readKey);

      // Hide if outside salary filter range
      let isOutsideSalaryRange = false;
      if (salaryFilterRange && jobInfo) {
        const job = jobInfo[nodeId];
        const salary = job ? getJobSalary(job) : null;
        if (salary !== null) {
          isOutsideSalaryRange =
            salary < salaryFilterRange.min || salary > salaryFilterRange.max;
        }
      }

      if (isFilteredOut || isRead || isOutsideSalaryRange) {
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
  ]);
}
