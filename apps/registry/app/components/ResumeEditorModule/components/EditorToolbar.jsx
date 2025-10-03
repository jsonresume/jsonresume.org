import Link from 'next/link';
import { Button } from '@repo/ui';
import { ExternalLink, Save, Code, Layout } from 'lucide-react';

export const EditorToolbar = ({
  editorMode,
  setEditorMode,
  username,
  onSave,
  isSaving,
  hasChanges,
}) => {
  return (
    <div className="shrink-0 border-b bg-white shadow-sm">
      <div className="max-w-screen-2xl mx-auto">
        <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <nav
            className="flex-1"
            role="navigation"
            aria-label="Editor mode selection"
          >
            <div className="inline-flex rounded-lg border bg-gray-50/50 p-1 shadow-sm">
              <Button
                variant={editorMode === 'json' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setEditorMode('json')}
                className="flex items-center gap-2 min-w-[90px] justify-center transition-colors"
                aria-pressed={editorMode === 'json'}
              >
                <Code className="w-4 h-4" aria-hidden="true" />
                <span>JSON</span>
              </Button>
              <Button
                variant={editorMode === 'gui' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setEditorMode('gui')}
                className="flex items-center gap-2 min-w-[90px] justify-center transition-colors"
                aria-pressed={editorMode === 'gui'}
              >
                <Layout className="w-4 h-4" aria-hidden="true" />
                <span>Form</span>
              </Button>
              <Button
                variant={editorMode === 'ai' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setEditorMode('ai')}
                className="flex items-center gap-2 min-w-[90px] justify-center transition-colors relative"
                aria-pressed={editorMode === 'ai'}
              >
                <span className="relative flex items-center" aria-hidden="true">
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  ✨
                </span>
                <span>AI Chat</span>
              </Button>
            </div>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="transition-colors hover:bg-gray-50"
            >
              <Link
                href={`/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                <span>View Public</span>
              </Link>
            </Button>
            <Button
              size="sm"
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={onSave}
              disabled={isSaving || !hasChanges}
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
