import { Predicate } from 'effect';
import type { ResumeDocument } from './render.ts';

const legacyWebsite = (value: unknown) =>
  Predicate.isString(value) && /^https?:\/\//i.test(value) ? value : undefined;

/** This template reads `photo` and `website`, not the current schema fields. */
export function withLegacyBasics(
  theme: string,
  resume: ResumeDocument
): ResumeDocument {
  const basics = resume['basics'];
  if (theme !== 'tan-responsive' || !Predicate.isObject(basics)) return resume;
  return {
    ...resume,
    basics: {
      ...basics,
      picture: basics['picture'] ?? basics['image'],
      photo: basics['photo'] ?? basics['picture'] ?? basics['image'],
      website: basics['website'] ?? legacyWebsite(basics['url']),
    },
  };
}

/** These older templates hide the entire role heading without `company`. */
export function withLegacyWorkNames(
  theme: string,
  resume: ResumeDocument
): ResumeDocument {
  if (
    !['paper-plus-plus', 'tan-responsive'].includes(theme) ||
    !Array.isArray(resume['work'])
  )
    return resume;
  return {
    ...resume,
    work: resume['work'].map((job: unknown) =>
      Predicate.isObject(job)
        ? {
            ...job,
            company: job['company'] ?? job['name'],
            website: job['website'] ?? legacyWebsite(job['url']),
            // This template has no summary slot, but does render bullets.
            ...(theme === 'tan-responsive' &&
            Predicate.isString(job['summary']) &&
            job['summary'].trim()
              ? {
                  highlights: [
                    job['summary']
                      .replace(
                        /[&<>"']/g,
                        (char) =>
                          ({
                            '&': '&amp;',
                            '<': '&lt;',
                            '>': '&gt;',
                            '"': '&quot;',
                            "'": '&#39;',
                          }[char] ?? char)
                      )
                      .replace(/\n/g, '<br>'),
                    ...(Array.isArray(job['highlights'])
                      ? job['highlights']
                      : []),
                  ],
                }
              : {}),
          }
        : job
    ),
  };
}
