'use client';

import { useState } from 'react';
import CopilotChat from './components/CopilotChat';
import ResumePreview from './components/ResumePreview';
import PathwaysGraph from './components/PathwaysGraph';
import PathwaysHeader from './components/PathwaysHeader';
import FeedbackHistory from './components/FeedbackHistory';
import ResumeEditorTab from './components/ResumeEditorTab';
import { ActivityLog } from './components/ActivityLog';
import { usePathways } from './context/PathwaysContext';
import usePathwaysSession from './hooks/usePathwaysSession';
import useResumeSave from './hooks/useResumeSave';

const TABS = [
  { key: 'graph', label: 'Graph' },
  { key: 'feedback', label: 'Feedback' },
  { key: 'preview', label: 'Preview' },
  { key: 'resume', label: 'Resume' },
];

function PathwaysContent() {
  const [activeTab, setActiveTab] = useState('graph');
  const [mobileView, setMobileView] = useState('main');
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

  const { hasPendingChanges, debouncedSave } = useResumeSave({
    setFullResume,
    userId,
    sessionId,
  });

  usePathwaysSession();

  const renderTab = () => {
    switch (activeTab) {
      case 'graph':
        return <PathwaysGraph />;
      case 'feedback':
        return <FeedbackHistory />;
      case 'preview':
        return <ResumePreview resumeData={resume} />;
      case 'resume':
        return (
          <ResumeEditorTab
            resumeJson={resumeJson}
            updateResumeJson={updateResumeJson}
            debouncedSave={debouncedSave}
            isResumeSaving={isResumeSaving}
            hasPendingChanges={hasPendingChanges}
            userId={userId}
            sessionId={sessionId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <PathwaysHeader onOpenActivity={() => setIsActivityOpen(true)} />

      {/* Mobile view toggle */}
      <div className="md:hidden flex border-b bg-gray-50 text-sm font-medium">
        {['main', 'chat'].map((view) => (
          <button
            key={view}
            onClick={() => setMobileView(view)}
            className={`flex-1 px-4 py-2 -mb-px border-b-2 transition-colors ${
              mobileView === view
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent hover:text-indigo-600'
            }`}
          >
            {view === 'main' ? 'Workspace' : 'Chat'}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <section
          className={`flex flex-col flex-1 overflow-hidden ${
            mobileView === 'chat' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <nav className="flex border-b bg-gray-50 text-sm font-medium">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 -mb-px border-b-2 transition-colors duration-150 focus:outline-none ${
                  activeTab === tab.key
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent hover:text-indigo-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex-1 overflow-auto">{renderTab()}</div>
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
