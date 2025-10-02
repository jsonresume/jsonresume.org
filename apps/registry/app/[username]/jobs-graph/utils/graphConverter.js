import { getLayoutedElements } from './graphLayout';

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
      position: { x: 0, y: 0 }, // Position will be set by dagre
      data: {
        label: isResume ? (
          <div className="resume-node-content">
            <svg
              className="resume-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Your Resume</span>
          </div>
        ) : (
          <div className="job-card-content">
            <div className="job-title">
              {jobData?.title || 'Unknown Position'}
            </div>
            <div className="company-name">
              <svg
                className="company-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              {jobData?.company || 'Unknown Company'}
            </div>

            <div className="job-meta">
              <div className="meta-pills">
                {jobData?.type && (
                  <div className="meta-pill type">{jobData.type}</div>
                )}
                {jobData?.remote && (
                  <div className="meta-pill remote">{jobData.remote}</div>
                )}
                {jobData?.salary && (
                  <div className="meta-pill salary">{jobData.salary}</div>
                )}
              </div>
            </div>
          </div>
        ),
        jobInfo: jobInfoMap[node.id],
        isResume,
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
