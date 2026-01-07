/**
 * Simple activity logging utility for Pathways
 * Can be imported and used anywhere without hooks
 */

let pendingActivities = [];
let flushTimeout = null;

/**
 * Log an activity to the server
 * Activities are batched and sent every 500ms for performance
 */
export function logActivity(
  activityType,
  details = {},
  { sessionId, userId } = {}
) {
  // Get session/user from localStorage if not provided
  const effectiveSessionId = sessionId || getStoredSessionId();
  const effectiveUserId = userId;

  if (!effectiveSessionId && !effectiveUserId) {
    console.warn('Cannot log activity: no session or user ID');
    return;
  }

  pendingActivities.push({
    activityType,
    details,
    sessionId: effectiveSessionId,
    userId: effectiveUserId,
  });

  // Debounce batch flush
  if (flushTimeout) {
    clearTimeout(flushTimeout);
  }

  flushTimeout = setTimeout(flushActivities, 500);
}

function flushActivities() {
  if (pendingActivities.length === 0) return;

  const batch = [...pendingActivities];
  pendingActivities = [];

  // Group by session/user
  const grouped = batch.reduce((acc, activity) => {
    const key = activity.userId || activity.sessionId;
    if (!acc[key]) {
      acc[key] = {
        sessionId: activity.sessionId,
        userId: activity.userId,
        activities: [],
      };
    }
    acc[key].activities.push({
      activityType: activity.activityType,
      details: activity.details,
    });
    return acc;
  }, {});

  // Send each group
  Object.values(grouped).forEach(({ sessionId, userId, activities }) => {
    const body =
      activities.length === 1
        ? {
            sessionId,
            userId,
            activityType: activities[0].activityType,
            details: activities[0].details,
          }
        : { sessionId, userId, activities };

    fetch('/api/pathways/activity', {
      method: activities.length === 1 ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch((err) => console.error('Failed to log activity:', err));
  });
}

function getStoredSessionId() {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('pathways_session_id');
  } catch {
    return null;
  }
}

/**
 * Convenience methods for common activity types
 */
export const activityLogger = {
  messageSent: (preview, sessionId, userId) =>
    logActivity(
      'message_sent',
      { preview: preview?.slice(0, 100) },
      { sessionId, userId }
    ),

  aiResponse: (preview, sessionId, userId) =>
    logActivity(
      'ai_response',
      { preview: preview?.slice(0, 100) },
      { sessionId, userId }
    ),

  toolInvoked: (toolName, result, sessionId, userId) =>
    logActivity('tool_invoked', { toolName, result }, { sessionId, userId }),

  resumeUpdated: (section, explanation, sessionId, userId) =>
    logActivity(
      'resume_updated',
      { section, explanation },
      { sessionId, userId }
    ),

  resumeUploaded: (filename, sessionId, userId) =>
    logActivity('resume_uploaded', { filename }, { sessionId, userId }),

  jobRead: (jobId, title, sessionId, userId) =>
    logActivity('job_read', { jobId, title }, { sessionId, userId }),

  jobInterested: (jobId, title, sessionId, userId) =>
    logActivity('job_interested', { jobId, title }, { sessionId, userId }),

  jobHidden: (jobId, title, sessionId, userId) =>
    logActivity('job_hidden', { jobId, title }, { sessionId, userId }),

  jobsRefreshed: (count, sessionId, userId) =>
    logActivity('jobs_refreshed', { count }, { sessionId, userId }),

  speechToggled: (enabled, voice, sessionId, userId) =>
    logActivity('speech_toggled', { enabled, voice }, { sessionId, userId }),

  speechGenerated: (sessionId, userId) =>
    logActivity('speech_generated', {}, { sessionId, userId }),

  recordingStarted: (sessionId, userId) =>
    logActivity('recording_started', {}, { sessionId, userId }),

  recordingCompleted: (duration, sessionId, userId) =>
    logActivity('recording_completed', { duration }, { sessionId, userId }),

  transcriptionCompleted: (preview, sessionId, userId) =>
    logActivity(
      'transcription_completed',
      { preview: preview?.slice(0, 100) },
      { sessionId, userId }
    ),

  conversationCleared: (sessionId, userId) =>
    logActivity('conversation_cleared', {}, { sessionId, userId }),

  sessionStarted: (sessionId) =>
    logActivity('session_started', {}, { sessionId }),

  userAuthenticated: (username, userId) =>
    logActivity('user_authenticated', { username }, { userId }),

  error: (message, endpoint, sessionId, userId) =>
    logActivity('error', { message, endpoint }, { sessionId, userId }),
};

export default activityLogger;
