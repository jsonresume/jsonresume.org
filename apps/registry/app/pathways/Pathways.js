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
  } = usePathways();

  // Debounced save for JSON editor
  const saveTimeoutRef = useRef(null);
  const lastSavedJsonRef = useRef(resumeJson);

  // Save resume to DB with debounce
  const debouncedSave = useCallback(
    (json) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const parsed = JSON.parse(json);
          // Only save if JSON is valid and different from last saved
          if (json !== lastSavedJsonRef.current) {
            console.log('[Pathways] Auto-saving resume...');
            await setFullResume(parsed, 'manual_edit');
            lastSavedJsonRef.current = json;
            console.log('[Pathways] Resume saved');
          }
        } catch {
          // Invalid JSON, don't save
        }
      }, 1500); // 1.5 second debounce
    },
    [setFullResume]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

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
