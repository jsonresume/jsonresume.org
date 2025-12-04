import { sendNotification } from '../sender.js';

/**
 * Send cover letter generated notification
 * @param {string} username - User who generated cover letter
 * @param {Object} details - Generation details
 * @returns {Promise<boolean>} Success status
 */
export async function notifyCoverLetterGenerated(username, details = {}) {
  const fields = [
    {
      name: 'User',
      value: username,
      inline: true,
    },
  ];

  if (details.jobTitle) {
    fields.push({
      name: 'Job Title',
      value: details.jobTitle.substring(0, 100),
      inline: true,
    });
  }

  if (details.company) {
    fields.push({
      name: 'Company',
      value: details.company,
      inline: true,
    });
  }

  if (details.model) {
    fields.push({
      name: 'AI Model',
      value: details.model,
      inline: true,
    });
  }

  return await sendNotification({
    title: '📝 Cover Letter Generated',
    description: 'AI-generated cover letter created',
    color: 'info',
    fields,
  });
}

/**
 * Send interview session notification
 * @param {string} username - User who started interview
 * @param {Object} details - Session details
 * @returns {Promise<boolean>} Success status
 */
export async function notifyInterviewSession(username, details = {}) {
  const fields = [
    {
      name: 'User',
      value: username,
      inline: true,
    },
  ];

  if (details.position) {
    fields.push({
      name: 'Position',
      value: details.position,
      inline: true,
    });
  }

  if (details.duration) {
    fields.push({
      name: 'Duration',
      value: `${details.duration} minutes`,
      inline: true,
    });
  }

  return await sendNotification({
    title: '🎤 Interview Session Started',
    description: 'User started an interview practice session',
    color: 'info',
    fields,
  });
}

/**
 * Send AI suggestions accepted notification
 * @param {string} username - User who accepted suggestions
 * @param {Object} details - Suggestion details
 * @returns {Promise<boolean>} Success status
 */
export async function notifyAISuggestionsAccepted(username, details = {}) {
  const fields = [
    {
      name: 'User',
      value: username,
      inline: true,
    },
  ];

  if (details.suggestionType) {
    fields.push({
      name: 'Type',
      value: details.suggestionType,
      inline: true,
    });
  }

  if (details.changesApplied) {
    fields.push({
      name: 'Changes Applied',
      value: details.changesApplied.toString(),
      inline: true,
    });
  }

  return await sendNotification({
    title: '✨ AI Suggestions Accepted',
    description: 'User applied AI-generated resume improvements',
    color: 'info',
    fields,
  });
}

/**
 * Send feature usage notification
 * @param {string} featureName - Name of the feature
 * @param {Object} details - Usage details
 * @returns {Promise<boolean>} Success status
 */
export async function notifyFeatureUsage(featureName, details = {}) {
  const fields = [];

  if (details.username) {
    fields.push({
      name: 'User',
      value: details.username,
      inline: true,
    });
  }

  Object.entries(details).forEach(([key, value]) => {
    if (key !== 'username' && typeof value === 'string') {
      fields.push({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: value.substring(0, 1024),
        inline: true,
      });
    }
  });

  return await sendNotification({
    title: `🎯 ${featureName} Used`,
    description: `Feature: ${featureName}`,
    color: 'info',
    fields,
  });
}
