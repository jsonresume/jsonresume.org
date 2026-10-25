import { stringify } from 'yaml';
import type { Entry } from './read';
import { toRenderCv } from './rendercv';
import { toText } from './text';

/**
 * Text formats a resume is served in. HTML and PDF come from a theme
 * instead, and the QR code from the page's URL (./qr).
 */
export const dataFormats = ['json', 'yaml', 'txt', 'rendercv'] as const;
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
    case 'rendercv':
      return {
        body: toRenderCv(resume),
        contentType: 'application/yaml; charset=utf-8',
      };
  }
}
