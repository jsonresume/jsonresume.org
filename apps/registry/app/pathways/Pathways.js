'use client';

import { useState } from 'react';
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
  const { resume, resumeJson, updateResume, updateResumeJson, setResumeJson } =
    usePathways();

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
              <Editor
                height="100%"
                defaultLanguage="json"
                value={resumeJson}
                onChange={(code) => {
                  updateResumeJson(code || '');
                }}
                options={{
                  minimap: { enabled: false },
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                }}
              />
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
