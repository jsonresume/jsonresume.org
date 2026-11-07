import { RECOMMENDED_THEMES, THEME_METADATA } from '@jsonresume/theme-metadata';
import { ApiClient } from '@repo/api-client';
import { Predicate } from 'effect';
import { Atom } from 'effect/reactivity';
import type { Json } from './values';

const option = (slug: string) => ({
  value: slug,
  label: THEME_METADATA[slug]?.name ?? slug,
});

/**
 * The picker's groups: the recommended themes (ATS-safe, print-tested) in
 * their order, then every other theme by name.
 */
export const themeOptions = [
  { label: 'Recommended', options: RECOMMENDED_THEMES.map(option) },
  {
    label: 'All themes',
    options: Object.keys(THEME_METADATA)
      .filter((slug) => !RECOMMENDED_THEMES.includes(slug))
      .map(option)
      .sort((a, b) => a.label.localeCompare(b.label)),
  },
];

export const DEFAULT_THEME = 'elegant';

/** The resume being edited; null until it has loaded. */
export const draftAtom = Atom.make<Json>(null);

/** The resume as last saved, serialised, to tell whether there are changes. */
export const savedAtom = Atom.make<string | null>(null);

export const serialize = (resume: Json) => JSON.stringify(resume, null, 2);

export const dirtyAtom = Atom.make((get) => {
  const saved = get(savedAtom);
  return saved !== null && serialize(get(draftAtom)) !== saved;
});

/**
 * The JSON view's text, which may not parse while someone types. Edits that
 * parse become the draft; the form view rewrites it from the draft.
 */
export const jsonTextAtom = Atom.make('');

/** The form's open sections: Basics first; the ATS check's "Go to it" opens more. */
export const openSectionsAtom = Atom.make<ReadonlyArray<string>>(['basics']);

/** A field to bring into view and focus, as an ATS issue names it (work[].highlights). */
export const goToFieldAtom = Atom.make<string | null>(null);

/** ?mode=json shows the code view; the form is the default. */
export const modeParamAtom = Atom.make<string | null>(null);

/** ?panel=check shows the ATS check beside the editor; the preview is the default. */
export const panelParamAtom = Atom.make<string | null>(null);

/** The theme the page uses: meta.theme, or the default. */
export const themeOf = (resume: Json): string => {
  const meta = Predicate.isObject(resume) ? resume['meta'] : undefined;
  const theme = Predicate.isObject(meta) ? meta['theme'] : undefined;
  return Predicate.isString(theme) && theme !== ''
    ? theme.toLowerCase()
    : DEFAULT_THEME;
};

export const editorResumeAtom = ApiClient.query('editor', 'resume', {});

/**
 * A preview per resume and theme, keyed by both serialised, so repeating
 * a state (an undo) is instant and old results are dropped when unused.
 */
export const previewAtom = Atom.family((key: string) => {
  const parsed: unknown = JSON.parse(key);
  const resume = Predicate.isObject(parsed) ? parsed['resume'] : null;
  const theme =
    Predicate.isObject(parsed) && Predicate.isString(parsed['theme'])
      ? parsed['theme']
      : DEFAULT_THEME;
  return ApiClient.query('editor', 'preview', { payload: { resume, theme } });
});

/** The key previewAtom takes. */
export const previewKey = (resume: Json, theme: string) =>
  JSON.stringify({ resume, theme });
