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
import { setAt } from './values';

export type Mode = 'form' | 'json';

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
  const [draft, setDraft] = useAtom(draftAtom);
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
      {problems > 0 ? (
        <Badge tone="warning">
          {problems === 1 ? '1 thing to fix' : `${problems} things to fix`}
        </Badge>
      ) : null}
    </>
  );
}

/** Save state, the page, a download, and Save. */
export function EditorActions({
  path,
  saving,
  saveLabel,
  blocked,
  onSave,
}: {
  path: string;
  saving: boolean;
  saveLabel: string;
  /** Saving can't work yet (the gist permission is missing). */
  blocked: boolean;
  onSave: () => void;
}) {
  const dirty = useAtomValue(dirtyAtom);
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
      <Text as="span" size="xs" tone="muted" aria-live="polite">
        {saving ? 'Saving…' : dirty ? 'Unsaved changes' : 'All changes saved'}
      </Text>
      <Button size="sm" variant="ghost" onClick={download}>
        Download
      </Button>
      <Button asChild size="sm" variant="secondary">
        <a href={path} target="_blank" rel="noreferrer">
          View page
        </a>
      </Button>
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
