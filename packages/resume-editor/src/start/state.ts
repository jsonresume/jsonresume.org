import type { ImportResult } from '@repo/api';
import { ApiClient } from '@repo/api-client';
import { RECOMMENDED_THEMES } from '@jsonresume/theme-metadata';
import { Predicate } from 'effect';
import { Atom } from 'effect/reactivity';
import type { Json } from '../values';

/** Where the visitor is: choosing a way in, checking an import, writing, or looking. */
export type StartStep = 'choose' | 'review' | 'guided' | 'preview';

export const startStepAtom = Atom.make<StartStep>('choose');

/** The resume being made, before there is an account to save it to. */
export const startResumeAtom = Atom.make<Json>({});

/** The last import, for the review screen: how sure it is of each field. */
export const startImportAtom = Atom.make<typeof ImportResult.Type | null>(null);

/** Themes offered before sign-up: the recommended set, ATS-safe and print-tested. */
export const START_THEMES: ReadonlyArray<string> = RECOMMENDED_THEMES;

export const startThemeAtom = Atom.make<string>(START_THEMES[0] ?? 'elegant');

/** A preview per resume and theme, signed out (rate limited per address). */
export const startPreviewAtom = Atom.family((key: string) => {
  const parsed: unknown = JSON.parse(key);
  const resume = Predicate.isObject(parsed) ? parsed['resume'] : null;
  const theme =
    Predicate.isObject(parsed) && Predicate.isString(parsed['theme'])
      ? parsed['theme']
      : 'elegant';
  return ApiClient.query('import', 'preview', { payload: { resume, theme } });
});

/** The resume with its theme set in meta, as it will be saved. */
export const withTheme = (resume: Json, theme: string): Json => {
  const base = Predicate.isObject(resume) ? resume : {};
  const meta = Predicate.isObject(base['meta']) ? base['meta'] : {};
  return { ...base, meta: { ...meta, theme } };
};
