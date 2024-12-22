'use client';

import React, { useState, useCallback, memo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

// Reuse the helper functions from the similarity page
const cosineSimilarity = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return 0;
  const dotProduct = a.reduce((sum, _, i) => sum + a[i] * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

const normalizeVector = (vector) => {
  if (!Array.isArray(vector) || vector.length === 0) return null;
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) return null;
  return vector.map((val) => val / magnitude);
};

const colors = {
  resume: '#FF6B6B', // coral red for the central resume node
  jobs: '#4ECDC4', // turquoise for job nodes
  selected: '#ff0000', // red for highlighted nodes
  resumeLink: '#FF8C94', // rose pink for resume-to-job connections
  jobLink: '#96CEB4', // sage green for job-to-job connections
};

const Header = memo(() => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold mb-4">Job Graph Explorer</h1>
    <div className="space-y-4 text-gray-700">
      <p>
        Visualize how your resume connects to job opportunities. Select a username
        to see which job listings match your profile. Your resume will be shown
        as the central node, with related job opportunities surrounding it based
        on similarity.
      </p>
    </div>
  </div>
));
Header.displayName = 'Header';

const UsernameSelect = memo(({ username, setUsername, usernames, isLoading }) => (
  <div className="mb-8">
    <div className="flex gap-4">
      <select
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="flex-1 pl-3 pr-10 py-2 border-gray-300 focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm rounded-md"
        disabled={isLoading}
      >
        <option value="">Select a username</option>
        {usernames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  </div>
));
UsernameSelect.displayName = 'UsernameSelect';

const GraphContainer = ({ username }) => {
  const [graphData, setGraphData] = useState(null);
  const [hoverNode, setHoverNode] = useState(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [resumes, setResumes] = useState(null);
  const graphRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch all resumes once
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch('/api/similarity?limit=15', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch resumes: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format');
        }
        setResumes(data);
      } catch (err) {
        console.error('Error fetching resumes:', err);
        setError(`Failed to load resumes: ${err.message}`);
      }
    };
    fetchResumes();
  }, []);

  const handleNodeHover = useCallback((node) => {
    setHighlightNodes(new Set(node ? [node] : []));
    setHighlightLinks(
      new Set(
        node
          ? graphData?.links.filter(
              (link) => link.source === node || link.target === node
            ) || []
          : []
      )
    );
    setHoverNode(node || null);
  }, [graphData]);

  const handleNodeClick = useCallback(
    (node) => {
      if (!node) return;

      if (isMobile) {
        setHoverNode(node);
        return;
      }

      if (node.type === 'resume') {
        window.open(`/${node.username}`, '_blank');
      } else {
        window.open(`/jobs/${node.uuid}`, '_blank');
      }
    },
    [isMobile]
  );

  useEffect(() => {
    const updateGraph = async () => {
      if (!username || !resumes) return;

      setLoading(true);
      setError(null);
      try {
        // Find the selected resume
        const selectedResume = resumes.find(r => r.username === username);
        if (!selectedResume) {
          throw new Error('Resume not found');
        }

        // Debug selected resume data
        console.log('Selected Resume:', {
          username,
          position: selectedResume.position,
          hasEmbedding: !!selectedResume.embedding,
          embeddingType: typeof selectedResume.embedding,
          embeddingLength: selectedResume.embedding ? 
            (typeof selectedResume.embedding === 'string' ? 
              JSON.parse(selectedResume.embedding).length : 
              selectedResume.embedding.length) : 0
        });

        // Fetch similar jobs
        const jobsResponse = await fetch('/api/job-similarity?limit=500', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        if (!jobsResponse.ok) {
          throw new Error(`Failed to fetch jobs: ${jobsResponse.status}`);
        }
        const jobsData = await jobsResponse.json();
        if (!Array.isArray(jobsData)) {
          throw new Error('Invalid jobs response format');
        }

        // Create resume node with proper embedding
        const resumeEmbedding = normalizeVector(
          typeof selectedResume.embedding === 'string'
            ? JSON.parse(selectedResume.embedding)
            : selectedResume.embedding
        );

        const resumeNode = {
          id: username,
          username,
          type: 'resume',
          size: 8,
          color: colors.resume,
          embedding: resumeEmbedding,
          title: selectedResume.position || 'Resume',
        };

        console.log('Resume Node:', {
          id: resumeNode.id,
          title: resumeNode.title,
          hasEmbedding: !!resumeNode.embedding,
          embeddingLength: resumeNode.embedding?.length
        });

        // Debug job data before processing
        console.log('Jobs Data:', {
          total: jobsData.length,
          withEmbeddings: jobsData.filter(j => j.embedding).length,
          sampleEmbedding: jobsData[0]?.embedding ? 
            (typeof jobsData[0].embedding === 'string' ? 
              JSON.parse(jobsData[0].embedding).length : 
              jobsData[0].embedding.length) : 0
        });

        // Calculate resume similarities for all jobs first
        const jobNodes = jobsData
          .filter((job) => job.embedding)
          .map((job) => {
            const jobEmbedding = normalizeVector(
              typeof job.embedding === 'string'
                ? JSON.parse(job.embedding)
                : job.embedding
            );
            
            const similarity = resumeNode.embedding && jobEmbedding ? 
              cosineSimilarity(resumeNode.embedding, jobEmbedding) : 0;
            
            console.log(`Job "${job.title}":`, {
              similarity,
              hasEmbedding: !!jobEmbedding,
              embeddingLength: jobEmbedding?.length
            });
            
            return {
              id: job.id,
              title: job.title,
              company: job.company,
              embedding: jobEmbedding,
              type: 'job',
              size: 5,
              color: colors.jobs,
              resumeSimilarity: Math.round(similarity * 100) / 100
            };
          })
          .filter((job) => job.embedding && job.title !== "Unknown Position");

        // Sort jobs by similarity to resume
        const sortedJobs = [...jobNodes].sort((a, b) => b.resumeSimilarity - a.resumeSimilarity);
        
        // Take top 20 most similar jobs to connect to resume
        const resumeConnectedJobs = sortedJobs.slice(0, 20);
        const remainingJobs = sortedJobs.slice(20);
        const links = [];

        // Connect top 20 to resume
        resumeConnectedJobs.forEach(job => {
          links.push({
            source: resumeNode,
            target: job,
            value: job.resumeSimilarity,
            type: 'resume-job'
          });
        });

        // For each remaining job, find its most similar resume-connected job
        remainingJobs.forEach(job => {
          // Find most similar resume-connected job
          let bestMatch = null;
          let bestSimilarity = -1;

          resumeConnectedJobs.forEach(resumeJob => {
            const similarity = cosineSimilarity(job.embedding, resumeJob.embedding);
            if (similarity > bestSimilarity) {
              bestSimilarity = similarity;
              bestMatch = resumeJob;
            }
          });

          // Always create a connection to the most similar resume-connected job
          if (bestMatch) {
            links.push({
              source: bestMatch,
              target: job,
              value: Math.max(0.1, bestSimilarity), // Minimum strength of 0.1
              type: 'job-job'
            });
          }
        });

        // Log connection stats
        console.log('Graph Data:', {
          totalNodes: jobNodes.length,
          resumeConnections: resumeConnectedJobs.length,
          totalLinks: links.length,
          resumeLinks: links.filter(l => l.type === 'resume-job').length,
          jobLinks: links.filter(l => l.type === 'job-job').length
        });

        // Set graph data with all nodes
        setGraphData({
          nodes: [resumeNode, ...jobNodes],
          links
        });
      } catch (err) {
        console.error('Error updating graph:', err);
        setError(`Failed to load graph: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    updateGraph();
  }, [username, resumes]);

  if (loading)
    return (
      <div className="h-[600px] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-secondary-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg text-secondary-600 font-medium">
            Loading graph data...
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="h-[600px] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4 max-w-lg text-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="text-lg text-red-600 font-medium">
            Error loading graph data
          </div>
          <div className="text-sm text-gray-600">{error}</div>
        </div>
      </div>
    );

  if (!graphData)
    return (
      <div className="h-[600px] flex items-center justify-center bg-white">
        <div className="text-lg text-gray-600">
          Select a username to explore job connections
        </div>
      </div>
    );

  return (
    <div className="w-full h-[600px] relative">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeId="id"
        nodeLabel={(node) => `${node.title}${node.company ? ` at ${node.company}` : ''}`}
        linkSource="source"
        linkTarget="target"
        linkColor={(link) => link.type === 'resume-job' ? colors.resumeLink : colors.jobLink}
        linkWidth={(link) => link.type === 'resume-job' ? Math.sqrt(link.value) * 4 : Math.sqrt(link.value) * 2}
        nodeCanvasObject={(node, ctx, globalScale) => {
          // Draw circle
          const size = node.type === 'resume' ? 8 : 5;
          ctx.beginPath();
          ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
          ctx.fillStyle = node.type === 'resume' ? colors.resume : colors.jobs;
          ctx.fill();

          // Draw label
          const label = node.type === 'resume' ? 'Resume' : node.title;
          const fontSize = node.type === 'resume' ? 5 : 3;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = 'black';
          ctx.fillText(label, node.x, node.y - size - 1);

          // Draw similarity score for job nodes
          if (node.type === 'job') {
            const score = (node.resumeSimilarity * 100).toFixed(0) + '%';
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.fillStyle = '#666';
            ctx.fillText(score, node.x, node.y + size + fontSize);
          }
        }}
        linkDirectionalParticles={(link) => link.type === 'resume-job' ? 4 : 2}
        linkDirectionalParticleWidth={(link) => link.type === 'resume-job' ? 4 : 2}
        onNodeHover={handleNodeHover}
        onNodeClick={handleNodeClick}
        enableNodeDrag={false}
        d3Force={(d3Force) => {
          // Increase repulsion between nodes
          d3Force('charge').strength(-100);
          // Add collision force to prevent overlap
          d3Force('collision', d3.forceCollide(20));
          // Adjust link distance based on type
          d3Force('link').distance(link => link.type === 'resume-job' ? 100 : 50);
        }}
      />
      {hoverNode && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg w-80">
          <h3 className="font-bold">
            {hoverNode.type === 'resume'
              ? `Resume: ${hoverNode.username}`
              : hoverNode.title}
          </h3>
          {hoverNode.type === 'job' && (
            <>
              <p className="mt-2 text-sm text-gray-600">Company:</p>
              <p className="text-sm">{hoverNode.company || 'Unknown Company'}</p>
              <div className="mt-4">
                <a
                  href={`/jobs/${hoverNode.uuid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View job listing →
                </a>
              </div>
            </>
          )}
          {hoverNode.type === 'resume' && (
            <div className="mt-4">
              <a
                href={`/${hoverNode.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View resume →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function Page() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usernames, setUsernames] = useState([]);
  const [error, setError] = useState(null);

  // Fetch usernames once when page loads
  useEffect(() => {
    const fetchUsernames = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/similarity?limit=15', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch resumes: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format');
        }
        const validUsernames = data
          .filter(r => r.username && r.embedding)
          .map(r => r.username)
          .sort();
        setUsernames(validUsernames);
      } catch (err) {
        console.error('Error fetching usernames:', err);
        setError(`Failed to load usernames: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsernames();
  }, []);

  return (
    <div className="min-h-screen bg-accent-100">
      <div className="prose max-w-3xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <Header />
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        <UsernameSelect
          username={username}
          setUsername={setUsername}
          usernames={usernames}
          isLoading={isLoading}
        />
      </div>
      <div className="w-full h-[600px] bg-white">
        <GraphContainer username={username} />
      </div>
    </div>
  );
}
