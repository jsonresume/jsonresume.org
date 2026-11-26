import { useAtomSet, useAtomValue } from '@effect/atom-react';
import { Badge, SegmentedControl, Select } from '@jsonresume/ui';
import { memo } from 'react';
import {
  DEFAULT_THEME,
  draftAtom,
  draftThemeAtom,
  themeOptions,
} from './state';
import { setAt, type Json } from './values';
import { track } from '@repo/posthog/browser';

export type Mode = 'form' | 'json';
/** On phones, one thing at a time: the editor, the page, or its ATS check. */
export type View = 'edit' | 'preview' | 'check';

// Built once: 228 options re-created on every keystroke were half the
// editor's typing time (profiled, 4x CPU).
const options = themeOptions.map((group) => (
  <optgroup key={group.label} label={group.label}>
    {group.options.map((t) => (
      <option key={t.value} value={t.value}>
        {t.label}
      </option>
    ))}
  </optgroup>
));

/**
 * Which theme the page uses (meta.theme), the recommended ones first. It
 * reads the theme alone, so typing elsewhere in the resume leaves it be.
 */
export const ThemeSelect = memo(function ThemeSelect() {
  const theme = useAtomValue(draftThemeAtom);
  const setDraft = useAtomSet(draftAtom);
  return (
    <Select
      inline
      aria-label="Theme"
      value={theme}
      onChange={(e) => {
        const next = e.target.value === DEFAULT_THEME ? '' : e.target.value;
        setDraft((draft: Json) => setAt(draft, ['meta', 'theme'], next));
      }}
    >
      {options}
    </Select>
  );
});

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
        onValueChange={(v) => {
          const next = v === 'json' ? 'json' : 'form';
          // How many edit as JSON (it loads its own editor: #815).
          track('editor_mode_changed', { mode: next });
          onMode(next);
        }}
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
