'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import Editor from '@monaco-editor/react';
import CopilotChat from './components/CopilotChat';
import ResumePreview from './components/ResumePreview';
import PathwaysGraph from './components/PathwaysGraph';
import { usePathways } from './context/PathwaysContext';
import usePathwaysSession from './hooks/usePathwaysSession';

/**
 * Main Pathways content component (uses context)
 */
function PathwaysContent() {
  const [activeTab, setActiveTab] = useState('graph');
  const { resume, resumeJson, updateResume, updateResumeJson, setResumeJson } =
    usePathways();

  // Auto-migrate anonymous session data when user logs in
  usePathwaysSession();

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-6 h-14 border-b bg-white/80 backdrop-blur-md">
        <h1 className="text-xl font-semibold">Pathways</h1>
        <button
          type="button"
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <section className="flex flex-col flex-1 overflow-hidden">
          <nav className="flex border-b bg-gray-50 text-sm font-medium">
            {['graph', 'preview', 'resume'].map((tab) => (
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
                  : tab === 'preview'
                  ? 'Preview'
                  : 'Resume'}
              </button>
            ))}
          </nav>

          <div className="flex-1 overflow-auto">
            {activeTab === 'graph' ? (
              <PathwaysGraph />
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
    </div>
  );
}

export default PathwaysContent;
