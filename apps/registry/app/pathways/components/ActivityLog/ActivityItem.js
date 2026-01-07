'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getActivityConfig, formatRelativeTime } from './activityConfig';

export default function ActivityItem({ activity }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = getActivityConfig(activity.activity_type);
  const Icon = config.icon;
  const hasDetails =
    activity.details && Object.keys(activity.details).length > 0;

  const getDescription = () => {
    const d = activity.details || {};

    switch (activity.activity_type) {
      case 'message_sent':
        return d.preview || 'Sent a message';
      case 'ai_response':
        return d.preview || 'Received AI response';
      case 'tool_invoked':
        return `Used ${d.toolName || 'a tool'}`;
      case 'resume_updated':
        return d.explanation || `Updated ${d.section || 'resume'}`;
      case 'resume_uploaded':
        return `Uploaded ${d.filename || 'resume file'}`;
      case 'job_read':
        return d.title ? `Read: ${d.title}` : 'Marked job as read';
      case 'job_interested':
        return d.title ? `Saved: ${d.title}` : 'Saved job';
      case 'job_hidden':
        return d.title ? `Hidden: ${d.title}` : 'Hidden job';
      case 'jobs_refreshed':
        return `Loaded ${d.count || ''} jobs`;
      case 'speech_toggled':
        return d.enabled ? 'Enabled speech' : 'Disabled speech';
      case 'speech_generated':
        return 'Generated speech';
      case 'recording_started':
        return 'Started recording';
      case 'recording_completed':
        return `Recorded ${
          d.duration ? `${Math.round(d.duration / 1000)}s` : ''
        }`;
      case 'transcription_completed':
        return d.preview || 'Transcribed voice';
      case 'conversation_cleared':
        return 'Cleared conversation';
      case 'session_started':
        return 'Started session';
      case 'user_authenticated':
        return `Signed in as ${d.username || 'user'}`;
      case 'error':
        return d.message || 'An error occurred';
      default:
        return config.label;
    }
  };

  return (
    <div
      className={`rounded-lg border ${config.borderColor} ${config.bgColor} transition-all duration-200 hover:shadow-sm`}
    >
      <div className="p-3">
        <div className="flex items-start gap-3">
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${config.bgColor} ${config.color}`}
          >
            <Icon className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className={`text-sm font-medium ${config.color}`}>
                {config.label}
              </span>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {formatRelativeTime(activity.timestamp)}
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
              {getDescription()}
            </p>

            {hasDetails && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                {isExpanded ? (
                  <>
                    Hide details <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    Show details <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {isExpanded && hasDetails && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <pre className="text-xs text-gray-600 bg-white/50 rounded p-2 overflow-x-auto">
              {JSON.stringify(activity.details, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
