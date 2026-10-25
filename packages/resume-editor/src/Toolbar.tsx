import { useAtom, useAtomValue } from '@effect/atom-react';
import { Badge, Button, SegmentedControl, Select, Text } from '@jsonresume/ui';
import {
  DEFAULT_THEME,
  dirtyAtom,
  draftAtom,
  serialize,
  themeOf,
  themeOptions,
} from './state';
import * as s from './editor.css';
import { setAt } from './values';

export type Mode = 'form' | 'json';

/** Which theme the page uses (meta.theme). */
export function ThemeSelect() {
  const [draft, setDraft] = useAtom(draftAtom);
  return (
    <Select
      inline
      aria-label="Theme"
      value={themeOf(draft)}
      onChange={(e) =>
        setDraft(
          setAt(
            draft,
            ['meta', 'theme'],
            e.target.value === DEFAULT_THEME ? '' : e.target.value
          )
        )
      }
    >
      {themeOptions.map((t) => (
        <option key={t.value} value={t.value}>
          {t.label}
        </option>
      ))}
    </Select>
  );
}

const Problems = ({ count }: { count: number }) =>
  count > 0 ? (
    <Badge tone="warning">
      {count === 1 ? '1 thing to fix' : `${count} things to fix`}
    </Badge>
  ) : null;

/** How to edit (form or JSON) and which theme the page uses. */
export function EditorToolbar({
  mode,
  onMode,
  problems,
}: {
  mode: Mode;
  onMode: (mode: Mode) => void;
  problems: number;
}) {
  return (
    <>
      <SegmentedControl
        label="Edit as"
        options={[
          { value: 'form', label: 'Form' },
          { value: 'json', label: 'JSON' },
        ]}
        value={mode}
        onValueChange={(v) => onMode(v === 'json' ? 'json' : 'form')}
      />
      <ThemeSelect />
      <Problems count={problems} />
    </>
  );
}

/** Phones: one switch for form, JSON or the preview, and the theme. */
export function CompactToolbar({
  mode,
  view,
  onMode,
  onView,
  problems,
}: {
  mode: Mode;
  view: 'edit' | 'preview';
  onMode: (mode: Mode) => void;
  onView: (view: 'edit' | 'preview') => void;
  problems: number;
}) {
  return (
    <>
      <SegmentedControl
        label="Show"
        options={[
          { value: 'form', label: 'Form' },
          { value: 'json', label: 'JSON' },
          { value: 'preview', label: 'Preview' },
        ]}
        value={view === 'preview' ? 'preview' : mode}
        onValueChange={(v) => {
          if (v === 'preview') return onView('preview');
          onView('edit');
          onMode(v === 'json' ? 'json' : 'form');
        }}
      />
      <ThemeSelect />
      <Problems count={problems} />
    </>
  );
}

interface SaveProps {
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

/** The page and a download, then (unless the save bar has them) Save. */
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
      <Button size="sm" variant="ghost" onClick={download}>
        Download
      </Button>
      <Button asChild size="sm" variant="secondary">
        <a href={path} target="_blank" rel="noreferrer">
          View page
        </a>
      </Button>
      {withSave ? <SaveControls {...save} /> : null}
    </>
  );
}
