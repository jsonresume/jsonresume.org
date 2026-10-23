import { stringify } from 'yaml';
import type { Entry } from './read';
import { toText } from './text';

/** Data formats a resume is served in. HTML comes from a theme instead. */
export const dataFormats = ['json', 'yaml', 'txt'] as const;
export type DataFormat = (typeof dataFormats)[number];

export interface Formatted {
  body: string;
  contentType: string;
}

/** A resume in one of the data formats. */
export function formatResume(format: DataFormat, resume: Entry): Formatted {
  switch (format) {
    case 'json':
      return {
        body: `${JSON.stringify(resume, null, 2)}\n`,
        contentType: 'application/json; charset=utf-8',
      };
    case 'yaml':
      return {
        body: stringify(resume),
        contentType: 'application/yaml; charset=utf-8',
      };
    case 'txt':
      return { body: toText(resume), contentType: 'text/plain; charset=utf-8' };
  }
}
