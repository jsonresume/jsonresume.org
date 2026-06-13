import React from 'react';
import { safeUrl, Link } from '@jsonresume/core';
import * as S from './styles.js';

const pad = (n) => String(n).padStart(2, '0');

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// Format a standalone YYYY-MM-DD (or YYYY-MM / YYYY) date as "Mon YYYY"
function fmtDate(value) {
  if (!value) return null;
  const m = /^(\d{4})(?:-(\d{2}))?/.exec(String(value));
  if (!m) return value;
  const year = m[1];
  const month = m[2] ? MONTHS[Number(m[2]) - 1] : null;
  return month ? `${month} ${year}` : year;
}

function FieldTitle({ index, children }) {
  return <S.StyledSectionTitle $index={index}>{children}</S.StyledSectionTitle>;
}

function Findings({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <S.Findings>
      {items.map((h, i) => (
        <li key={i}>{h}</li>
      ))}
    </S.Findings>
  );
}

// Generic specimen entry: rail (date + meta) on the left, narrative on the right
function Entry({ date, meta, title, href, subtitle, text, highlights }) {
  return (
    <S.Entry>
      <S.Rail>
        {date && <S.RailDate>{date}</S.RailDate>}
        {meta && <S.RailMeta>{meta}</S.RailMeta>}
      </S.Rail>
      <S.Body>
        <S.EntryTitle>
          {href ? <Link href={safeUrl(href)}>{title}</Link> : title}
        </S.EntryTitle>
        {subtitle && <S.EntrySubtitle>{subtitle}</S.EntrySubtitle>}
        {text && <S.EntryText>{text}</S.EntryText>}
        <Findings items={highlights} />
      </S.Body>
    </S.Entry>
  );
}

function Resume({ resume }) {
  const {
    basics = {},
    work = [],
    volunteer = [],
    education = [],
    awards = [],
    certificates = [],
    publications = [],
    skills = [],
    languages = [],
    interests = [],
    references = [],
    projects = [],
  } = resume;

  let n = 0;
  const idx = () => pad(++n);

  return (
    <S.Layout>
      <S.Header>
        {basics.image && (
          <S.StyledAvatar
            src={basics.image}
            alt={basics.name}
            size="96px"
            rounded={false}
          />
        )}
        <div>
          <S.Eyebrow>Field Dossier</S.Eyebrow>
          {basics.name && <S.Name>{basics.name}</S.Name>}
          {basics.label && <S.Label>{basics.label}</S.Label>}
          <S.StyledContactInfo basics={basics} />
        </div>
        {basics.summary && <S.Abstract>{basics.summary}</S.Abstract>}
      </S.Header>

      {work.length > 0 && (
        <S.StyledSection>
          <FieldTitle index={idx()}>Field Experience</FieldTitle>
          {work.map((job, i) => (
            <Entry
              key={i}
              date={
                <S.DateRange startDate={job.startDate} endDate={job.endDate} />
              }
              meta={job.location}
              title={job.position || job.name}
              href={job.url}
              subtitle={job.position && job.name ? job.name : null}
              text={job.summary}
              highlights={job.highlights}
            />
          ))}
        </S.StyledSection>
      )}

      {projects.length > 0 && (
        <S.StyledSection>
          <FieldTitle index={idx()}>Research Projects</FieldTitle>
          {projects.map((p, i) => (
            <Entry
              key={i}
              date={<S.DateRange startDate={p.startDate} endDate={p.endDate} />}
              meta={p.type || (p.keywords && p.keywords[0])}
              title={p.name}
              href={p.url}
              text={p.description}
              highlights={p.highlights}
            />
          ))}
        </S.StyledSection>
      )}

      {publications.length > 0 && (
        <S.StyledSection>
          <FieldTitle index={idx()}>Publications</FieldTitle>
          {publications.map((p, i) => (
            <Entry
              key={i}
              date={fmtDate(p.releaseDate)}
              meta={p.publisher}
              title={p.name}
              href={p.url}
              text={p.summary}
            />
          ))}
        </S.StyledSection>
      )}

      {education.length > 0 && (
        <S.StyledSection>
          <FieldTitle index={idx()}>Education</FieldTitle>
          {education.map((e, i) => (
            <Entry
              key={i}
              date={<S.DateRange startDate={e.startDate} endDate={e.endDate} />}
              meta={e.score ? `GPA ${e.score}` : null}
              title={e.institution}
              href={e.url}
              subtitle={
                [e.studyType, e.area].filter(Boolean).join(', ') || null
              }
              highlights={e.courses}
            />
          ))}
        </S.StyledSection>
      )}

      {skills.length > 0 && (
        <S.StyledSection>
          <FieldTitle index={idx()}>Methods &amp; Skills</FieldTitle>
          <S.SkillsGrid>
            {skills.map((skill, i) => (
              <S.SkillBlock key={i}>
                <h4>{skill.name}</h4>
                <S.StyledBadgeList>
                  {skill.keywords?.map((k, j) => (
                    <S.StyledBadge key={j}>{k}</S.StyledBadge>
                  ))}
                </S.StyledBadgeList>
              </S.SkillBlock>
            ))}
          </S.SkillsGrid>
        </S.StyledSection>
      )}

      {volunteer.length > 0 && (
        <S.StyledSection>
          <FieldTitle index={idx()}>Volunteer &amp; Fieldwork</FieldTitle>
          {volunteer.map((v, i) => (
            <Entry
              key={i}
              date={<S.DateRange startDate={v.startDate} endDate={v.endDate} />}
              meta={v.url ? 'Organization' : null}
              title={v.position}
              href={v.url}
              subtitle={v.organization}
              text={v.summary}
              highlights={v.highlights}
            />
          ))}
        </S.StyledSection>
      )}

      {awards.length > 0 && (
        <S.StyledSection>
          <FieldTitle index={idx()}>Awards &amp; Honors</FieldTitle>
          <S.CardList $two>
            {awards.map((a, i) => (
              <S.Card key={i}>
                <h4>{a.title}</h4>
                <div className="meta">
                  {[a.awarder, fmtDate(a.date)].filter(Boolean).join(' · ')}
                </div>
                {a.summary && <p>{a.summary}</p>}
              </S.Card>
            ))}
          </S.CardList>
        </S.StyledSection>
      )}

      {certificates.length > 0 && (
        <S.StyledSection>
          <FieldTitle index={idx()}>Certificates</FieldTitle>
          <S.CardList $two>
            {certificates.map((c, i) => (
              <S.Card key={i}>
                <h4>
                  {c.url ? <Link href={safeUrl(c.url)}>{c.name}</Link> : c.name}
                </h4>
                <div className="meta">
                  {[c.issuer, fmtDate(c.date)].filter(Boolean).join(' · ')}
                </div>
              </S.Card>
            ))}
          </S.CardList>
        </S.StyledSection>
      )}

      {languages.length > 0 && (
        <S.StyledSection>
          <FieldTitle index={idx()}>Languages</FieldTitle>
          <S.LangGrid>
            {languages.map((l, i) => (
              <S.LangItem key={i}>
                <div className="lang">{l.language}</div>
                {l.fluency && <div className="fluency">{l.fluency}</div>}
              </S.LangItem>
            ))}
          </S.LangGrid>
        </S.StyledSection>
      )}

      {interests.length > 0 && (
        <S.StyledSection>
          <FieldTitle index={idx()}>Interests</FieldTitle>
          <S.CardList $two>
            {interests.map((it, i) => (
              <S.Card key={i}>
                <h4>{it.name}</h4>
                {it.keywords && it.keywords.length > 0 && (
                  <p>{it.keywords.join(', ')}</p>
                )}
              </S.Card>
            ))}
          </S.CardList>
        </S.StyledSection>
      )}

      {references.length > 0 && (
        <S.StyledSection>
          <FieldTitle index={idx()}>References</FieldTitle>
          <S.CardList>
            {references.map((r, i) => (
              <S.Card key={i}>
                <h4>{r.name}</h4>
                {r.reference && <p>{r.reference}</p>}
              </S.Card>
            ))}
          </S.CardList>
        </S.StyledSection>
      )}
    </S.Layout>
  );
}

export default Resume;
