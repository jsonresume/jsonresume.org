'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import CopilotChat from './components/CopilotChat';
import ResumePreview from './components/ResumePreview';
import PathwaysGraph from './components/PathwaysGraph';
import PathwaysHeader from './components/PathwaysHeader';
import FeedbackHistory from './components/FeedbackHistory';
import { ActivityLog } from './components/ActivityLog';
import { usePathways } from './context/PathwaysContext';
import usePathwaysSession from './hooks/usePathwaysSession';

/**
 * Main Pathways content component (uses context)
 */
function PathwaysContent() {
  const [activeTab, setActiveTab] = useState('graph');
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const {
    resume,
    resumeJson,
    updateResume,
    updateResumeJson,
    setResumeJson,
    setFullResume,
    isResumeSaving,
    userId,
    sessionId,
  } = usePathways();

  // Save state for JSON editor
  const saveTimeoutRef = useRef(null);
  const lastSavedJsonRef = useRef(resumeJson);
  const pendingJsonRef = useRef(null);

  // Immediate save function (no debounce)
  const saveNow = useCallback(
    async (json) => {
      if (!json || json === lastSavedJsonRef.current) return;
      try {
        const parsed = JSON.parse(json);
        await setFullResume(parsed, 'manual_edit');
        lastSavedJsonRef.current = json;
        pendingJsonRef.current = null;
      } catch {
        // Invalid JSON, don't save
      }
    },
    [setFullResume]
  );

  // Save resume to DB with short debounce (for typing)
  const debouncedSave = useCallback(
    (json) => {
      pendingJsonRef.current = json;

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveNow(json);
      }, 500); // 500ms debounce (reduced from 1.5s)
    },
    [saveNow]
  );

  // Save pending changes before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (
        pendingJsonRef.current &&
        pendingJsonRef.current !== lastSavedJsonRef.current
      ) {
        // Use sendBeacon for reliable save on unload
        try {
          const parsed = JSON.parse(pendingJsonRef.current);
          const payload = {
            diff: parsed,
            explanation: 'Full resume replacement',
            source: 'manual_edit',
            replace: true,
          };
          // Include user identifier
          if (userId) {
            payload.userId = userId;
          } else if (sessionId) {
            payload.sessionId = sessionId;
          }
          navigator.sendBeacon(
            '/api/pathways/resume',
            new Blob([JSON.stringify(payload)], { type: 'application/json' })
          );
        } catch {
          // Invalid JSON
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [userId, sessionId]);

  // Auto-migrate anonymous session data when user logs in
  usePathwaysSession();

  return (
    <div className="flex flex-col h-screen">
      <PathwaysHeader onOpenActivity={() => setIsActivityOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <section className="flex flex-col flex-1 overflow-hidden">
          <nav className="flex border-b bg-gray-50 text-sm font-medium">
            {['graph', 'feedback', 'preview', 'resume'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 -mb-px border-b-2 transition-colors duration-150 focus:outline-none ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent hover:text-indigo-600'
                }`}
              >
                {tab === 'graph'
                  ? 'Graph'
                  : tab === 'feedback'
                  ? 'Feedback'
                  : tab === 'preview'
                  ? 'Preview'
                  : 'Resume'}
              </button>
            ))}
          </nav>

          <div className="flex-1 overflow-auto">
            {activeTab === 'graph' ? (
              <PathwaysGraph />
            ) : activeTab === 'feedback' ? (
              <FeedbackHistory />
            ) : activeTab === 'preview' ? (
              <ResumePreview resumeData={resume} />
            ) : (
              <div className="h-full relative">
                {isResumeSaving && (
                  <div className="absolute top-2 right-4 z-10 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
                    Saving...
                  </div>
                )}
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
            )}
          </div>
        </section>

        <CopilotChat
          resumeData={resume}
          setResumeData={updateResume}
          setResumeJson={setResumeJson}
        />
      </div>

      <ActivityLog
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
      />
    </div>
  );
}

export default PathwaysContent;
