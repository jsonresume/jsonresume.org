import { sendNotification } from '../sender.js';

/**
 * Send new jobs found notification
 * @param {number} count - Number of new jobs found
 * @param {Object} details - Job details
 * @returns {Promise<boolean>} Success status
 */
export async function notifyJobsFound(count, details = {}) {
  const fields = [
    {
      name: 'New Jobs',
      value: count.toString(),
      inline: true,
    },
  ];

  if (details.source) {
    fields.push({
      name: 'Source',
      value: details.source,
      inline: true,
    });
  }

  if (details.topCompanies && details.topCompanies.length > 0) {
    fields.push({
      name: 'Top Companies',
      value: details.topCompanies.slice(0, 5).join(', '),
      inline: false,
    });
  }

  if (details.topRoles && details.topRoles.length > 0) {
    fields.push({
      name: 'Top Roles',
      value: details.topRoles.slice(0, 5).join(', '),
      inline: false,
    });
  }

  return await sendNotification({
    title: '💼 New Jobs Found',
    description: `${count} new job posting${count !== 1 ? 's' : ''} discovered`,
    color: 'success',
    fields,
    url: 'https://registry.jsonresume.org/jobs',
  });
}

/**
 * Send job similarity matches notification
 * @param {number} matchCount - Number of matches computed
 * @param {Object} details - Processing details
 * @returns {Promise<boolean>} Success status
 */
export async function notifyJobMatches(matchCount, details = {}) {
  const fields = [
    {
      name: 'Matches',
      value: matchCount.toString(),
      inline: true,
    },
  ];

  if (details.processingTime) {
    fields.push({
      name: 'Processing Time',
      value: `${details.processingTime}ms`,
      inline: true,
    });
  }

  if (details.embeddingDimensions) {
    fields.push({
      name: 'Embedding Dimensions',
      value: details.embeddingDimensions.toString(),
      inline: true,
    });
  }

  return await sendNotification({
    title: '🎯 Job Matches Computed',
    description: 'Job-resume similarity matches processed',
    color: 'info',
    fields,
  });
}
