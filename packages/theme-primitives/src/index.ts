import { createElement } from 'react';
import { renderResumeDocument } from '@jsonresume/core/ssr';
import { Document } from './Document.js';
import { documentModel } from './model.js';
import { escapeHtml } from './data.js';
import './layout.css.js';
import './print.css.js';
import type { ThemeOptions } from './types.js';

const baseCss = '__JSONRESUME_INLINE_CSS__';

export function createTheme(options: ThemeOptions) {
  return function render(resume: unknown): string {
    const model = documentModel(resume, options);
    return renderResumeDocument(createElement(Document, { model, options }), {
      title: escapeHtml(`${model.name} — Resume`),
      lang: model.language,
      dir: model.direction,
      fonts: options.fonts,
      includeTokensCss: false,
      head: `<style>@page{margin:15mm 16mm}${baseCss}\n${options.css}</style>`,
    });
  };
}

export { classes } from './base.css.js';
export { tokens, defaults } from './tokens.css.js';
export type { ThemeOptions, SectionId } from './types.js';
