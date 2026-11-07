import { Predicate } from 'effect';
import type { ResumeDocument } from './render.ts';

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
            website:
              job['website'] ??
              (Predicate.isString(job['url']) &&
              /^https?:\/\//i.test(job['url'])
                ? job['url']
                : undefined),
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
