import type { McpToolInfo } from './catalog';

/** The catalog's import tools (@repo/resume-import). */
export const importTools: ReadonlyArray<McpToolInfo> = [
  {
    name: 'import_resume',
    group: 'resume',
    description:
      'Turn a resume the user already has into JSON Resume: pasted text, or a public URL of a PDF, a Word document (.docx) or a LinkedIn data export (.zip). Returns the resume (schema-valid), how sure the import is of each field (by JSON pointer, e.g. /work/0/startDate: high, medium or low), and what was left out. Nothing is saved: show the user the result, especially low-confidence fields, then save it with save_resume.',
    writes: false,
  },
];
