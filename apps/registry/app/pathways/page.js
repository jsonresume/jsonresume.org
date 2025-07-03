'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import ResumeEditor from '../components/ResumeEditor';
import { ResumeProvider } from '../providers/ResumeProvider';

export default function PathwaysPage() {
  const [activeTab, setActiveTab] = useState('graph');

  // Sample resume data for initial load
  const sampleResume = {
    basics: {
      name: 'Jane Doe',
      label: 'Full-Stack Developer',
      email: 'jane.doe@example.com',
      location: { city: 'San Francisco', region: 'CA', countryCode: 'US' },
      summary: 'Experienced developer with a passion for building scalable web applications.'
    },
    work: [
      {
        name: 'Acme Corp',
        position: 'Software Engineer',
        startDate: '2022-01-01',
        summary: 'Worked on front-end features using React and Tailwind CSS.'
      }
    ],
    education: [],
    skills: [
      { name: 'JavaScript', level: 'Advanced' },
      { name: 'React', level: 'Advanced' },
      { name: 'Node.js', level: 'Intermediate' }
    ],
  };

  const [resumeData, setResumeData] = useState(sampleResume);

  return (
    <div className="flex flex-col h-screen">
      {/* Top Bar */}
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

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column */}
        <section className="flex flex-col flex-1 overflow-hidden">
          {/* Tabs */}
          <nav className="flex border-b bg-gray-50 text-sm font-medium">
            {['graph', 'resume'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 -mb-px border-b-2 transition-colors duration-150 focus:outline-none ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent hover:text-indigo-600'
                }`}
              >
                {tab === 'graph' ? 'Graph' : 'Resume'}
              </button>
            ))}
          </nav>

          {/* Tab Panels */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'graph' ? (
              <MockGraph />
            ) : (
              <ResumeProvider>
                <ResumeEditor
                  resume={resumeData}
                  updateGist={async (updated) => {
                    // keep local state in sync
                    try {
                      setResumeData(JSON.parse(updated));
                    } catch {
                      /* ignore */
                    }
                  }}
                />
              </ResumeProvider>
            )}
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="w-[360px] border-l bg-white flex flex-col">
          <div className="px-4 py-3 border-b">
            <h2 className="text-base font-medium">Copilot Chat</h2>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-2 text-sm text-gray-500">
            {/* Placeholder chat content */}
            <p>Chat widget coming soon…</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

// --- Placeholder Components ---
function MockGraph() {
  return (
    <div className="flex items-center justify-center h-full w-full text-gray-400 select-none">
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        className="opacity-50"
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="4" fill="none" />
        <circle cx="100" cy="40" r="8" fill="currentColor" />
        <circle cx="160" cy="100" r="8" fill="currentColor" />
        <circle cx="100" cy="160" r="8" fill="currentColor" />
        <circle cx="40" cy="100" r="8" fill="currentColor" />
      </svg>
      <span className="ml-4">Mock Graph</span>
    </div>
  );
}

function ResumePlaceholder() {
  return (
    <div className="flex items-center justify-center h-full w-full text-gray-400 select-none">
      <span>Resume editor coming soon…</span>
    </div>
  );
}
