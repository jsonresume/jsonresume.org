const { fetchResumeData } = require('./jobs-graph/fetchResumeData');
const {
  generateResumeDescription,
} = require('./jobs-graph/generateResumeDescription');
const { createEmbedding } = require('./jobs-graph/createEmbedding');
const { matchJobs } = require('./jobs-graph/matchJobs');
const {
  buildGraphData,
  buildJobInfoMap,
} = require('./jobs-graph/buildGraphData');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    // Fetch and parse resume
    const resume = await fetchResumeData(username);

    // Generate AI description
    const resumeDescription = await generateResumeDescription(resume);

    // Create embedding
    const embedding = await createEmbedding(resumeDescription);

    // Match jobs
    const sortedJobs = await matchJobs(embedding);

    // Split into most relevant (top 10) and less relevant
    const topJobs = sortedJobs.slice(0, 10);
    const otherJobs = sortedJobs.slice(10);

    // Build graph data
    const graphData = buildGraphData(username, resume, topJobs, otherJobs);

    // Create job info map
    const jobInfoMap = buildJobInfoMap(sortedJobs);

    // Ensure consistent ordering of properties for better caching
    const response = {
      graphData: {
        nodes: graphData.nodes.sort((a, b) => a.id.localeCompare(b.id)),
        links: graphData.links.sort(
          (a, b) =>
            a.source.localeCompare(b.source) || a.target.localeCompare(b.target)
        ),
      },
      jobInfoMap,
      mostRelevant: topJobs,
      lessRelevant: otherJobs,
      allJobs: sortedJobs,
      resume,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in jobs-graph handler:', error);
    const statusCode = error.message === 'Resume not found' ? 404 : 500;
    res.status(statusCode).json({ error: error.message });
  }
}
