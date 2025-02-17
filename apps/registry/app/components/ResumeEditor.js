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
  const [pendingChanges, setPendingChanges] = useState(null);
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

  const applyChanges = useCallback(() => {
    console.log('Applying pending changes:', pendingChanges);
    if (!pendingChanges) {
      console.warn('No pending changes to apply');
      return false;
    }

    try {
      const mergeChanges = (current, changes) => {
        console.log('Merging changes into current state:', { current, changes });
        const merged = { ...current };

        // Helper to merge arrays
        const mergeArrays = (currentArr = [], changesArr = []) => {
          console.log('Merging arrays:', { currentArr, changesArr });
          if (!Array.isArray(changesArr)) {
            console.warn('Changes array is not an array:', changesArr);
            return currentArr;
          }
          return changesArr; // Replace the entire array
        };

        // Recursively merge objects
        Object.entries(changes).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            merged[key] = mergeArrays(current[key], value);
          } else if (value && typeof value === 'object') {
            merged[key] = mergeChanges(current[key] || {}, value);
          } else {
            merged[key] = value;
          }
          console.log(`Updated ${key}:`, merged[key]);
        });

        return merged;
      };

      const updatedResume = mergeChanges(resume, pendingChanges);
      console.log('Final merged resume:', updatedResume);
      setResume(updatedResume);
      setPendingChanges(null);
      return true;
    } catch (error) {
      console.error('Error applying changes:', error);
      throw error;
    }
  }, [resume, pendingChanges]);

  const handleGuiChange = useCallback((changes) => {
    console.log('GUI editor changes:', changes);
    setResume(prev => ({ ...prev, ...changes }));
  }, []);

  const handleJsonChange = useCallback((newResume) => {
    console.log('Received JSON changes:', newResume);
    try {
      setResume(typeof newResume === 'string' ? JSON.parse(newResume) : newResume);
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 p-4 flex justify-between items-center border-b bg-white">
        <div className="flex-1">
          <div className="flex rounded-lg border p-1">
            <Button
              variant={editorMode === 'json' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setEditorMode('json')}
              className="flex items-center gap-1"
            >
              <Code className="w-4 h-4" />
              JSON
            </Button>
            <Button
              variant={editorMode === 'gui' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setEditorMode('gui')}
              className="flex items-center gap-1"
            >
              <Layout className="w-4 h-4" />
              Form
            </Button>
            <Button
              variant={editorMode === 'ai' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setEditorMode('ai')}
              className="flex items-center gap-1"
            >
              AI Chat
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            The live preview uses the professional theme. You can choose
            different themes on your public resume page.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/${username}`}
              target="_blank"
              className="flex items-center gap-1"
            >
              <ExternalLink className="w-4 h-4" />
              View Public
            </Link>
          </Button>
          <Button
            size="sm"
            className="flex items-center gap-1"
            onClick={() => updateGist(JSON.stringify(resume, null, 2))}
          >
            <Save className="w-4 h-4" />
            Save
          </Button>
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
            <GuiEditor
              resume={resume}
              onChange={handleGuiChange}
            />
          )}
          {editorMode === 'ai' && (
            <AIChatEditor
              resume={resume}
              onResumeChange={handleResumeChange}
              onApplyChanges={applyChanges}
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
