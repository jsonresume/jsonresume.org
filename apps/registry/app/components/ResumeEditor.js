'use client';

import Editor, { useMonaco } from '@monaco-editor/react';
import { useRef, useEffect, useState, useCallback } from 'react';
import { render } from '../../../../packages/jsonresume-theme-professional';
import { Button } from '@repo/ui';
import Link from 'next/link';
import schema from './schema';
import { ExternalLink, Save, Code, Layout } from 'lucide-react';
import GuiEditor from './GuiEditor';
import AIChatEditor from './AIChatEditor';
import { useResume } from '../providers/ResumeProvider';

const defaultResume = {
  basics: {
    name: '',
    label: '',
    image: '',
    email: '',
    phone: '',
    url: '',
    summary: '',
    location: {
      address: '',
      postalCode: '',
      city: '',
      countryCode: '',
      region: '',
    },
    profiles: [],
  },
  work: [],
  volunteer: [],
  education: [],
  awards: [],
  certificates: [],
  publications: [],
  skills: [],
  languages: [],
  interests: [],
  references: [],
  projects: [],
};

const HtmlIframe = ({ htmlString }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = htmlString;
    }
  }, [htmlString]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full"
      title="Resume Preview"
    ></iframe>
  );
};

const ResumeEditor = ({ resume: initialResume, updateGist }) => {
  const { username } = useResume();
  const [resume, setResume] = useState(() => {
    if (!initialResume) return defaultResume;
    try {
      return typeof initialResume === 'string'
        ? JSON.parse(initialResume)
        : initialResume;
    } catch (error) {
      console.error('Error parsing initial resume:', error);
      return defaultResume;
    }
  });
  const [content, setContent] = useState('');
  const [editorMode, setEditorMode] = useState('gui');
  const [, setPendingChanges] = useState(null);
  const monaco = useMonaco();

  useEffect(() => {
    console.log('Current resume state:', resume);
  }, [resume]);

  useEffect(() => {
    try {
      const html = render(resume);
      setContent(html);
    } catch (error) {
      console.error('Error rendering resume:', error);
    }
  }, [resume]);

  useEffect(() => {
    if (monaco) {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
          {
            uri: 'http://json-schema.org/draft-07/schema#',
            fileMatch: ['*'],
            schema: schema,
          },
        ],
      });
    }
  }, [monaco]);

  const handleResumeChange = useCallback((changes) => {
    console.log('Received changes in ResumeEditor:', changes);
    if (!changes) {
      console.warn('No changes received');
      return;
    }
    setPendingChanges(changes);
  }, []);

  const handleApplyChanges = useCallback(
    (changes) => {
      const newResume = { ...resume };

      // Helper function to intelligently merge arrays
      const mergeArrays = (existingArray = [], newArray = [], key = 'name') => {
        const result = [...existingArray];

        newArray.forEach((newItem) => {
          // For deletion (marked with _delete flag)
          if (newItem._delete) {
            const index = result.findIndex(
              (item) =>
                item[key] === newItem[key] ||
                (item.startDate === newItem.startDate &&
                  item.endDate === newItem.endDate),
            );
            if (index !== -1) {
              result.splice(index, 1);
            }
            return;
          }

          // For updates or additions
          const existingIndex = result.findIndex(
            (item) =>
              item[key] === newItem[key] ||
              (item.startDate === newItem.startDate &&
                item.endDate === newItem.endDate),
          );

          if (existingIndex !== -1) {
            // Update existing item
            result[existingIndex] = { ...result[existingIndex], ...newItem };
          } else {
            // Add new item
            result.push(newItem);
          }
        });

        return result;
      };

      // Process each section of changes
      Object.entries(changes).forEach(([section, value]) => {
        if (Array.isArray(value)) {
          // Handle array sections (work, education, etc.)
          newResume[section] = mergeArrays(
            resume[section],
            value,
            section === 'skills' ? 'name' : 'name', // Use appropriate key for matching
          );
        } else if (typeof value === 'object' && value !== null) {
          // Handle nested objects
          newResume[section] = { ...resume[section], ...value };
        } else {
          // Handle primitive values
          newResume[section] = value;
        }
      });

      setResume(newResume);
    },
    [resume],
  );

  const handleGuiChange = useCallback((changes) => {
    console.log('GUI editor changes:', changes);
    setResume((prev) => ({ ...prev, ...changes }));
  }, []);

  const handleJsonChange = useCallback((newResume) => {
    console.log('Received JSON changes:', newResume);
    try {
      setResume(
        typeof newResume === 'string' ? JSON.parse(newResume) : newResume,
      );
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 border-b bg-white shadow-sm">
        <div className="max-w-screen-2xl mx-auto">
          <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <nav
              className="flex-1"
              role="navigation"
              aria-label="Editor mode selection"
            >
              <div className="inline-flex rounded-lg border bg-gray-50/50 p-1 shadow-sm">
                <Button
                  variant={editorMode === 'json' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setEditorMode('json')}
                  className="flex items-center gap-2 min-w-[90px] justify-center transition-colors"
                  aria-pressed={editorMode === 'json'}
                >
                  <Code className="w-4 h-4" aria-hidden="true" />
                  <span>JSON</span>
                </Button>
                <Button
                  variant={editorMode === 'gui' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setEditorMode('gui')}
                  className="flex items-center gap-2 min-w-[90px] justify-center transition-colors"
                  aria-pressed={editorMode === 'gui'}
                >
                  <Layout className="w-4 h-4" aria-hidden="true" />
                  <span>Form</span>
                </Button>
                <Button
                  variant={editorMode === 'ai' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setEditorMode('ai')}
                  className="flex items-center gap-2 min-w-[90px] justify-center transition-colors relative"
                  aria-pressed={editorMode === 'ai'}
                >
                  <span
                    className="relative flex items-center"
                    aria-hidden="true"
                  >
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    ✨
                  </span>
                  <span>AI Chat</span>
                </Button>
              </div>
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="transition-colors hover:bg-gray-50"
              >
                <Link
                  href={`/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  <span>View Public</span>
                </Link>
              </Button>
              <Button
                size="sm"
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => updateGist(JSON.stringify(resume, null, 2))}
              >
                <Save className="w-4 h-4" aria-hidden="true" />
                <span>Save</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2">
          {editorMode === 'json' && (
            <Editor
              height="100%"
              defaultLanguage="json"
              value={JSON.stringify(resume, null, 2)}
              onChange={(code) => handleJsonChange(code)}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
          )}
          {editorMode === 'gui' && (
            <GuiEditor resume={resume} onChange={handleGuiChange} />
          )}
          {editorMode === 'ai' && (
            <AIChatEditor
              resume={resume}
              onResumeChange={handleResumeChange}
              onApplyChanges={handleApplyChanges}
            />
          )}
        </div>
        <div className="w-1/2 border-l h-full overflow-auto">
          <HtmlIframe htmlString={content} />
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
