import logger from '../logger.js';

/**
 * Discord webhook notification utility
 * Sends formatted messages to Discord channels for monitoring platform events
 */

// Discord embed color codes
const COLORS = {
  SUCCESS: 0x00ff00, // Green
  INFO: 0x0099ff, // Blue
  WARNING: 0xffaa00, // Yellow
  ERROR: 0xff0000, // Red
};

/**
 * Send a notification to Discord webhook
 * @param {Object} options - Notification options
 * @param {string} options.title - Notification title
 * @param {string} options.description - Notification description
 * @param {string} options.color - Color type (success, info, warning, error)
 * @param {Array} options.fields - Additional fields [{name, value, inline}]
 * @param {string} options.url - Optional URL to link
 * @returns {Promise<boolean>} Success status
 */
async function sendNotification({
  title,
  description,
  color = 'info',
  fields = [],
  url,
}) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    logger.debug('Discord webhook URL not configured, skipping notification');
    return false;
  }

  const colorValue = COLORS[color.toUpperCase()] || COLORS.INFO;

  const embed = {
    title,
    description,
    color: colorValue,
    fields,
    timestamp: new Date().toISOString(),
  };

  if (url) {
    embed.url = url;
  }

  const payload = {
    embeds: [embed],
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      logger.error(
        { status: response.status, statusText: response.statusText },
        'Failed to send Discord notification'
      );
      return false;
    }

    logger.debug({ title }, 'Discord notification sent successfully');
    return true;
  } catch (error) {
    logger.error(
      { error: error.message, title },
      'Error sending Discord notification'
    );
    return false;
  }
}

/**
 * Send critical error notification
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 * @returns {Promise<boolean>} Success status
 */
export async function notifyCriticalError(error, context = {}) {
  const fields = [
    {
      name: 'Error Type',
      value: error.name || 'Error',
      inline: true,
    },
    {
      name: 'Message',
      value: error.message.substring(0, 1024), // Discord field limit
      inline: false,
    },
  ];

  if (context.endpoint) {
    fields.push({
      name: 'Endpoint',
      value: context.endpoint,
      inline: true,
    });
  }

  if (context.user) {
    fields.push({
      name: 'User',
      value: context.user,
      inline: true,
    });
  }

  if (error.stack) {
    const stackPreview = error.stack.substring(0, 1024);
    fields.push({
      name: 'Stack Trace',
      value: `\`\`\`\n${stackPreview}\n\`\`\``,
      inline: false,
    });
  }

  return await sendNotification({
    title: '🚨 Critical Error',
    description: 'A critical error occurred in production',
    color: 'error',
    fields,
  });
}

/**
 * Send deployment notification
 * @param {string} status - Deployment status (success/failure)
 * @param {Object} details - Deployment details
 * @returns {Promise<boolean>} Success status
 */
export async function notifyDeployment(status, details = {}) {
  const isSuccess = status === 'success';
  const emoji = isSuccess ? '✅' : '❌';

  const fields = [];

  if (details.environment) {
    fields.push({
      name: 'Environment',
      value: details.environment,
      inline: true,
    });
  }

  if (details.commit) {
    fields.push({
      name: 'Commit',
      value: details.commit.substring(0, 7),
      inline: true,
    });
  }

  if (details.message) {
    fields.push({
      name: 'Commit Message',
      value: details.message.substring(0, 200),
      inline: false,
    });
  }

  return await sendNotification({
    title: `${emoji} Deployment ${isSuccess ? 'Successful' : 'Failed'}`,
    description: isSuccess
      ? 'New version deployed successfully'
      : 'Deployment failed, please investigate',
    color: isSuccess ? 'success' : 'error',
    fields,
    url: details.url,
  });
}

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

export const DiscordNotifications = {
  sendNotification,
  notifyCriticalError,
  notifyDeployment,
  notifyUserSignup,
  notifyFeatureUsage,
};

export default DiscordNotifications;
