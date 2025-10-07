import { ModeSelector } from './EditorToolbar/ModeSelector';
import { ThemeSelector } from './EditorToolbar/ThemeSelector';
import { ActionButtons } from './EditorToolbar/ActionButtons';

export const EditorToolbar = ({
  editorMode,
  setEditorMode,
  username,
  onSave,
  isSaving,
  hasChanges,
  selectedTheme,
  setSelectedTheme,
}) => {
  return (
    <div className="shrink-0 border-b bg-white shadow-sm">
      <div className="max-w-screen-2xl mx-auto">
        <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <ModeSelector editorMode={editorMode} setEditorMode={setEditorMode} />
          <ThemeSelector
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
          />
          <ActionButtons
            username={username}
            onSave={onSave}
            isSaving={isSaving}
            hasChanges={hasChanges}
          />
        </div>
      </div>
    </div>
  );
};
