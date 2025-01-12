'use client';

import axios from 'axios';
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { forceCollide, forceManyBody } from 'd3-force';
import ForceGraph2D from 'react-force-graph-2d';

// Format skills array into a readable string
const formatSkills = (skills) => {
  if (!skills) return '';
  return skills.map((skill) => `${skill.name} (${skill.level})`).join(', ');
};

// Format qualifications array into a bullet list
const formatQualifications = (qualifications) => {
  if (!qualifications) return '';
  return qualifications.join('\n• ');
};

// Helper to format job info into tooltip text
const formatTooltip = (jobInfo) => {
  if (!jobInfo) return '';

  // Truncate description if needed
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  };

  const parts = [
    `${jobInfo.title || 'Untitled'} at ${jobInfo.company || 'Unknown Company'}`,
    jobInfo.remote ? `${jobInfo.remote} Remote` : '',
    jobInfo.location && jobInfo.location.city
      ? `Location: ${jobInfo.location.city}${
          jobInfo.location.region ? `, ${jobInfo.location.region}` : ''
        }`
      : '',
    `Type: ${jobInfo.type || 'Not specified'}`,
    '',
    'Description:',
    truncateText(jobInfo.description, 150),
    '',
    'Skills:',
    formatSkills(jobInfo.skills),
    '',
    'Qualifications:',
    `• ${formatQualifications(jobInfo.qualifications)}`,
  ];

  return parts.filter(Boolean).join('\n');
};

const calculateCollisionRadius = (node) => {
  // Replace this with your logic to determine node size
  const nodeSize = node.size || 1; // Default size if not specified
  return nodeSize + 3; // Add padding if desired
};

export default function Jobs({ params }) {
  const { username } = params;
  const [jobs, setJobs] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false); // Track if initialized

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const graphRef = useRef();
  const [activeNode, setActiveNode] = useState(null);
  const [jobInfo, setJobInfo] = useState({}); // Store parsed job info
  const [graphData, setGraphData] = useState(null);
  const imageCache = useRef(new Map());

  const [mostRelevant, setMostRelevant] = useState([]);
  const [lessRelevant, setLessRelevant] = useState([]);

  const [readJobs, setReadJobs] = useState(new Set());

  const [filterText, setFilterText] = useState('');
  const [filteredNodes, setFilteredNodes] = useState(new Set());

  const [showSalaryGradient, setShowSalaryGradient] = useState(false);
  const [salaryRange, setSalaryRange] = useState({
    min: Infinity,
    max: -Infinity,
  });

  // Parse salary from various string formats
  const parseSalary = useCallback((salary) => {
    if (!salary) return null;
    if (typeof salary === 'number') return salary;

    const str = salary.toString().toLowerCase();
    // Extract all numbers from the string
    const numbers = str.match(/\d+(?:\.\d+)?/g);
    if (!numbers) return null;

    // Convert numbers considering k/K multiplier
    const values = numbers.map((num) => {
      const multiplier = str.includes('k') ? 1000 : 1;
      return parseFloat(num) * multiplier;
    });

    // If range, return average
    if (values.length > 1) {
      values.sort((a, b) => a - b);
      return (values[0] + values[values.length - 1]) / 2;
    }

    return values[0];
  }, []);

  // Calculate salary range when jobs data changes
  useEffect(() => {
    if (!jobInfo) return;

    let min = Infinity;
    let max = -Infinity;

    Object.values(jobInfo).forEach((job) => {
      const salary = parseSalary(job.salary);
      if (salary) {
        min = Math.min(min, salary);
        max = Math.max(max, salary);
      }
    });

    if (min !== Infinity && max !== -Infinity) {
      setSalaryRange({ min, max });
    }
  }, [jobInfo, parseSalary]);

  // Load read jobs from localStorage on mount
  useEffect(() => {
    const storedReadJobs = localStorage.getItem(`readJobs_${username}`);
    if (storedReadJobs) {
      setReadJobs(new Set(JSON.parse(storedReadJobs)));
    }
  }, [username]);

  useEffect(() => {
    if (!filterText.trim() || !jobInfo) {
      setFilteredNodes(new Set());
      return;
    }

    const searchText = filterText.toLowerCase();
    const matches = new Set();

    Object.entries(jobInfo).forEach(([id, job]) => {
      const searchableText = [
        job.title,
        job.company,
        job.description,
        job.type,
        job.location?.city,
        job.location?.region,
        job.skills?.map((s) => s.name).join(' '),
        job.qualifications?.join(' '),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (searchableText.includes(searchText)) {
        matches.add(id);
      }
    });

    setFilteredNodes(matches);
  }, [filterText, jobInfo]);

  const markJobAsRead = useCallback(
    (jobId) => {
      setReadJobs((prev) => {
        const newReadJobs = new Set(prev);
        newReadJobs.add(jobId);
        localStorage.setItem(
          `readJobs_${username}`,
          JSON.stringify([...newReadJobs])
        );
        return newReadJobs;
      });
    },
    [username]
  );

  // Memoize node colors for salary view
  const nodeSalaryColors = useMemo(() => {
    if (!showSalaryGradient || !jobInfo) return new Map();

    const colors = new Map();
    Object.entries(jobInfo).forEach(([id, job]) => {
      const salary = parseSalary(job.salary);
      if (salary) {
        const percentage =
          (salary - salaryRange.min) / (salaryRange.max - salaryRange.min);
        const lightBlue = [219, 234, 254]; // bg-blue-100
        const darkBlue = [30, 64, 175]; // bg-blue-800

        const r = Math.round(
          lightBlue[0] + (darkBlue[0] - lightBlue[0]) * percentage
        );
        const g = Math.round(
          lightBlue[1] + (darkBlue[1] - lightBlue[1]) * percentage
        );
        const b = Math.round(
          lightBlue[2] + (darkBlue[2] - lightBlue[2]) * percentage
        );

        colors.set(id, `rgb(${r}, ${g}, ${b})`);
      } else {
        colors.set(id, '#e2e8f0'); // Light gray for no salary
      }
    });
    return colors;
  }, [showSalaryGradient, jobInfo, parseSalary, salaryRange]);

  const getNodeColor = useCallback(
    (node) => {
      if (node.group === -1) return '#fff';
      if (filterText && !filteredNodes.has(node.id)) return '#f8fafc';

      if (showSalaryGradient) {
        return nodeSalaryColors.get(node.id) || '#e2e8f0';
      }

      return readJobs.has(node.id) ? '#f1f5f9' : '#fef9c3';
    },
    [readJobs, filterText, filteredNodes, showSalaryGradient, nodeSalaryColors]
  );

  const getNodeBackground = useCallback(
    (node) => {
      if (node.group === -1) return '#fff';
      if (filterText && !filteredNodes.has(node.id)) return '#f8fafc';

      if (showSalaryGradient && jobInfo[node.id]) {
        const salary = parseSalary(jobInfo[node.id].salary);
        if (salary) {
          const percentage =
            (salary - salaryRange.min) / (salaryRange.max - salaryRange.min);
          const lightBlue = [219, 234, 254]; // bg-blue-100
          const darkBlue = [30, 64, 175]; // bg-blue-800

          const r = Math.round(
            lightBlue[0] + (darkBlue[0] - lightBlue[0]) * percentage
          );
          const g = Math.round(
            lightBlue[1] + (darkBlue[1] - lightBlue[1]) * percentage
          );
          const b = Math.round(
            lightBlue[2] + (darkBlue[2] - lightBlue[2]) * percentage
          );

          return `rgb(${r}, ${g}, ${b})`;
        }
        return '#e2e8f0'; // Light gray for no salary
      }

      return readJobs.has(node.id) ? '#f1f5f9' : '#fef9c3';
    },
    [
      readJobs,
      filterText,
      filteredNodes,
      showSalaryGradient,
      jobInfo,
      parseSalary,
      salaryRange,
    ]
  );

  // Function to preload and cache image
  const getCachedImage = (src) => {
    if (!imageCache.current.has(src)) {
      const img = new Image();
      img.src = src;
      imageCache.current.set(src, img);
    }
    return imageCache.current.get(src);
  };

  // Center and zoom the graph when it's ready
  const handleEngineStop = useCallback(() => {
    console.log('ENGINE STOPPED Graph instance:', graphRef.current);
    if (graphRef.current) {
      if (!isInitialized) {
        const fg = graphRef.current;
        console.log('FG IS STARTING', fg);
        if (fg) {
          // Deactivate existing forces if necessary
          // fg.d3Force('center', null);
          fg.d3Force(
            'charge',
            forceManyBody()
              .strength(-300) // Negative values repel nodes; adjust this value for more/less repulsion
              .distanceMax(600) // Maximum distance where the charge force is applied
              .distanceMin(20) // Minimum distance where the charge force is applied
          );

          // Add custom collision force
          fg.d3Force(
            'collide',
            forceCollide().radius((node) => calculateCollisionRadius(node))
          );

          setIsInitialized(true);
        }
      }
    }
  }, [isInitialized]);

  const handleCanvasClick = useCallback(
    (event) => {
      if (!graphRef.current) return;

      const canvas = graphRef.current.canvas;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Check if click is on a node
      const clickedNode = graphData?.nodes.find((node) => {
        const dx = x - node.x;
        const dy = y - node.y;
        return Math.sqrt(dx * dx + dy * dy) <= node.size;
      });

      if (clickedNode) {
        setActiveNode(clickedNode);
      }
    },
    [graphData]
  );

  useEffect(() => {
    if (graphRef.current?.canvas && dimensions.width && dimensions.height) {
      const canvas = graphRef.current.canvas;
      canvas.addEventListener('click', handleCanvasClick);

      return () => {
        canvas.removeEventListener('click', handleCanvasClick);
      };
    }
  }, [handleCanvasClick, dimensions]);

  useEffect(() => {
    const container = document.getElementById('graph-container');
    if (container) {
      const width = container.offsetWidth;
      const height = 600;
      setDimensions({ width, height });
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post('/api/jobs-graph', { username });
        const { graphData, jobInfoMap, mostRelevant, lessRelevant, allJobs } =
          response.data;

        setMostRelevant(mostRelevant);
        setLessRelevant(lessRelevant);
        setJobs(allJobs);
        setJobInfo(jobInfoMap);
        setGraphData(graphData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username]);

  if (isLoading || !graphData) {
    return (
      <div className="p-6">
        <div className="mt-4 text-lg">
          <p>Loading jobs graph...</p>
        </div>
        <div
          id="graph-container"
          className="w-full h-[600px] bg-blue-50 relative mt-4"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6 mb-8 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Matches Graph</h1>
          <p className="text-lg text-gray-600">
            This graph shows jobs that match your resume. The closer a job matches your skills and experience, the larger and more connected its circle will be.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">How to Use the Graph</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Reading the Graph</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Your resume sits in the center
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Bigger circles mean closer skill matches
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Numbers show match rank (1 is the best match)
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Tools to Help You</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Click any job to see its details
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Search helps find specific jobs
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Salary view shows pay ranges in blue
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Mark jobs as read to keep track
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* {!jobs && <Loading />} */}
      <div className="mt-4 text-lg">
        {jobs ? (
          <div className="flex flex-col gap-4">
            <p>
              Found {jobs.length} related jobs ({mostRelevant.length} highly
              relevant)
            </p>
            <div className="flex items-center gap-4 w-full max-w-xl">
              <input
                type="text"
                placeholder="Filter jobs by title, company, skills..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={showSalaryGradient}
                    onChange={(e) => setShowSalaryGradient(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    Salary View
                  </span>
                </label>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading jobs...</p>
        )}
      </div>

      <div
        id="graph-container"
        style={{
          width: '100%',
          height: '600px',
          position: 'relative',
        }}
      >
        {activeNode && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              maxWidth: '300px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #000',
              zIndex: 1000,
              whiteSpace: 'pre-wrap',
            }}
          >
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <button
                  onClick={() => markJobAsRead(activeNode.id)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: readJobs.has(activeNode.id)
                      ? '#e2e8f0'
                      : '#fff',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  {readJobs.has(activeNode.id) ? 'Read ✓' : 'Mark as Read'}
                </button>
                <button
                  onClick={() => {
                    setActiveNode(null);
                  }}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: '1px solid #000',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    padding: 0,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
              {formatTooltip(jobInfo[activeNode.id])}
              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    {jobInfo[activeNode.id]?.location?.city || 'Remote'}{' '}
                    {jobInfo[activeNode.id]?.type || ''}
                  </p>
                </div>
                <a
                  href={`/jobs/${activeNode.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Details
                </a>
              </div>
              {jobInfo[activeNode.id]?.salary && (
                <p className="text-sm text-gray-500 mt-1">
                  Salary: {jobInfo[activeNode.id].salary}
                </p>
              )}
            </div>
          </div>
        )}
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          nodeLabel={null}
          nodeColor={(node) => getNodeColor(node)}
          nodeVal={(node) => node.size}
          nodeCanvasObjectMode={() => 'after'}
          nodeCanvasObject={(node, ctx) => {
            // Set resume node size
            if (node.group === -1) {
              node.size = 80;
            }
            // Calculate other node sizes based on relevance
            else {
              const jobIndex = [...mostRelevant, ...lessRelevant].findIndex(
                (j) => j.uuid === node.id
              );
              if (jobIndex !== -1) {
                const maxSize = 36;
                const minSize = 4;
                const sizeRange = maxSize - minSize;
                const totalJobs = mostRelevant.length + lessRelevant.length;
                node.size = Math.max(
                  minSize,
                  maxSize - (sizeRange * jobIndex) / totalJobs
                );
              }
            }

            // Draw node
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
            ctx.fillStyle = getNodeBackground(node);
            ctx.fill();
            ctx.strokeStyle = getNodeColor(node);
            ctx.lineWidth = 2;
            ctx.stroke();

            if (node.group === -1 && node.image) {
              // Resume node with image
              const img = getCachedImage(node.image);

              if (img.complete) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
                ctx.clip();
                ctx.drawImage(
                  img,
                  node.x - node.size,
                  node.y - node.size,
                  node.size * 2,
                  node.size * 2
                );
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.restore();
              } else {
                // Draw default circle while image is loading
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
                ctx.fillStyle = getNodeColor(node);
                ctx.fill();
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.stroke();
              }
            } else {
              // Default node rendering for all other cases
              ctx.beginPath();
              ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
              ctx.fillStyle = getNodeColor(node);
              ctx.fill();
              ctx.strokeStyle = '#000';
              ctx.lineWidth = 1;
              ctx.stroke();
            }

            // Draw rank number for job nodes
            if (node.group !== -1) {
              const jobIndex = [...mostRelevant, ...lessRelevant].findIndex(
                (j) => j.uuid === node.id
              );
              if (jobIndex !== -1) {
                const fontSize = Math.max(10, node.size * 0.8);
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#000';
                ctx.fillText(jobIndex + 1, node.x, node.y);
              }
            }

            // Draw regular label for resume node
            if (node.group === -1) {
              const label = node.label || node.id;
              const fontSize = Math.max(14, node.size);
              ctx.font = `bold ${fontSize}px Sans-Serif`;
              const textWidth = ctx.measureText(label).width;
              const bckgDimensions = [textWidth, fontSize].map(
                (n) => n + fontSize * 0.2
              );

              // Draw background for label
              ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
              ctx.strokeStyle = '#000';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.roundRect(
                node.x - bckgDimensions[0] / 2,
                node.y - bckgDimensions[1] * 2,
                bckgDimensions[0],
                bckgDimensions[1],
                5
              );
              ctx.fill();
              ctx.stroke();

              // Draw label
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#000';
              ctx.fillText(label, node.x, node.y - bckgDimensions[1] * 1.5);
            }
          }}
          nodePointerAreaPaint={(node, color, ctx) => {
            // Draw a larger hit area for hover detection
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size * 2, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
          }}
          onRenderFramePost={() => {
            // No need to render tooltip in canvas anymore since we're using DOM
          }}
          linkWidth={(link) => Math.sqrt(link.value) * 2}
          linkColor="#cccccc"
          linkOpacity={0.3}
          enableNodeDrag={true}
          cooldownTicks={100}
          warmupTicks={100}
          width={dimensions.width}
          height={dimensions.height}
          onEngineStop={handleEngineStop}
          minZoom={0.1}
          maxZoom={5}
          forceEngine="d3"
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
          onNodeHover={(node) => {
            if (node) {
              setActiveNode(node);
            }
          }}
        />
      </div>
    </div>
  );
}
