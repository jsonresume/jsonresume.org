import { handlePath } from '@repo/profiles';
import { qrPng } from '@repo/resume-formats';
import { paperFor, ResumePdf } from '@repo/resume-pdf';
import { Config, Effect, Predicate } from 'effect';

/** Where the person lives, for the paper size: basics.location.countryCode. */
const countryOf = (resume: unknown): string | undefined => {
  const basics = Predicate.isObject(resume) ? resume['basics'] : undefined;
  const location = Predicate.isObject(basics) ? basics['location'] : undefined;
  const code = Predicate.isObject(location)
    ? location['countryCode']
    : undefined;
  return Predicate.isString(code) ? code : undefined;
};

/** A themed page printed to PDF, on the paper ?paper= or the country asks for. */
export const pdfResponse = (
  html: string,
  username: string,
  resume: unknown,
  paper: string | null
) =>
  Effect.gen(function* () {
    const pdf = yield* (yield* ResumePdf).print(
      html,
      paperFor(paper, countryOf(resume))
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
