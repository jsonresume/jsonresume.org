'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';

/**
 * Resume JSON editor tab with save status and reset functionality.
 */
export default function ResumeEditorTab({
  resumeJson,
  updateResumeJson,
  debouncedSave,
  isResumeSaving,
  hasPendingChanges,
  userId,
  sessionId,
}) {
  const [isResetting, setIsResetting] = useState(false);

  const handleResetResume = async () => {
    if (
      !window.confirm(
        'This will delete your current resume data. Are you sure?'
      )
    ) {
      return;
    }
    setIsResetting(true);
    try {
      const params = new URLSearchParams();
      if (userId) params.set('userId', userId);
      else if (sessionId) params.set('sessionId', sessionId);
      await fetch(`/api/pathways/resume?${params}`, { method: 'DELETE' });
      window.location.reload();
    } catch {
      // Reset failed silently
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="h-full relative">
      <div className="absolute top-2 right-4 z-10 flex items-center gap-2">
        {isResumeSaving ? (
          <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
            Saving...
          </span>
        ) : hasPendingChanges ? (
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
            Unsaved changes
          </span>
        ) : null}
        <button
          onClick={handleResetResume}
          disabled={isResetting}
          className="text-xs text-gray-500 hover:text-red-600 bg-white/80 px-2 py-1 rounded flex items-center gap-1 disabled:opacity-50"
          title="Reset resume (clears all data)"
        >
          <RotateCcw className="w-3 h-3" />
          {isResetting ? 'Resetting...' : 'Reset'}
        </button>
      </div>
      <Editor
        height="100%"
        defaultLanguage="json"
        value={resumeJson}
        onChange={(code) => {
          updateResumeJson(code || '');
          debouncedSave(code || '');
        }}
        options={{
          minimap: { enabled: false },
          wordWrap: 'on',
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}
