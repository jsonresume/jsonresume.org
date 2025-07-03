'use client';

import { useState } from 'react';
import { Settings, Send } from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import Editor from '@monaco-editor/react';

export default function PathwaysPage() {
  const [activeTab, setActiveTab] = useState('graph');

  // Sample resume data for initial load
  const sampleResume = {
    basics: {
      name: 'Jane Doe',
      label: 'Full-Stack Developer',
      email: 'jane.doe@example.com',
      location: { city: 'San Francisco', region: 'CA', countryCode: 'US' },
      summary:
        'Experienced developer with a passion for building scalable web applications.',
    },
    work: [
      {
        name: 'Acme Corp',
        position: 'Software Engineer',
        startDate: '2022-01-01',
        summary: 'Worked on front-end features using React and Tailwind CSS.',
      },
    ],
    education: [],
    skills: [
      { name: 'JavaScript', level: 'Advanced' },
      { name: 'React', level: 'Advanced' },
      { name: 'Node.js', level: 'Intermediate' },
    ],
  };

  const [resumeData, setResumeData] = useState(sampleResume);
  const [resumeJson, setResumeJson] = useState(() =>
    JSON.stringify(sampleResume, null, 2)
  );
  // Chat via useChat
  const {
    messages,
    input: chatInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    addToolResult,
  } = useChat({
    api: '/api/pathways',
    initialMessages: [
      {
        role: 'assistant',
        content:
          "Hi! I'm your Copilot. Ask me anything about your career pathway.",
      },
    ],
    body: { currentResume: resumeData },
  });

  console.log({ messages });

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
              <Editor
                height="100%"
                defaultLanguage="json"
                value={resumeJson}
                onChange={(code) => {
                  setResumeJson(code || '');
                  try {
                    const parsed = JSON.parse(code);
                    setResumeData(parsed);
                  } catch {
                    // Ignore parse errors until valid JSON
                  }
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

        {/* Right Sidebar */}
        <aside className="w-[360px] border-l bg-white flex flex-col">
          <div className="px-4 py-3 border-b">
            <h2 className="text-base font-medium">Copilot Chat</h2>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-2 text-sm text-gray-500">
            <div className="space-y-3">
              {messages?.map((message) => (
                <div key={message.id} className="space-y-1">
                  <strong className="capitalize text-xs">{`${message.role}: `}</strong>
                  {message.parts.map((part, idx) => {
                    switch (part.type) {
                      case 'text':
                        return <span key={idx}>{part.text}</span>;
                      case 'tool-invocation': {
                        const callId = part.toolInvocation.toolCallId;
                        if (part.toolInvocation.toolName === 'updateResume') {
                          switch (part.toolInvocation.state) {
                            case 'call':
                              return (
                                <div
                                  key={callId}
                                  className="p-2 rounded-lg bg-green-50 text-green-900 text-xs"
                                >
                                  <pre className="whitespace-pre-wrap break-words">
                                    {JSON.stringify(
                                      part.toolInvocation.args,
                                      null,
                                      2
                                    )}
                                  </pre>
                                </div>
                              );
                            case 'result':
                              return (
                                <div
                                  key={callId}
                                  className="p-2 rounded-lg bg-green-50 text-green-900 text-xs"
                                >
                                  {typeof part.toolInvocation.result ===
                                  'string' ? (
                                    <span>{part.toolInvocation.result}</span>
                                  ) : (
                                    <pre className="whitespace-pre-wrap break-words">
                                      {JSON.stringify(
                                        part.toolInvocation.result,
                                        null,
                                        2
                                      )}
                                    </pre>
                                  )}
                                </div>
                              );
                          }
                        }
                        return null;
                      }
                      default:
                        return null;
                    }
                  })}
                </div>
              ))}
              {isLoading && (
                <p className="text-sm text-gray-500">Copilot is thinking…</p>
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="p-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
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
        <circle
          cx="100"
          cy="100"
          r="80"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
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
