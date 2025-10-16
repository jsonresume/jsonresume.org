import logger from '../logger.js';
import { COLORS, getWebhookUrl } from './config.js';

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
export async function sendNotification({
  title,
  description,
  color = 'info',
  fields = [],
  url,
}) {
  const webhookUrl = getWebhookUrl();

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
