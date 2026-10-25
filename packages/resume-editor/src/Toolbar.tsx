import { useAtom } from '@effect/atom-react';
import { Badge, SegmentedControl, Select } from '@jsonresume/ui';
import { DEFAULT_THEME, draftAtom, themeOf, themeOptions } from './state';
import { setAt } from './values';

export type Mode = 'form' | 'json';
/** On phones, one thing at a time: the editor, the page, or its ATS check. */
export type View = 'edit' | 'preview' | 'check';

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
  view: View;
  onMode: (mode: Mode) => void;
  onView: (view: View) => void;
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
          { value: 'check', label: 'Check' },
        ]}
        value={view === 'edit' ? mode : view}
        onValueChange={(v) => {
          if (v === 'preview' || v === 'check') return onView(v);
          onView('edit');
          onMode(v === 'json' ? 'json' : 'form');
        }}
      />
      <ThemeSelect />
      <Problems count={problems} />
    </>
  );
}
