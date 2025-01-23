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
      style={{ border: 0, outline: 0, width: '100%', height: '100%' }}
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
    <div>
      <div className="p-4 flex justify-between items-center border-b">
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
      <div className="flex h-screen">
        <Editor
          height="90vh"
          width="50vw"
          defaultLanguage="json"
          defaultValue={initialResume}
          options={{ wordWrap: 'on' }}
          value={resume}
          onChange={(code) => setResume(code)}
        />
        <div className="w-1/2 h-screen p-4 border-l">
          <HtmlIframe htmlString={content} />
        </div>
      </div>
    </div>
  );
}
