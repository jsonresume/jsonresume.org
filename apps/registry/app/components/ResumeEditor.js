'use client';
// https://dev.to/amnish04/openai-has-text-to-speech-support-now-4mlp
import Editor, { useMonaco } from '@monaco-editor/react';
import { useRef, useEffect, useState } from 'react';
// import { render } from '../../../../themes/stackoverflow/dist';
import { render } from '../../../../packages/jsonresume-theme-professional';
import Button from '@jsonresume/ui/Button';
import Link from '@jsonresume/ui/Link';
import schema from './schema';

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
      // Register the JSON schema
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
          {
            uri: 'http://myserver/foo-schema.json', // id of the schema
            fileMatch: ['*'], // associate with all JSON files
            schema,
          },
        ],
      });
    }
  }, [monaco]);

  return (
    <div>
      <div
        style={{
          padding: 10,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            fontSize: 12,
            lineHeight: '26px',
          }}
        >
          The live preview does not support your theme but the registry does.
          (coming soon)
        </div>
        <div>
          <Link
            href={`/${login}`}
            target="_blank"
            style={{
              marginRight: 20,
              fontSize: 12,
            }}
          >
            View Resume
          </Link>
          <Button
            disabled={!changed}
            onClick={async () => {
              setChanged(false);
              await updateGist(resume);
            }}
          >
            Update Gist
          </Button>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Editor
          height="90vh"
          width="25vw"
          defaultLanguage="json"
          defaultValue={initialResume}
          options={{ wordWrap: 'on' }}
          value={resume}
          onChange={(code) => setResume(code)}
        />

        <div style={{ width: '75vw', height: '90vh' }}>
          <HtmlIframe style={{ border: 0 }} htmlString={content} />
        </div>
      </div>
    </div>
  );
}
