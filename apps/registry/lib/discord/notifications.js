/**
 * Discord webhook notification utility
 * Sends formatted messages to Discord channels for monitoring platform events
 */

export { sendNotification } from './sender.js';
export {
  notifyCriticalError,
  notifyDeployment,
  notifyUserSignup,
  notifyFeatureUsage,
} from './notifiers.js';

// Default export for backward compatibility
import { sendNotification } from './sender.js';
import {
  notifyCriticalError,
  notifyDeployment,
  notifyUserSignup,
  notifyFeatureUsage,
} from './notifiers.js';

export const DiscordNotifications = {
  sendNotification,
  notifyCriticalError,
  notifyDeployment,
  notifyUserSignup,
  notifyFeatureUsage,
};

export default DiscordNotifications;
