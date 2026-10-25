import { useAtomValue } from '@effect/atom-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Text,
} from '@jsonresume/ui';
import * as s from './editor.css';
import { dirtyAtom, draftAtom, serialize } from './state';

export interface SaveProps {
  saving: boolean;
  saveLabel: string;
  /** Saving can't work yet (the gist permission is missing). */
  blocked: boolean;
  onSave: () => void;
}

/** Whether there's anything to save, and Save. */
function SaveControls({ saving, saveLabel, blocked, onSave }: SaveProps) {
  const dirty = useAtomValue(dirtyAtom);
  return (
    <>
      <Text as="span" size="xs" tone="muted" aria-live="polite">
        {saving ? 'Saving…' : dirty ? 'Unsaved changes' : 'All changes saved'}
      </Text>
      <Button
        size="sm"
        variant="primary"
        onClick={onSave}
        disabled={!dirty || saving || blocked}
      >
        {saveLabel}
      </Button>
    </>
  );
}

/** Phones: save state and Save, pinned to the bottom of the screen. */
export function SaveBar(props: SaveProps) {
  return (
    <>
      <div className={s.saveBarSpace} />
      <div className={s.saveBar}>
        <SaveControls {...props} />
      </div>
    </>
  );
}

/** What the saved page can be downloaded as (see @repo/resume-host). */
const pageFormats = [
  { label: 'PDF', ext: 'pdf' },
  { label: 'RenderCV (YAML)', ext: 'rendercv' },
  { label: 'Plain text', ext: 'txt' },
  { label: 'QR code to your page', ext: 'qr' },
];

/** The page and downloads, then (unless the save bar has them) Save. */
export function EditorActions({
  path,
  withSave,
  ...save
}: SaveProps & { path: string; withSave: boolean }) {
  const draft = useAtomValue(draftAtom);
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([serialize(draft)], { type: 'application/json' })
    );
    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: 'resume.json',
    });
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost">
            Download
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>This draft</DropdownMenuLabel>
          <DropdownMenuItem onSelect={download}>resume.json</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Your page, as saved</DropdownMenuLabel>
          {pageFormats.map((f) => (
            <DropdownMenuItem key={f.ext} asChild>
              <a href={`${path}.${f.ext}`} download>
                {f.label}
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button asChild size="sm" variant="secondary">
        <a href={path} target="_blank" rel="noreferrer">
          View page
        </a>
      </Button>
      {withSave ? <SaveControls {...save} /> : null}
    </>
  );
}
