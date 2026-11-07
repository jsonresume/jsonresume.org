import { handlePath } from '@repo/profiles';
import { docxContentType, qrPng, toDocx } from '@repo/resume-formats';
import type { Entry } from '@repo/resume-formats/read';
import { paperFor, ResumePdf } from '@repo/resume-pdf';
import { Config, Effect, Predicate } from 'effect';
import { headers } from './outcome';

/** Where the person lives, for the paper size: basics.location.countryCode. */
const countryOf = (resume: unknown): string | undefined => {
  const basics = Predicate.isObject(resume) ? resume['basics'] : undefined;
  const location = Predicate.isObject(basics) ? basics['location'] : undefined;
  const code = Predicate.isObject(location)
    ? location['countryCode']
    : undefined;
  return Predicate.isString(code) ? code : undefined;
};

/** ?fit=1 (or true): shrink a page that runs slightly over onto one. */
const fitAsked = (search: URLSearchParams) =>
  ['1', 'true'].includes(search.get('fit')?.toLowerCase() ?? '');

/**
 * A themed page printed to PDF, on the paper ?paper= or the country asks
 * for, fitted to one page when ?fit=1 asks and it nearly fits.
 */
export const pdfResponse = (
  html: string,
  username: string,
  resume: unknown,
  search: URLSearchParams
) =>
  Effect.gen(function* () {
    const pdf = yield* (yield* ResumePdf).print(
      html,
      paperFor(search.get('paper'), countryOf(resume)),
      { fit: fitAsked(search) }
    );
    return new Response(pdf, {
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': `inline; filename="${username}.pdf"`,
        'cache-control': 'no-store',
        'access-control-allow-origin': '*',
      },
    });
  });

/** A QR code linking to the resume's page on this site. */
export const qrResponse = (username: string) =>
  Effect.gen(function* () {
    const site = yield* Config.String('SITE_URL').pipe(
      Config.withDefault('https://jsonresume.org'),
      Effect.orDie
    );
    const png = yield* Effect.promise(() =>
      qrPng(new URL(handlePath(username), site).href)
    );
    return new Response(png, {
      headers: {
        'content-type': 'image/png',
        // The page's address never changes, so neither does its code.
        'cache-control': 'public, max-age=86400',
        'access-control-allow-origin': '*',
      },
    });
  });

/** The resume as a Word document, saved under the username, on the PDF's paper. */
export const docxResponse = (
  username: string,
  resume: Entry,
  paper: string | null
) =>
  Effect.map(
    Effect.promise(() => toDocx(resume, paperFor(paper, countryOf(resume)))),
    (docx) =>
      new Response(docx, {
        headers: {
          ...headers(docxContentType),
          'content-disposition': `attachment; filename="${username}.docx"`,
        },
      })
  );
