import { logger } from '@/lib/logger';
import applyResumeChanges from '../utils/applyResumeChanges';
import { findMatchingJobs } from '../utils/jobFilterMatcher';

/**
 * Apply resume update from AI tool invocation.
 */
export function applyResumeUpdate(
  currentResume,
  { changes, explanation },
  { setResumeData, saveResumeChanges }
) {
  if (!changes || typeof changes !== 'object') return;

  const updated = applyResumeChanges(currentResume, changes);
  setResumeData(updated);

  if (saveResumeChanges) {
    saveResumeChanges(changes, explanation, 'ai_update').catch((err) =>
      logger.error({ error: err.message }, 'Failed to persist resume changes')
    );
  }
}

/**
 * Apply filter action to matching jobs.
 */
export function applyFilterAction(
  matchingIds,
  action,
  { markAsRead, markAsInterested, markAsHidden, clearJobState }
) {
  matchingIds.forEach((jobId) => {
    switch (action) {
      case 'mark_read':
        markAsRead?.(jobId);
        break;
      case 'mark_interested':
        markAsInterested?.(jobId);
        break;
      case 'mark_hidden':
        markAsHidden?.(jobId);
        break;
      case 'unmark':
        clearJobState?.(jobId);
        break;
    }
  });
}

/**
 * Filter jobs by criteria and apply action + optional batch feedback.
 */
export async function executeFilterJobs(
  { criteria, action, reason },
  {
    jobs,
    jobInfo,
    userId,
    markAsRead,
    markAsInterested,
    markAsHidden,
    clearJobState,
  }
) {
  if (!criteria || !jobs?.length) return;

  const matchingIds = findMatchingJobs(criteria, jobs, jobInfo);
  applyFilterAction(matchingIds, action, {
    markAsRead,
    markAsInterested,
    markAsHidden,
    clearJobState,
  });

  if (reason && userId && matchingIds.length > 0) {
    const feedbacks = matchingIds.map((jobId) => ({
      jobId,
      feedback: reason,
      sentiment: action === 'mark_interested' ? 'interested' : 'dismissed',
      jobTitle: jobInfo[jobId]?.title,
      jobCompany: jobInfo[jobId]?.company,
    }));

    try {
      await fetch('/api/pathways/feedback/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, feedbacks }),
      });
    } catch (error) {
      logger.error({ error: error.message }, 'Failed to save batch feedback');
    }
  }
}

/**
 * Save individual job feedback and update job state.
 */
export async function executeSaveJobFeedback(
  { jobId, jobTitle, jobCompany, feedback, sentiment },
  { userId, markAsRead, markAsInterested }
) {
  if (!userId || !jobId || !feedback) return;

  try {
    await fetch('/api/pathways/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        jobId,
        feedback,
        sentiment,
        jobTitle,
        jobCompany,
      }),
    });

    if (sentiment === 'interested' || sentiment === 'applied') {
      markAsInterested?.(jobId);
    } else {
      markAsRead?.(jobId);
    }
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to save job feedback');
  }
}
