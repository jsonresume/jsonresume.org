const { cosineSimilarity } = require('../../../app/utils/vectorUtils');

/**
 * Builds graph data structure with nodes and links
 * @param {string} username - Resume username
 * @param {Object} resume - Resume object
 * @param {Array} topJobs - Top 10 most relevant jobs
 * @param {Array} otherJobs - Less relevant jobs
 * @returns {Object} Graph data with nodes and links
 */
export function buildGraphData(username, resume, topJobs, otherJobs) {
  const graphData = {
    nodes: [
      {
        id: username,
        group: -1,
        size: 24,
        color: resume.basics?.image ? 'url(#resumeImage)' : '#ff0000',
        x: 0,
        y: 0,
        image: resume.basics?.image || null,
      },
      ...topJobs
        .map((job) => {
          try {
            const jobContent = JSON.parse(job.gpt_content);
            const vector = JSON.parse(job.embedding_v5);
            return {
              id: job.uuid,
              label: jobContent.title,
              group: 1,
              size: 4,
              color: '#fff18f',
              vector,
            };
          } catch (e) {
            // Skip jobs with invalid JSON
            return null;
          }
        })
        .filter(Boolean),
      ...otherJobs
        .map((job) => {
          try {
            const jobContent = JSON.parse(job.gpt_content);
            const vector = JSON.parse(job.embedding_v5);
            return {
              id: job.uuid,
              label: jobContent.title,
              group: 2,
              size: 4,
              color: '#fff18f',
              vector,
            };
          } catch (e) {
            // Skip jobs with invalid JSON
            return null;
          }
        })
        .filter(Boolean),
    ],
    links: [
      ...topJobs.map((job) => ({
        source: username,
        target: job.uuid,
        value: job.similarity,
      })),
      // Process other jobs sequentially, each one only looking at previously processed jobs
      ...otherJobs.reduce((links, lessRelevantJob, index) => {
        let lessRelevantVector;
        try {
          lessRelevantVector = JSON.parse(lessRelevantJob.embedding_v5);
        } catch (error) {
          console.error('Error parsing less relevant job embedding:', error);
          return links; // Skip this job if we can't parse its embedding
        }

        // Jobs to compare against: top jobs + already processed less relevant jobs
        const availableJobs = [...topJobs, ...otherJobs.slice(0, index)];

        const mostSimilarJob = availableJobs.reduce(
          (best, current) => {
            const similarity = cosineSimilarity(
              lessRelevantVector,
              (() => {
                try {
                  return JSON.parse(current.embedding_v5);
                } catch (error) {
                  console.error('Error parsing current job embedding:', error);
                  return []; // Return empty array to avoid breaking similarity calculation
                }
              })()
            );
            return similarity > best.similarity
              ? { job: current, similarity }
              : best;
          },
          { job: null, similarity: -1 }
        );

        if (mostSimilarJob.job) {
          links.push({
            source: mostSimilarJob.job.uuid,
            target: lessRelevantJob.uuid,
            value: mostSimilarJob.similarity,
          });
        }

        return links;
      }, []),
    ],
  };

  return graphData;
}

/**
 * Creates job info map from jobs array
 * @param {Array} jobs - Array of job objects
 * @returns {Object} Map of job UUIDs to parsed content with normalized salary data
 */
export function buildJobInfoMap(jobs) {
  const jobInfoMap = {};
  jobs.forEach((job) => {
    try {
      const content = JSON.parse(job.gpt_content);
      // Include normalized salary data from database columns
      jobInfoMap[job.uuid] = {
        ...content,
        salaryUsd: job.salary_usd,
        salaryMin: job.salary_min,
        salaryMax: job.salary_max,
        createdAt: job.created_at,
      };
    } catch (error) {
      console.error(`Error parsing job content for ${job.uuid}:`, error);
      jobInfoMap[job.uuid] = {
        title: 'Unknown Job',
        error: 'Failed to parse job data',
      };
    }
  });
  return jobInfoMap;
}
