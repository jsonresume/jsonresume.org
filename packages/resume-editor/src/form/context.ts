import { createContext, useContext } from 'react';
import type { Json, Path } from '../values';

export interface FormContextValue {
  /** Put `value` at `path` in the draft (empty values remove their key). */
  set: (path: Path, value: Json) => void;
  /** Problems by path ("work.0.startDate"), shown under their field. */
  issues: ReadonlyMap<string, string>;
}

export const FormContext = createContext<FormContextValue>({
  set: () => {},
  issues: new Map(),
});
export const useForm = () => useContext(FormContext);
export const pathKey = (path: Path) => path.join('.');

/**
 * A field whose spec, value and place are unchanged needn't render again:
 * edits copy only the path they change (setAt), so typing in one field
 * leaves every other field's value as it was.
 */
export const sameField = (
  a: { spec: unknown; value: Json; path: Path },
  b: { spec: unknown; value: Json; path: Path }
) =>
  a.spec === b.spec &&
  a.value === b.value &&
  pathKey(a.path) === pathKey(b.path);
