import { useAtomSet } from '@effect/atom-react';
import { useMemo, type ReactNode } from 'react';
import { draftAtom } from '../state';
import { setAt, type Json, type Path } from '../values';
import { FormContext } from './context';

/** Gives the form's fields a way to change the draft, and its problems. */
export function FormProvider({
  issues,
  children,
}: {
  issues: ReadonlyMap<string, string>;
  children: ReactNode;
}) {
  const setDraft = useAtomSet(draftAtom);
  const value = useMemo(
    () => ({
      set: (path: Path, next: Json) =>
        setDraft((draft: Json) => setAt(draft ?? {}, path, next)),
      issues,
    }),
    [setDraft, issues]
  );
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}
