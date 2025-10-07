'use client';

import { ResumeProvider } from '../providers/ResumeProvider';
import { logger } from '@/lib/logger';
import Editor from '../components/Editor';

export default function EditorWrapper({ username, session }) {
  logger.debug({ username, session }, 'EditorWrapper:');

  if (!session) {
    return (
      <div className="text-lg text-center py-10">
        Please log in to use the editor.
      </div>
    );
  }

  // Get username from session if not passed directly
  const targetUsername = username || session?.user?.user_metadata?.user_name;

  if (!targetUsername) {
    return (
      <div className="text-lg text-center py-10">
        Unable to determine username. Please try logging in again.
      </div>
    );
  }

  return (
    <ResumeProvider targetUsername={targetUsername}>
      <Editor />
    </ResumeProvider>
  );
}
