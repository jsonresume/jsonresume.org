import { Predicate } from 'effect';

export type Path = ReadonlyArray<string | number>;
export type Json = unknown;

/** The value at `path`, or undefined. */
export function getAt(value: Json, path: Path): Json {
  let current: Json = value;
  for (const key of path) {
    if (typeof key === 'number')
      current = Array.isArray(current) ? current[key] : undefined;
    else
      current =
        Predicate.isObject(current) && !Array.isArray(current)
          ? current[key]
          : undefined;
  }
  return current;
}

const isEmpty = (v: Json) =>
  v === undefined ||
  v === '' ||
  (Array.isArray(v) && v.length === 0) ||
  (Predicate.isObject(v) && !Array.isArray(v) && Object.keys(v).length === 0);

/**
 * A copy of `value` with `next` at `path`. Clearing a field (empty text,
 * list or object) removes its key, so the JSON stays as tidy as a person
 * would write it; list items stay in place.
 */
export function setAt(value: Json, path: Path, next: Json): Json {
  const [key, ...rest] = path;
  if (key === undefined) return next;
  if (typeof key === 'number') {
    const list = Array.isArray(value) ? [...value] : [];
    list[key] = setAt(list[key], rest, next);
    return list;
  }
  const object =
    Predicate.isObject(value) && !Array.isArray(value) ? { ...value } : {};
  const child = setAt(object[key], rest, next);
  if (isEmpty(child)) delete object[key];
  else object[key] = child;
  return object;
}
