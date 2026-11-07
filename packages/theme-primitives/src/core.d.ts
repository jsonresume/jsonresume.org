declare module '@jsonresume/core/ssr' {
  export function renderResumeDocument(
    element: import('react').ReactElement,
    options: {
      title?: string;
      lang?: string;
      dir?: string;
      head?: string;
      reset?: boolean;
      includeTokensCss?: boolean;
      fonts?: string[];
    }
  ): string;
}
