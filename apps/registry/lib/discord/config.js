/**
 * Discord configuration and constants
 */

// Discord embed color codes
export const COLORS = {
  SUCCESS: 0x00ff00, // Green
  INFO: 0x0099ff, // Blue
  WARNING: 0xffaa00, // Yellow
  ERROR: 0xff0000, // Red
};

/**
 * Get Discord webhook URL from environment
 * @returns {string|null} Webhook URL or null if not configured
 */
export function getWebhookUrl() {
  return process.env.DISCORD_WEBHOOK_URL || null;
}
