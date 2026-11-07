import { visuallyHidden } from '@jsonresume/ui';
import { Predicate } from 'effect';
import * as s from './examples.css';

type Entry = Record<string, unknown>;
const text = (v: unknown) => (Predicate.isString(v) ? v : undefined);
const entries = (v: unknown): Entry[] =>
  Array.isArray(v) ? v.filter((e): e is Entry => Predicate.isObject(e)) : [];
const strings = (v: unknown) =>
  Array.isArray(v) ? v.filter(Predicate.isString) : [];
const years = (e: Entry) =>
  [text(e['startDate'])?.slice(0, 4), text(e['endDate'])?.slice(0, 4) ?? 'now']
    .filter(Boolean)
    .join('–');

/** An example resume as readable text: the words are the point here. */
export function ResumeText({ resume }: { resume: Entry }) {
  const basics = Predicate.isObject(resume['basics']) ? resume['basics'] : {};
  return (
    <article className={s.resume} aria-labelledby="example-resume">
      <h2 id="example-resume" className={visuallyHidden}>
        The example resume
      </h2>
      <header>
        <p className={s.person}>{text(basics['name'])}</p>
        <p className={s.label}>{text(basics['label'])}</p>
        <p>{text(basics['summary'])}</p>
      </header>
      <h3 className={s.section}>Experience</h3>
      {entries(resume['work']).map((job) => (
        <section key={`${text(job['name'])}${text(job['startDate'])}`}>
          <p className={s.role}>
            {text(job['position'])}, {text(job['name'])}{' '}
            <span className={s.years}>{years(job)}</span>
          </p>
          {text(job['summary']) ? (
            <p className={s.muted}>{text(job['summary'])}</p>
          ) : null}
          <ul>
            {strings(job['highlights']).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </section>
      ))}
      {entries(resume['projects']).length > 0 ? (
        <>
          <h3 className={s.section}>Projects</h3>
          {entries(resume['projects']).map((p) => (
            <section key={text(p['name'])}>
              <p className={s.role}>{text(p['name'])}</p>
              <ul>
                {strings(p['highlights']).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </section>
          ))}
        </>
      ) : null}
      <h3 className={s.section}>Education</h3>
      {entries(resume['education']).map((e) => (
        <p key={text(e['institution'])}>
          {[text(e['studyType']), text(e['area'])].filter(Boolean).join(', ')},{' '}
          {text(e['institution'])}{' '}
          <span className={s.years}>{text(e['endDate'])}</span>
        </p>
      ))}
      <h3 className={s.section}>Skills</h3>
      <ul>
        {entries(resume['skills']).map((g) => (
          <li key={text(g['name'])}>
            <strong>{text(g['name'])}</strong>
            {strings(g['keywords']).length
              ? `: ${strings(g['keywords']).join(', ')}`
              : ''}
          </li>
        ))}
      </ul>
    </article>
  );
}
