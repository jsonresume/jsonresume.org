'use client';

import { useState } from 'react';
import { Button } from '@repo/ui';
import { PrivacySection } from './PrivacySection';
import logger from '@/lib/logger';

export const DeleteCacheSection = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleDeleteCache = async () => {
    if (
      !confirm(
        'Are you sure you want to delete your cached resume data? This will remove your resume from the /explore search results.'
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setDeleteStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/privacy/delete-cache', {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete cache');
      }

      setDeleteStatus({
        type: 'success',
        message: `Successfully deleted ${data.deletedCount} cached ${
          data.deletedCount === 1 ? 'entry' : 'entries'
        }. Your resume will no longer appear in search results.`,
      });

      logger.info({ username: data.username }, 'User deleted cache via UI');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';

      setDeleteStatus({
        type: 'error',
        message: errorMessage,
      });

      logger.error({ error: errorMessage }, 'Cache deletion failed');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PrivacySection number="7" title="Delete Your Cached Data">
      <p>
        If you've deleted your GitHub gist but still see your resume in the
        /explore search results, you can manually delete your cached data here.
      </p>

      <div className="mt-4">
        <Button
          onClick={handleDeleteCache}
          disabled={isDeleting}
          variant="destructive"
        >
          {isDeleting ? 'Deleting...' : 'Delete My Cached Resume Data'}
        </Button>
      </div>

      {deleteStatus.type && (
        <div
          className={`mt-4 p-4 rounded ${
            deleteStatus.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <p className="text-sm font-medium">{deleteStatus.message}</p>
        </div>
      )}

      <p className="mt-4 text-sm text-gray-600">
        <strong>Note:</strong> This only deletes cached data. If your GitHub
        gist is still public, your resume may be re-cached the next time someone
        views it. To permanently remove your data, delete your GitHub gist
        first.
      </p>
    </PrivacySection>
  );
};
