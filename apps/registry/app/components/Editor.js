'use client';

import { useAuth } from '../context/auth';
import { ResumeProvider } from '../providers/ResumeProvider';
import { EditorContent } from './EditorModule/components/EditorContent';

export default function Editor() {
  const { user, loading: authLoading } = useAuth();
  const username = user?.user_metadata?.user_name;

  if (authLoading) {
    return <div className="text-lg text-center py-10">Loading...</div>;
  }

  if (!username) {
    return (
      <div className="text-lg text-center py-10">
        Unable to determine username. Please try logging in again.
      </div>
    );
  }

  return (
    <ResumeProvider targetUsername={username}>
      <EditorContent />
    </ResumeProvider>
  );
}
