'use client';

import Editor from '@monaco-editor/react';
import { useRef, useEffect, useState } from 'react';
import { render } from '../../../../packages/jsonresume-theme-cv';
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
  const [content, setContent] = useState('');
  useEffect(() => {
    setResume(initialResume);
  }, [initialResume]);

  const updateContent = async () => {
    const rendered = render(JSON.parse(resume));
    setContent(rendered);
  };

  useEffect(() => {
    updateContent();
  }, [resume]);

  return (
    <div>
      <button
        onClick={async () => {
          await updateGist(resume);
        }}
      >
        update gist
      </button>
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
          onChange={(code) => setResume(code)}
        />

        <div style={{ width: '50vw', height: '90vh' }}>
          <HtmlIframe htmlString={content} />
        </div>
      </div>
    </div>
  );
}
