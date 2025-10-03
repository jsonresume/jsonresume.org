import Editor from '@monaco-editor/react';
import GuiEditor from '../../GuiEditor';
import AIChatEditor from '../../AIChatEditor';

export const EditorPanel = ({
  editorMode,
  resume,
  handleJsonChange,
  handleGuiChange,
  handleResumeChange,
  handleApplyChanges,
}) => {
  if (editorMode === 'json') {
    return (
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
    );
  }

  if (editorMode === 'gui') {
    return <GuiEditor resume={resume} onChange={handleGuiChange} />;
  }

  if (editorMode === 'ai') {
    return (
      <AIChatEditor
        resume={resume}
        onResumeChange={handleResumeChange}
        onApplyChanges={handleApplyChanges}
      />
    );
  }

  return null;
};
