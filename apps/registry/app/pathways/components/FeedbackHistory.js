'use client';

import React, { useCallback } from 'react';
import { TableVirtuoso } from 'react-virtuoso';
import { ThumbsUp, RefreshCw } from 'lucide-react';
import { usePathways } from '../context/PathwaysContext';
import useFeedbackHistory from '../hooks/useFeedbackHistory';
import SentimentBadge from './feedback/SentimentBadge';
import { formatDate } from './feedback/feedbackUtils';

function TableHeader() {
  return (
    <tr className="bg-gray-50 border-b sticky top-0">
      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-48">
        Job
      </th>
      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
        Sentiment
      </th>
      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
        Feedback
      </th>
      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">
        Date
      </th>
    </tr>
  );
}

function FeedbackTableRow({ item }) {
  return (
    <>
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 text-sm truncate max-w-[180px]">
            {item.job_title || 'Unknown Position'}
          </span>
          <span className="text-xs text-gray-500 truncate max-w-[180px]">
            {item.job_company || 'Unknown Company'}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <SentimentBadge sentiment={item.sentiment} />
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-gray-700 line-clamp-2">{item.feedback}</p>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
        {formatDate(item.created_at)}
      </td>
    </>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-2 text-gray-500">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="text-sm">Loading feedback history...</span>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3 text-gray-500">
        <p className="text-sm text-red-500">Error: {error}</p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-2 text-gray-500">
        <ThumbsUp className="w-8 h-8 text-gray-300" />
        <p className="text-sm">No feedback yet</p>
        <p className="text-xs text-gray-400">
          Review jobs in the graph to start building your feedback history
        </p>
      </div>
    </div>
  );
}

const TableBody = React.forwardRef((props, ref) => (
  <tbody {...props} ref={ref} />
));
TableBody.displayName = 'TableBody';

export default function FeedbackHistory() {
  const { userId } = usePathways();
  const { feedback, isLoading, error, refresh } = useFeedbackHistory(userId);

  const rowContent = useCallback(
    (_index, item) => <FeedbackTableRow item={item} />,
    []
  );

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refresh} />;
  if (feedback.length === 0) return <EmptyState />;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">
            Feedback History
          </h2>
          <p className="text-xs text-gray-500">
            {feedback.length} job{feedback.length !== 1 ? 's' : ''} reviewed
          </p>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      <div className="flex-1">
        <TableVirtuoso
          data={feedback}
          fixedHeaderContent={() => <TableHeader />}
          itemContent={rowContent}
          style={{ height: '100%' }}
          components={{
            Table: ({ style, ...props }) => (
              <table
                {...props}
                style={style}
                className="w-full text-left border-collapse"
              />
            ),
            TableHead: (props) => <thead {...props} />,
            TableRow: ({ style, ...props }) => (
              <tr
                {...props}
                style={style}
                className="border-b hover:bg-gray-50 transition-colors"
              />
            ),
            TableBody,
          }}
        />
      </div>
    </div>
  );
}
