import { getLayoutedElements } from './graphLayout';
import { ResumeNodeContent } from './graphConverter/ResumeNodeContent';
import { JobNodeContent } from './graphConverter/JobNodeContent';

/**
 * Converts backend graph data to React Flow format
 * @param {Object} graphData - Graph data from API
 * @param {Object} jobInfoMap - Job info map
 * @returns {Object} { nodes, edges } in React Flow format
 */
export const convertToReactFlowFormat = (graphData, jobInfoMap) => {
  if (!graphData) return { nodes: [], edges: [] };

  const rfNodes = graphData.nodes.map((node) => {
    const isResume = node.group === -1;
    const jobData = jobInfoMap[node.id];

    return {
      id: node.id,
      type: 'default',
      position: { x: 0, y: 0 },
      data: {
        label: isResume ? (
          <ResumeNodeContent />
        ) : (
          <JobNodeContent jobData={jobData} />
        ),
        jobInfo: jobInfoMap[node.id],
        isResume,
        childCount: node.childCount || 0,
      },
      className: isResume ? 'resume-node' : 'job-node',
    };
  });

  const rfEdges = graphData.links.map((link, index) => ({
    id: `e${index}`,
    source: link.source,
    target: link.target,
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#94a3b8', strokeWidth: 2 },
  }));

  return getLayoutedElements(rfNodes, rfEdges, 'TB');
};
