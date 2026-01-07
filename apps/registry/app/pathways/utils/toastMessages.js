import { toast } from 'sonner';

export const pathwaysToast = {
  // Success messages
  resumeUpdated: () =>
    toast.success('Resume updated', {
      description: 'Your changes have been saved',
    }),

  conversationSaved: () =>
    toast.success('Conversation saved', { duration: 2000 }),

  conversationCleared: () =>
    toast.success('Conversation cleared', {
      description: 'Starting fresh',
    }),

  jobsRefreshed: (count) =>
    toast.success(`Found ${count} matching jobs`, {
      description: 'Job graph updated',
    }),

  resumeParsed: (filename) =>
    toast.success(`Parsed ${filename}`, {
      description: 'Review the extracted data below',
    }),

  // Error messages
  embeddingError: () =>
    toast.error('Failed to analyze resume', {
      description: 'Please try again or refresh the page',
    }),

  jobsFetchError: () =>
    toast.error('Failed to load jobs', {
      description: 'Check your connection and try again',
      action: {
        label: 'Retry',
        onClick: () => window.location.reload(),
      },
    }),

  speechError: () =>
    toast.error('Speech generation failed', {
      description: 'Voice output is temporarily unavailable',
    }),

  transcriptionError: (message) =>
    toast.error('Transcription failed', {
      description: message || 'Could not convert speech to text',
    }),

  uploadError: (filename) =>
    toast.error(`Failed to parse ${filename}`, {
      description: 'The file may be corrupted or in an unsupported format',
    }),

  conversationLoadError: () =>
    toast.error('Failed to load conversation', {
      description: 'Starting with a fresh conversation',
    }),

  conversationSaveError: () =>
    toast.error('Failed to save conversation', {
      description: 'Your messages may not be persisted',
    }),

  apiError: (message) =>
    toast.error('Something went wrong', {
      description: message || 'Please try again',
    }),

  // Info messages
  embeddingStarted: () =>
    toast.info('Analyzing your resume...', {
      description: 'Finding matching jobs',
      duration: 10000,
    }),

  microphonePermission: () =>
    toast.info('Microphone access needed', {
      description: 'Allow microphone access to use voice input',
    }),

  // Loading messages (returns dismiss function)
  loading: (message) =>
    toast.loading(message, {
      description: 'Please wait...',
    }),
};

export default pathwaysToast;
