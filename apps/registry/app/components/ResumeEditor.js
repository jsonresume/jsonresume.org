'use client';

import { useMonaco } from '@monaco-editor/react';
import { useState } from 'react';
import { useResume } from '../providers/ResumeProvider';
import { useResumeState } from './ResumeEditorModule/hooks/useResumeState';
import { useMonacoSetup } from './ResumeEditorModule/hooks/useMonacoSetup';
import { useResumeHandlers } from './ResumeEditorModule/hooks/useResumeHandlers';
import { EditorToolbar } from './ResumeEditorModule/components/EditorToolbar';
import { EditorPanel } from './ResumeEditorModule/components/EditorPanel';
import { HtmlIframe } from './ResumeEditorModule/components/HtmlIframe';

const ResumeEditor = ({ resume: initialResume, updateGist }) => {
  const { username } = useResume();
  const [editorMode, setEditorMode] = useState('gui');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('professional');
  const monaco = useMonaco();

  const { resume, setResume, setOriginalResume, hasChanges, setHasChanges } =
    useResumeState(initialResume);

  useMonacoSetup(monaco);

  const {
    content,
    handleResumeChange,
    handleApplyChanges,
    handleGuiChange,
    handleJsonChange,
  } = useResumeHandlers(resume, setResume, selectedTheme);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const resumeStr = JSON.stringify(resume, null, 2);
      await updateGist(resumeStr);
      setOriginalResume(resumeStr);
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving resume:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <EditorToolbar
        editorMode={editorMode}
        setEditorMode={setEditorMode}
        username={username}
        onSave={handleSave}
        isSaving={isSaving}
        hasChanges={hasChanges}
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
      />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2">
          <EditorPanel
            editorMode={editorMode}
            resume={resume}
            handleJsonChange={handleJsonChange}
            handleGuiChange={handleGuiChange}
            handleResumeChange={handleResumeChange}
            handleApplyChanges={handleApplyChanges}
          />
        </div>
        <div className="w-1/2 border-l h-full overflow-auto">
          <HtmlIframe htmlString={content} />
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
