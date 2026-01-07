'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, RefreshCw, Activity, AlertCircle } from 'lucide-react';
import { Button } from '@repo/ui';
import ActivityItem from './ActivityItem';
import ActivityFilters from './ActivityFilters';
import { ACTIVITY_FILTERS } from './activityConfig';
import useActivityLog from '../../hooks/useActivityLog';

export default function ActivityLog({ isOpen, onClose }) {
  const {
    activities,
    isLoading,
    hasMore,
    total,
    error,
    hasFetched,
    fetchActivities,
    loadMore,
    refresh,
  } = useActivityLog();

  const [filter, setFilter] = useState('');
  const scrollRef = useRef(null);
  const loadMoreRef = useRef(null);

  // Fetch activities when opened (only once per session)
  useEffect(() => {
    if (isOpen && activities.length === 0 && !hasFetched && !error) {
      fetchActivities(true);
    }
  }, [isOpen, activities.length, hasFetched, error, fetchActivities]);

  // Filter activities client-side
  const filteredActivities = useCallback(() => {
    if (!filter) return activities;

    const filterConfig = ACTIVITY_FILTERS.find((f) => f.value === filter);
    if (!filterConfig || !filterConfig.types) return activities;

    return activities.filter((a) =>
      filterConfig.types.includes(a.activity_type)
    );
  }, [activities, filter])();

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Activity</h2>
            {total > 0 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {total}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={refresh}
              disabled={isLoading}
              className="text-gray-500 hover:text-gray-700"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 py-2 border-b bg-gray-50">
          <ActivityFilters activeFilter={filter} onFilterChange={setFilter} />
        </div>

        {/* Activity List */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-3 space-y-2"
        >
          {error ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <AlertCircle className="w-10 h-10 mb-3 text-red-400" />
              <p className="text-sm font-medium text-red-500">
                Failed to load activities
              </p>
              <p className="text-xs mt-1 text-gray-500">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchActivities(true)}
                className="mt-3 text-gray-600"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Try again
              </Button>
            </div>
          ) : isLoading && activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <RefreshCw className="w-6 h-6 animate-spin mb-2" />
              <p className="text-sm">Loading activities...</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Activity className="w-10 h-10 mb-3 opacity-50" />
              <p className="text-sm font-medium">No activities yet</p>
              <p className="text-xs mt-1">
                Your activity will appear here as you use Pathways
              </p>
            </div>
          ) : (
            <>
              {filteredActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}

              {/* Load more trigger */}
              <div ref={loadMoreRef} className="h-4" />

              {isLoading && activities.length > 0 && (
                <div className="flex justify-center py-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              )}

              {!hasMore && filteredActivities.length > 0 && (
                <p className="text-center text-xs text-gray-400 py-2">
                  That&apos;s all your activity
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
