'use client';

import Editor, { useMonaco } from '@monaco-editor/react';
import { useRef, useEffect, useState } from 'react';
import { render } from '../../../../packages/jsonresume-theme-professional';
import { Button } from '@repo/ui/components/ui/button';
import Link from 'next/link';
import schema from './schema';
import { ExternalLink, Save } from 'lucide-react';

const HtmlIframe = ({ htmlString }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframeDocument = iframeRef.current.contentDocument;
    iframeDocument.open();
    iframeDocument.write(htmlString);
    iframeDocument.close();
  }, [htmlString]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full"
    />
  );
};

export default function ResumeEditor({
  login,
  resume: initialResume,
  updateGist,
}) {
  const [resume, setResume] = useState(initialResume);
  const [changed, setChanged] = useState(false);
  const [content, setContent] = useState('');
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
        <div className="text-sm text-gray-600">
          The live preview uses the professional theme. You can choose different themes on your public resume page.
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${login}`} target="_blank" className="flex items-center gap-1">
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
          <Editor
            height="100%"
            defaultLanguage="json"
            value={resume}
            onChange={(code) => setResume(code)}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on'
            }}
          />
        </div>
        <div className="w-1/2 border-l">
          <HtmlIframe htmlString={content} />
        </div>
      </div>
    </div>
  );
}
