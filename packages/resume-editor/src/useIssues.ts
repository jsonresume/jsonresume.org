import type { JsonSchemaNode } from '@repo/schema-explorer/model';
import { useDeferredValue, useMemo } from 'react';
import { pathKey } from './form/context';
import { validate } from './validate';
import type { Json } from './values';

const FIELD = '\u0000';
const NEXT = '\u0001';

/**
 * The draft's schema problems, worked out after a keystroke has painted
 * (on a deferred copy of the draft), as a map by field path whose identity
 * holds while its content does: every field reads it from context, so a
 * new map on each key re-rendered the whole form (616ms a key, 4x CPU, dev).
 */
export function useIssues(draft: Json, schema: JsonSchemaNode) {
  const settled = useDeferredValue(draft);
  const issues = useMemo(
    () => (settled === null ? [] : validate(settled, schema)),
    [settled, schema]
  );
  const key = issues
    .map((i) => `${pathKey(i.path)}${FIELD}${i.message}`)
    .join(NEXT);
  const issueMap = useMemo(
    () =>
      new Map(
        key === ''
          ? []
          : key.split(NEXT).map((entry) => {
              const [path = '', message = ''] = entry.split(FIELD);
              return [path, message] as const;
            })
      ),
    [key]
  );
  return { issues, issueMap, settled };
}
