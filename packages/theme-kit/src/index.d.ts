/* eslint-disable no-unused-vars -- Declaration parameter names document the API. */
import type { ReactElement } from 'react';

export type SectionCoverage = Record<string, boolean>;
export interface QaExpect {
  (value: unknown, message?: string): {
    toBe(expected: unknown): void;
    toEqual(expected: unknown): void;
  };
}
export declare const HANDLEBARS_THEMES: string[];
export declare const BASELINE_SECTIONS: string[];
export declare const SECTION_SENTINELS: Record<string, string[]>;
export declare function findArtifacts(html: string): string[];
export declare function sectionCoverage(html: string): SectionCoverage;
export declare function assertThemeRender(
  expect: QaExpect,
  name: string,
  html: string
): SectionCoverage;
export declare function runThemeRenderQa(options: {
  render: (resume: unknown) => string | Promise<string>;
  name: string;
  expect: QaExpect;
  fixture?: object;
}): Promise<SectionCoverage>;
export declare function googleFontsLinks(families?: string[]): string;
export declare function renderResumeDocument(
  element: ReactElement,
  options?: {
    fonts?: string[];
    title?: string;
    lang?: string;
    dir?: string;
    reset?: boolean;
    head?: string;
    headAfterStyles?: string;
    includeTokensCss?: boolean;
    bodyClass?: string;
  }
): string;
