'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import Editor from '@monaco-editor/react';
import CopilotChat from './components/CopilotChat';
import ResumePreview from './components/ResumePreview';

export default function Pathways() {
  const [activeTab, setActiveTab] = useState('graph');
  const sampleResume = {
    basics: {
      name: 'Jane Doe',
      label: 'Full-Stack Developer',
      email: 'jane.doe@example.com',
      phone: '+1-555-0123',
      url: 'https://janedoe.dev',
      location: { city: 'San Francisco', region: 'CA', countryCode: 'US' },
      summary:
        'Experienced full-stack developer with 5+ years building scalable web applications. Passionate about clean code, user experience, and mentoring junior developers.',
      profiles: [
        {
          network: 'GitHub',
          username: 'janedoe',
          url: 'https://github.com/janedoe',
        },
        {
          network: 'LinkedIn',
          username: 'janedoe',
          url: 'https://linkedin.com/in/janedoe',
        },
      ],
    },
    work: [
      {
        name: 'Tech Solutions Inc.',
        position: 'Senior Software Engineer',
        startDate: '2022-03-01',
        summary:
          'Lead development of microservices architecture and mentored team of 5 developers.',
        highlights: [
          'Architected and implemented microservices reducing response time by 40%',
          'Led migration from monolithic to containerized architecture',
          'Mentored 5 junior developers and conducted code reviews',
        ],
      },
      {
        name: 'StartupCo',
        position: 'Full-Stack Developer',
        startDate: '2020-01-01',
        endDate: '2022-02-01',
        summary: 'Built features for B2B SaaS platform serving 10,000+ users.',
        highlights: [
          'Developed real-time collaboration features using WebSockets',
          'Improved application performance by 60% through optimization',
          'Implemented CI/CD pipeline reducing deployment time by 70%',
        ],
      },
    ],
    education: [
      {
        institution: 'University of California, Berkeley',
        area: 'Computer Science',
        studyType: 'Bachelor',
        startDate: '2016-09-01',
        endDate: '2020-05-01',
        score: '3.8',
        courses: [
          'Data Structures',
          'Algorithms',
          'Web Development',
          'Database Systems',
        ],
      },
    ],
    skills: [
      {
        name: 'JavaScript',
        level: 'Expert',
        keywords: ['ES6+', 'TypeScript', 'Node.js', 'React', 'Vue.js'],
      },
      {
        name: 'Backend Development',
        level: 'Advanced',
        keywords: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'],
      },
      {
        name: 'Cloud & DevOps',
        level: 'Intermediate',
        keywords: ['AWS', 'CI/CD', 'Kubernetes', 'Terraform'],
      },
    ],
    awards: [
      {
        title: 'Best Innovation Award',
        date: '2023-06-01',
        awarder: 'Tech Solutions Inc.',
        summary: 'For developing an AI-powered code review system',
      },
    ],
  };

  const [resumeData, setResumeData] = useState(sampleResume);

  const [resumeJson, setResumeJson] = useState(() =>
    JSON.stringify(sampleResume, null, 2)
  );

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
              <MockGraph />
            ) : activeTab === 'preview' ? (
              <ResumePreview resumeData={resumeData} />
            ) : (
              <Editor
                height="100%"
                defaultLanguage="json"
                value={resumeJson}
                onChange={(code) => {
                  setResumeJson(code || '');
                  try {
                    setResumeData(JSON.parse(code));
                  } catch {}
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
          resumeData={resumeData}
          setResumeData={setResumeData}
          setResumeJson={setResumeJson}
        />
      </div>
    </div>
  );
}

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
