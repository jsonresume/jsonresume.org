'use client';

import { CodeEditor, type Diagnostic } from '@jsonresume/ui';
import { useState } from 'react';

const initial = `{
  "basics": {
    "name": "Richard Hendriks",
    "label": "Programmer",
    "email": "richard@piedpiper.com"
  },
  "work": []
}`;

// Your own checks run after the JSON parses, e.g. schema validation.
function validate(value: string): Diagnostic[] {
  const doc = JSON.parse(value) as { basics?: { name?: unknown } };
  const at = value.indexOf('"basics"');
  return typeof doc.basics?.name === 'string'
    ? []
    : [
        {
          from: Math.max(at, 0),
          to: Math.max(at, 0) + 8,
          severity: 'error',
          message: 'basics.name must be a string',
        },
      ];
}

export default function CodeEditorResume() {
  const [value, setValue] = useState(initial);
  return (
    <CodeEditor
      label="resume.json"
      value={value}
      onChange={setValue}
      validate={validate}
      height="14rem"
    />
  );
}
