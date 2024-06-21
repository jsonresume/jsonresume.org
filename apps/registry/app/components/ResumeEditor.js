'use client';
// https://dev.to/amnish04/openai-has-text-to-speech-support-now-4mlp
import Editor from '@monaco-editor/react';
import { useRef, useEffect, useState } from 'react';
import { render } from '../../../../packages/jsonresume-theme-flat';
import Button from '@jsonresume/ui/Button';

const HtmlIframe = ({ htmlString }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframeDocument = iframeRef.current.contentDocument;
    iframeDocument.open();
    iframeDocument.write(htmlString);
    iframeDocument.close();
  }, [htmlString]);

  return <iframe ref={iframeRef} style={{ width: '100%', height: '100%' }} />;
};
export default function ResumeEditor({ resume: initialResume, updateGist }) {
  const [resume, setResume] = useState(initialResume);
  const [changed, setChanged] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    setResume(initialResume);
  }, [initialResume]);

  useEffect(() => {
    const rendered = render(JSON.parse(resume));
    setContent(rendered);
    setChanged(true);
  }, [resume]);

  return (
    <div>
      <div style={{ padding: 10, textAlign: 'center' }}>
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Editor
          height="90vh"
          width="50vw"
          defaultLanguage="json"
          defaultValue={initialResume}
          value={resume}
          onChange={(code) => setResume(code)}
        />

        <div style={{ width: '50vw', height: '90vh' }}>
          <HtmlIframe htmlString={content} />
        </div>
      </div>
    </div>
  );
}
