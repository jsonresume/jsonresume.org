'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
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
  const [mobileView, setMobileView] = useState('main'); // 'main' | 'chat'
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
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Reset resume to empty state
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
    } catch (err) {
      console.error('Failed to reset resume:', err);
    } finally {
      setIsResetting(false);
    }
  };
  // Use refs for beforeunload to always have current values
  const userIdRef = useRef(userId);
  const sessionIdRef = useRef(sessionId);

  // Keep refs in sync with state
  useEffect(() => {
    userIdRef.current = userId;
    sessionIdRef.current = sessionId;
  }, [userId, sessionId]);

  // Immediate save function (no debounce)
  const saveNow = useCallback(
    async (json) => {
      if (!json || json === lastSavedJsonRef.current) return;
      try {
        const parsed = JSON.parse(json);
        await setFullResume(parsed, 'manual_edit');
        lastSavedJsonRef.current = json;
        pendingJsonRef.current = null;
        setHasPendingChanges(false);
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
      setHasPendingChanges(json !== lastSavedJsonRef.current);

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveNow(json);
      }, 500); // 500ms debounce (reduced from 1.5s)
    },
    [saveNow]
  );

  // Save pending changes before page unload (uses refs to avoid stale closures)
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
          // Include user identifier (read from refs for current values)
          if (userIdRef.current) {
            payload.userId = userIdRef.current;
          } else if (sessionIdRef.current) {
            payload.sessionId = sessionIdRef.current;
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
  }, []); // Empty deps since we use refs

  // Auto-migrate anonymous session data when user logs in
  usePathwaysSession();

  return (
    <div className="flex flex-col h-screen">
      <PathwaysHeader onOpenActivity={() => setIsActivityOpen(true)} />

      {/* Mobile view toggle */}
      <div className="md:hidden flex border-b bg-gray-50 text-sm font-medium">
        <button
          onClick={() => setMobileView('main')}
          className={`flex-1 px-4 py-2 -mb-px border-b-2 transition-colors ${
            mobileView === 'main'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent hover:text-indigo-600'
          }`}
        >
          Workspace
        </button>
        <button
          onClick={() => setMobileView('chat')}
          className={`flex-1 px-4 py-2 -mb-px border-b-2 transition-colors ${
            mobileView === 'chat'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent hover:text-indigo-600'
          }`}
        >
          Chat
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <section
          className={`flex flex-col flex-1 overflow-hidden ${
            mobileView === 'chat' ? 'hidden md:flex' : 'flex'
          }`}
        >
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
            )}
          </div>
        </section>

        <div
          className={`${
            mobileView === 'main' ? 'hidden md:flex' : 'flex'
          } flex-col`}
        >
          <CopilotChat
            resumeData={resume}
            setResumeData={updateResume}
            setResumeJson={setResumeJson}
          />
        </div>
      </div>

      <ActivityLog
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
      />
    </div>
  );
}

export default PathwaysContent;
