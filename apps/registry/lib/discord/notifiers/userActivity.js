import { sendNotification } from '../sender.js';

/**
 * Send user signup notification
 * @param {string} username - New user's username
 * @param {Object} details - Signup details
 * @returns {Promise<boolean>} Success status
 */
export async function notifyUserSignup(username, details = {}) {
  const fields = [
    {
      name: 'Username',
      value: username,
      inline: true,
    },
    {
      name: 'Method',
      value: details.method || 'GitHub OAuth',
      inline: true,
    },
  ];

  const resumeUrl = `https://registry.jsonresume.org/${username}`;

  return await sendNotification({
    title: '👤 New User Signup',
    description: 'A new user has joined the platform',
    color: 'success',
    fields,
    url: resumeUrl,
  });
}

/**
 * Send resume published notification
 * @param {string} username - User who published resume
 * @param {Object} details - Publication details
 * @returns {Promise<boolean>} Success status
 */
export async function notifyResumePublished(username, details = {}) {
  const fields = [
    {
      name: 'Username',
      value: username,
      inline: true,
    },
    {
      name: 'Visibility',
      value: details.visibility || 'public',
      inline: true,
    },
  ];

  if (details.theme) {
    fields.push({
      name: 'Theme',
      value: details.theme,
      inline: true,
    });
  }

  const resumeUrl = `https://registry.jsonresume.org/${username}`;

  return await sendNotification({
    title: '📄 Resume Published',
    description: 'A user published their resume',
    color: 'success',
    fields,
    url: resumeUrl,
  });
}

/**
 * Send resume updated notification (throttled to avoid spam)
 * @param {string} username - User who updated resume
 * @param {Object} details - Update details
 * @returns {Promise<boolean>} Success status
 */
export async function notifyResumeUpdated(username, details = {}) {
  const fields = [
    {
      name: 'Username',
      value: username,
      inline: true,
    },
  ];

  if (details.updateType) {
    fields.push({
      name: 'Update Type',
      value: details.updateType,
      inline: true,
    });
  }

  if (details.changesCount) {
    fields.push({
      name: 'Changes',
      value: `${details.changesCount} sections updated`,
      inline: true,
    });
  }

  const resumeUrl = `https://registry.jsonresume.org/${username}`;

  return await sendNotification({
    title: '✏️ Resume Updated',
    description: 'A user updated their resume',
    color: 'info',
    fields,
    url: resumeUrl,
  });
}
