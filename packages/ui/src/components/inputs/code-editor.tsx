'use client';

import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter, lintGutter, type Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import { useMemo, useState } from 'react';
import { vars } from '../../tokens/contract.css';
import * as s from './inputs.css';

export type { Diagnostic };

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  /** Extra checks on valid JSON, e.g. schema validation. Return problems as diagnostics. */
  validate?: (value: string) => Diagnostic[];
  /** Accessible name of the editor. */
  label: string;
  height?: string;
  readOnly?: boolean;
}

// The editor's colors come from the design tokens, so it follows the theme.
const theme = EditorView.theme({
  '&': {
    backgroundColor: vars.color.surface.raised,
    color: vars.color.text.default,
  },
  '.cm-content': {
    fontFamily: vars.font.family.mono,
    caretColor: vars.color.text.strong,
  },
  '.cm-gutters': {
    backgroundColor: vars.color.surface.subtle,
    color: vars.color.text.muted,
    borderRight: `1px solid ${vars.color.border.subtle}`,
  },
  '.cm-activeLine, .cm-activeLineGutter': {
    backgroundColor: vars.color.surface.brandSubtle,
  },
  '&.cm-focused': { outline: 'none' },
  '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
    backgroundColor: `${vars.color.surface.brand} !important`,
  },
  '.cm-tooltip': {
    border: `1px solid ${vars.color.border.subtle}`,
    backgroundColor: vars.color.surface.raised,
    color: vars.color.text.default,
  },
});

/**
 * JSON editing with syntax highlighting, parse errors as you type, and
 * optional extra validation (e.g. the resume schema). A status line
 * summarises problems for screen readers.
 */
export function CodeEditor({
  value,
  onChange,
  validate,
  label,
  height = '20rem',
  readOnly = false,
}: CodeEditorProps) {
  const [problems, setProblems] = useState(0);
  const extensions = useMemo(() => {
    const parse = jsonParseLinter();
    return [
      json(),
      theme,
      lintGutter(),
      linter((view) => {
        const found = parse(view);
        const extra =
          found.length || !validate ? [] : validate(view.state.doc.toString());
        const all = [...found, ...extra];
        setProblems(all.length);
        return all;
      }),
      EditorView.contentAttributes.of({ 'aria-label': label }),
    ];
  }, [validate, label]);

  return (
    <div className={s.codeEditor} data-invalid={problems > 0}>
      <CodeMirror
        value={value}
        height={height}
        readOnly={readOnly}
        extensions={extensions}
        onChange={onChange}
        basicSetup={{
          foldGutter: true,
          highlightActiveLine: true,
          autocompletion: false,
        }}
      />
      <p
        className={s.codeStatus}
        data-invalid={problems > 0}
        aria-live="polite"
      >
        {problems
          ? `${problems} ${problems === 1 ? 'problem' : 'problems'}`
          : 'Valid JSON'}
      </p>
    </div>
  );
}
