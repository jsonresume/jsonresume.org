'use client';

import { ThumbsUp, ThumbsDown, HelpCircle, Send, X } from 'lucide-react';

export const SENTIMENT_CONFIG = {
  interested: {
    icon: ThumbsUp,
    label: 'Interested',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  not_interested: {
    icon: ThumbsDown,
    label: 'Not Interested',
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  maybe: {
    icon: HelpCircle,
    label: 'Maybe',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
  applied: {
    icon: Send,
    label: 'Applied',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  dismissed: {
    icon: X,
    label: 'Dismissed',
    color: 'text-gray-500',
    bg: 'bg-gray-50',
  },
};

export default function SentimentBadge({ sentiment }) {
  const config = SENTIMENT_CONFIG[sentiment] || SENTIMENT_CONFIG.dismissed;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}
