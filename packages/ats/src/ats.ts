import { entries, text, texts } from '@repo/resume-formats/read';
import { contact, education, summary } from './profile';
import { dates, experience, impact, skills } from './work';
import { ratingOf, summaryOf, type AtsReport } from './report';

/** The words a tracking system can search: summary, jobs, schools, skills. */
const wordsIn = (resume: Readonly<Record<string, unknown>>): number => {
  const basics = entries([resume['basics']])[0] ?? {};
  const parts = [
    text(basics['label']),
    text(basics['summary']),
    ...entries(resume['work']).flatMap((j) => [
      text(j['position']),
      text(j['summary']),
      ...texts(j['highlights']),
    ]),
    ...entries(resume['projects']).flatMap((p) => [
      text(p['description']),
      ...texts(p['highlights']),
    ]),
    ...entries(resume['skills']).flatMap((s) => [
      text(s['name']),
      ...texts(s['keywords']),
    ]),
  ];
  return parts.join(' ').split(/\s+/).filter(Boolean).length;
};

/**
 * How well applicant tracking systems (Greenhouse, Lever, Workday…) will
 * read a resume, from its JSON alone: contact details, jobs, schools,
 * skills, headline, achievements and dates, scored out of 100, with what
 * to fix and where. The same in the editor, the dashboard and MCP.
 */
export function checkAts(resume: unknown): AtsReport {
  const r = entries([resume])[0] ?? {};
  const basics = entries([r['basics']])[0] ?? {};
  const work = entries(r['work']);
  const schools = entries(r['education']);
  const checks = [
    contact(basics),
    experience(work),
    skills(entries(r['skills'])),
    summary(basics),
    impact(work, wordsIn(r)),
    education(schools),
    dates(work, schools),
  ];
  const score = checks.reduce((sum, c) => sum + c.score, 0);
  return {
    score,
    rating: ratingOf(score),
    summary: summaryOf(score, checks),
    checks,
  };
}
