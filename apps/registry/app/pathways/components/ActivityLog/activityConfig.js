import {
  FileEdit,
  MessageSquare,
  Bot,
  Eye,
  Star,
  EyeOff,
  Volume2,
  Mic,
  AlertCircle,
  Upload,
  RefreshCw,
  Sparkles,
  Trash2,
  LogIn,
  Play,
} from 'lucide-react';

export const ACTIVITY_TYPES = {
  // Chat activities
  message_sent: {
    icon: MessageSquare,
    label: 'Message sent',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
  },
  ai_response: {
    icon: Bot,
    label: 'AI response',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  tool_invoked: {
    icon: Sparkles,
    label: 'Tool used',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
  },
  conversation_cleared: {
    icon: Trash2,
    label: 'Conversation cleared',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },

  // Resume activities
  resume_updated: {
    icon: FileEdit,
    label: 'Resume updated',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  resume_uploaded: {
    icon: Upload,
    label: 'Resume uploaded',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },

  // Job activities
  job_read: {
    icon: Eye,
    label: 'Job marked read',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  job_interested: {
    icon: Star,
    label: 'Job saved',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  job_hidden: {
    icon: EyeOff,
    label: 'Job hidden',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  jobs_refreshed: {
    icon: RefreshCw,
    label: 'Jobs refreshed',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
  },

  // Voice activities
  speech_toggled: {
    icon: Volume2,
    label: 'Speech toggled',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
  },
  speech_generated: {
    icon: Volume2,
    label: 'Speech generated',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
  },
  recording_started: {
    icon: Mic,
    label: 'Recording started',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  recording_completed: {
    icon: Mic,
    label: 'Recording completed',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  transcription_completed: {
    icon: Mic,
    label: 'Transcription done',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },

  // Session activities
  session_started: {
    icon: Play,
    label: 'Session started',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
  user_authenticated: {
    icon: LogIn,
    label: 'Signed in',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },

  // Error activities
  error: {
    icon: AlertCircle,
    label: 'Error',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
};

export const ACTIVITY_FILTERS = [
  { value: '', label: 'All activities' },
  {
    value: 'resume',
    label: 'Resume',
    types: ['resume_updated', 'resume_uploaded'],
  },
  {
    value: 'chat',
    label: 'Chat',
    types: [
      'message_sent',
      'ai_response',
      'tool_invoked',
      'conversation_cleared',
    ],
  },
  {
    value: 'jobs',
    label: 'Jobs',
    types: ['job_read', 'job_interested', 'job_hidden', 'jobs_refreshed'],
  },
  {
    value: 'voice',
    label: 'Voice',
    types: [
      'speech_toggled',
      'speech_generated',
      'recording_started',
      'recording_completed',
      'transcription_completed',
    ],
  },
];

// Utility functions exported from activityUtils.js
export { getActivityConfig, formatRelativeTime } from './activityUtils';
