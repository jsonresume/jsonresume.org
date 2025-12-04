/**
 * Discord notification functions
 * Organized by category for better maintainability
 */

// User activity notifications
export {
  notifyUserSignup,
  notifyResumePublished,
  notifyResumeUpdated,
} from './notifiers/userActivity.js';

// Job board notifications
export { notifyJobsFound, notifyJobMatches } from './notifiers/jobActivity.js';

// AI feature notifications
export {
  notifyFeatureUsage,
  notifyCoverLetterGenerated,
  notifyInterviewSession,
  notifyAISuggestionsAccepted,
} from './notifiers/aiFeatures.js';

// System health notifications
export {
  notifyCriticalError,
  notifyDeployment,
  notifySecurityVulnerability,
} from './notifiers/systemHealth.js';
