import type { ReactNode } from 'react';
import { Avatar, Badge } from '../display/display';
import * as s from './data.css';

export interface JobCardProps {
  title: string;
  company: string;
  /** Link to the job; the whole card becomes clickable through it. */
  href?: string;
  location?: string;
  remote?: boolean;
  salary?: string;
  /** Free text such as "3 days ago". */
  posted?: string;
  /** 0–100 match with the reader's resume. */
  match?: number;
  tags?: string[];
  /** Footer controls: status toggles, actions menu. */
  actions?: ReactNode;
  headingLevel?: 2 | 3 | 4;
}

/** A job summary: role, company, essentials, match and actions. */
export function JobCard({
  title,
  company,
  href,
  location,
  remote,
  salary,
  posted,
  match,
  tags = [],
  actions,
  headingLevel = 3,
}: JobCardProps) {
  const Heading = `h${headingLevel}` as const;
  const meta = [location, remote ? 'Remote' : null, salary, posted].filter(
    Boolean
  ) as string[];
  return (
    <article className={s.entity}>
      <div className={s.entityHeader}>
        <div className={s.entityTitleWrap}>
          <Heading className={s.entityTitle}>
            {href ? (
              <a className={s.entityLink} href={href}>
                {title}
              </a>
            ) : (
              title
            )}
          </Heading>
          <p className={s.entitySubtitle}>{company}</p>
        </div>
        {match !== undefined ? (
          <p className={s.match}>
            <span className={s.matchNumber}>{Math.round(match)}%</span>
            match
          </p>
        ) : null}
      </div>
      {meta.length ? (
        <ul className={s.entityMeta}>
          {meta.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      ) : null}
      {tags.length ? (
        <div className={s.entityTags}>
          {tags.map((t) => (
            <Badge key={t} tone="outline">
              {t}
            </Badge>
          ))}
        </div>
      ) : null}
      {actions ? <div className={s.entityActions}>{actions}</div> : null}
    </article>
  );
}

export interface ResumeCardProps {
  name: string;
  /** Headline from basics.label: "Full Stack Developer". */
  label?: string;
  avatarUrl?: string | null;
  location?: string;
  href?: string;
  skills?: string[];
  /** Free text such as "Updated 2 days ago". */
  updated?: string;
  actions?: ReactNode;
  headingLevel?: 2 | 3 | 4;
}

/** A person summary from their resume: avatar, name, headline, skills. */
export function ResumeCard({
  name,
  label,
  avatarUrl,
  location,
  href,
  skills = [],
  updated,
  actions,
  headingLevel = 3,
}: ResumeCardProps) {
  const Heading = `h${headingLevel}` as const;
  const meta = [location, updated].filter(Boolean) as string[];
  return (
    <article className={s.entity}>
      <div className={s.entityHeader}>
        <Avatar name={name} src={avatarUrl} alt="" />
        <div className={s.entityTitleWrap}>
          <Heading className={s.entityTitle}>
            {href ? (
              <a className={s.entityLink} href={href}>
                {name}
              </a>
            ) : (
              name
            )}
          </Heading>
          {label ? <p className={s.entitySubtitle}>{label}</p> : null}
        </div>
      </div>
      {meta.length ? (
        <ul className={s.entityMeta}>
          {meta.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      ) : null}
      {skills.length ? (
        <div className={s.entityTags}>
          {skills.slice(0, 6).map((t) => (
            <Badge key={t} tone="outline">
              {t}
            </Badge>
          ))}
          {skills.length > 6 ? <Badge>+{skills.length - 6}</Badge> : null}
        </div>
      ) : null}
      {actions ? <div className={s.entityActions}>{actions}</div> : null}
    </article>
  );
}
