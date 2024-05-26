'use client';
// https://dev.to/amnish04/openai-has-text-to-speech-support-now-4mlp
import Editor from '@monaco-editor/react';
import { useRef, useEffect, useState } from 'react';
import { render } from '../../../../packages/jsonresume-theme-flat';
import RecordButton from './RecordButton';
import { merge, mergeAndConcat } from 'merge-anything';

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

  const onNewText = async (text) => {
    if (text?.length < 5) return;
    console.log('new text:', text);
    const response = await fetch('/api/resumeSuggestion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        resume,
      }),
    }).then((res) => res.json());
    console.log({ response });
    const data = JSON.parse(response);
    const suggestion = JSON.parse(data.jsonresume);
    const newResume = merge(JSON.parse(resume), suggestion);
    console.log({ data, suggestion });
    setResume(JSON.stringify(newResume, undefined, 2));
    // keep a local transcript of text and followup
  };

  return (
    <div>
      <button
        onClick={async () => {
          await updateGist(resume);
        }}
      >
        update gist
      </button>
      <RecordButton onNewText={onNewText} />

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
