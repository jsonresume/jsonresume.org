'use client';

import Editor, { useMonaco } from '@monaco-editor/react';
import { useRef, useEffect, useState } from 'react';
import { render } from '../../../../packages/jsonresume-theme-professional';
import { Button } from '@repo/ui';
import Link from 'next/link';
import schema from './schema';
import { ExternalLink, Save, Code, Layout } from 'lucide-react';
import { useResume } from '../providers/ResumeProvider';
import GuiEditor from './GuiEditor';

const HtmlIframe = ({ htmlString }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframeDocument = iframeRef.current.contentDocument;
    iframeDocument.open();
    iframeDocument.write(htmlString);
    iframeDocument.close();
  }, [htmlString]);

  return <iframe ref={iframeRef} className="w-full h-full overflow-auto" />;
};

export default function ResumeEditor({ resume: initialResume, updateGist }) {
  const { username } = useResume();
  const [resume, setResume] = useState(initialResume);
  const [changed, setChanged] = useState(false);
  const [content, setContent] = useState('');
  const [editorMode, setEditorMode] = useState('gui'); // 'json' or 'gui'
  const monaco = useMonaco();

  useEffect(() => {
    setResume(initialResume);
  }, [initialResume]);

  useEffect(() => {
    try {
      const rendered = render(JSON.parse(resume));
      setContent(rendered);
      setChanged(true);
    } catch (e) {
      console.log(e);
    }
  }, [resume]);

  useEffect(() => {
    if (monaco) {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
          {
            uri: 'http://myserver/foo-schema.json',
            fileMatch: ['*'],
            schema,
          },
        ],
      });
    }
  }, [monaco]);

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 p-4 flex justify-between items-center border-b bg-white">
        <div className="flex items-center gap-4">
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
              View Resume
            </Link>
          </Button>
          <Button
            variant="default"
            size="sm"
            disabled={!changed}
            onClick={async () => {
              setChanged(false);
              await updateGist(resume);
            }}
            className="flex items-center gap-1"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2">
          {editorMode === 'json' ? (
            <Editor
              height="100%"
              defaultLanguage="json"
              value={resume}
              onChange={(code) => setResume(code)}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
          ) : (
            <GuiEditor
              resume={JSON.parse(resume)}
              onChange={(newResume) =>
                setResume(JSON.stringify(newResume, null, 2))
              }
            />
          )}
        </div>
        <div className="w-1/2 border-l h-full overflow-auto">
          <HtmlIframe htmlString={content} />
        </div>
      </div>
    </div>
  );
}
