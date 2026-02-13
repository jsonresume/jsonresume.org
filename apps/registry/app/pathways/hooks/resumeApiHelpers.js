import { logger } from '@/lib/logger';

/**
 * Send a resume PATCH request to the API.
 * Shared by saveChanges and setFullResume.
 */
export async function patchResume({ sessionId, userId, body }) {
  if (!sessionId && !userId) {
    return { success: false, error: 'No session or user' };
  }

  const payload = { ...body };
  if (userId) {
    payload.userId = userId;
  } else {
    payload.sessionId = sessionId;
  }

  const response = await fetch('/api/pathways/resume', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

/**
 * Build query params for resume GET request.
 */
export function buildResumeParams(userId, sessionId) {
  const params = new URLSearchParams();
  if (userId) {
    params.set('userId', userId);
  } else {
    params.set('sessionId', sessionId);
  }
  return params;
}
