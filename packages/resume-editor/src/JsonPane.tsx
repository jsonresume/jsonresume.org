import { useAtom, useAtomSet } from '@effect/atom-react';
import { CodeEditor } from '@jsonresume/ui';
import type { JsonSchemaNode } from '@repo/schema-explorer';
import { useCallback } from 'react';
import { schemaDiagnostics } from './diagnostics';
import { draftAtom, jsonTextAtom } from './state';

/** The resume as JSON, checked against the schema as you type. */
export function JsonPane({ schema }: { schema: JsonSchemaNode }) {
  const [text, setText] = useAtom(jsonTextAtom);
  const setDraft = useAtomSet(draftAtom);
  const validate = useCallback(
    (value: string) => schemaDiagnostics(value, schema),
    [schema]
  );
  return (
    <CodeEditor
      label="Resume JSON"
      value={text}
      height="100%"
      validate={validate}
      onChange={(next) => {
        setText(next);
        try {
          setDraft(JSON.parse(next));
        } catch {
          // Not JSON yet: keep typing; the editor marks the error.
        }
      }}
    />
  );
}
