'use client';

import { useState } from 'react';
import { Button } from '@repo/ui';
import logger from '@/lib/logger';

/**
 * Cache Refresh Button Component
 * Allows users to clear their cached resume data
 */
export function CacheRefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState(null);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      setMessage(null);

      const response = await fetch('/api/privacy/delete-cache', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to clear cache');
      }

      setMessage({
        type: 'success',
        text: 'Cache cleared successfully! Refreshing page...',
      });

      logger.info('Cache cleared successfully');

      // Reload page after 1.5 seconds to show fresh data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      logger.error({ error: error.message }, 'Failed to clear cache');
      setMessage({
        type: 'error',
        text: `Failed to clear cache: ${error.message}`,
      });
      setIsRefreshing(false);
    }
  };

  return (
    <div className="cache-refresh-container">
      <Button
        onClick={handleRefresh}
        disabled={isRefreshing}
        variant="secondary"
        size="sm"
      >
        {isRefreshing ? '🔄 Clearing Cache...' : '🔄 Refresh Resume Data'}
      </Button>

      {message && (
        <div
          className={`mt-2 text-sm ${
            message.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message.text}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Clear cached data to see the latest changes from your gist
      </p>
    </div>
  );
}
