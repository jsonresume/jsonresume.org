import React from 'react';
import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  DateRange,
  Badge,
  BadgeList,
  ContactInfo,
  Avatar,
  Link,
  safeUrl,
} from '@jsonresume/core';

// Field Researcher palette — academic, exploratory, scientific humility
const INK = '#1f2a28';
const INK_SOFT = '#4a5654';
const INK_FAINT = '#73807d';
const TEAL = '#0d9488';
const TEAL_DEEP = '#0b6b62';
const PAPER = '#fcfbf7';
const RAIL = '#e7e3d6';
const MUTED_FILL = '#f4f2ea';

const SERIF = "'Spectral', Georgia, 'Times New Roman', serif";
const MONO = "'IBM Plex Mono', 'SFMono-Regular', Menlo, monospace";

const Layout = styled.div`
  max-width: 880px;
  margin: 0 auto;
  padding: 64px 56px 72px;
  background: ${PAPER};
  font-family: ${SERIF};
  color: ${INK};
  font-size: 15px;
  line-height: 1.62;

  @media print {
    padding: 36px 32px;
    background: #ffffff;
  }
  @media (max-width: 680px) {
    padding: 40px 24px;
  }
`;

/* ---------- Header ---------- */
const Header = styled.header`
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 28px;
  align-items: start;
  padding-bottom: 28px;
  border-bottom: 2px solid ${INK};
  margin-bottom: 8px;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
    gap: 18px;
  }
`;

const StyledAvatar = styled(Avatar)`
  border: 2px solid ${TEAL};
  border-radius: 4px;
`;

const Eyebrow = styled.div`
  font-family: ${MONO};
  font-size: 11px;
  letter-spacing: 2.6px;
  text-transform: uppercase;
  color: ${TEAL_DEEP};
  margin-bottom: 8px;
`;

const Name = styled.h1`
  font-family: ${SERIF};
  font-size: 42px;
  font-weight: 600;
  line-height: 1.04;
  letter-spacing: -0.4px;
  margin: 0;
  color: ${INK};
`;

const Label = styled.div`
  font-size: 17px;
  font-style: italic;
  color: ${INK_SOFT};
  margin-top: 6px;
`;

const StyledContactInfo = styled(ContactInfo)`
  justify-content: flex-start;
  gap: 18px;
  margin-top: 16px;
  font-family: ${MONO};
  font-size: 12px;
  letter-spacing: 0.3px;
  color: ${INK_SOFT};

  a {
    color: ${TEAL_DEEP};
    text-decoration: none;
    border-bottom: 1px solid ${RAIL};
    padding-bottom: 1px;
  }
  a:hover {
    border-bottom-color: ${TEAL};
  }
`;

const Abstract = styled.p`
  grid-column: 1 / -1;
  margin: 22px 0 0 0;
  padding: 4px 0 4px 20px;
  border-left: 3px solid ${TEAL};
  font-size: 16px;
  line-height: 1.66;
  color: ${INK_SOFT};
  font-style: italic;
`;

/* ---------- Section scaffolding ---------- */
const StyledSection = styled(Section)`
  margin-top: 40px;
`;

const StyledSectionTitle = styled(SectionTitle)`
  display: flex;
  align-items: baseline;
  gap: 14px;
  font-family: ${MONO};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2.4px;
  text-transform: uppercase;
  color: ${INK};
  margin: 0 0 22px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid ${RAIL};

  &::before {
    content: '${(p) => p.$index || '00'}';
    color: ${TEAL};
    font-weight: 600;
  }
  &::after {
    content: '';
    flex: 1;
    height: 0;
    border-top: 1px solid ${RAIL};
    align-self: center;
  }
`;

/* ---------- Specimen entry (rail + body) ---------- */
const EntryRow = styled.div`
  display: grid;
  grid-template-columns: 154px 1fr;
  gap: 28px;
  margin-bottom: 26px;
  padding-bottom: 26px;
  border-bottom: 1px solid ${RAIL};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const Rail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 14px;
  border-left: 2px solid ${TEAL};

  @media (max-width: 680px) {
    border-left: none;
    padding-left: 0;
  }
`;

const RailDate = styled.div`
  font-family: ${MONO};
  font-size: 12px;
  font-weight: 500;
  color: ${INK};
  font-variant-numeric: tabular-nums;
`;

const RailMeta = styled.div`
  font-family: ${MONO};
  font-size: 11px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: ${INK_FAINT};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

const EntryTitle = styled.h3`
  font-family: ${SERIF};
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: ${INK};
  letter-spacing: -0.2px;

  a {
    color: ${INK};
    text-decoration: none;
    border-bottom: 1px solid ${TEAL};
  }
`;

const EntrySubtitle = styled.div`
  font-size: 15px;
  font-style: italic;
  color: ${TEAL_DEEP};
  margin-top: 3px;
`;

const EntryText = styled.p`
  margin: 12px 0 0 0;
  font-size: 15px;
  line-height: 1.62;
  color: ${INK_SOFT};
`;

const FindingsList = styled.ul`
  margin: 12px 0 0 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    padding-left: 22px;
    margin-bottom: 7px;
    font-size: 14.5px;
    line-height: 1.55;
    color: ${INK_SOFT};
  }
  li::before {
    content: '\\2192';
    position: absolute;
    left: 0;
    top: 0;
    color: ${TEAL};
    font-family: ${MONO};
    font-weight: 600;
  }
`;

/* ---------- Skills / specimen index ---------- */
const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 18px;
`;

const SkillBlock = styled.div`
  border-top: 2px solid ${TEAL};
  padding-top: 10px;

  h4 {
    font-family: ${MONO};
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    margin: 0 0 10px 0;
    color: ${INK};
  }
`;

const StyledBadgeList = styled(BadgeList)`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

const StyledBadge = styled(Badge)`
  font-family: ${MONO};
  font-size: 11.5px;
  letter-spacing: 0.3px;
  padding: 3px 9px;
  background: ${MUTED_FILL};
  border: 1px solid ${RAIL};
  border-radius: 3px;
  color: ${INK_SOFT};
`;

/* ---------- Compact card list (awards, certs, pubs, refs, interests) ---------- */
const CardList = styled.div`
  display: grid;
  grid-template-columns: ${(p) => (p.$two ? 'repeat(2, 1fr)' : '1fr')};
  gap: 16px;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  padding: 14px 16px;
  background: ${MUTED_FILL};
  border-left: 3px solid ${TEAL};
  border-radius: 0 3px 3px 0;

  h4 {
    font-family: ${SERIF};
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: ${INK};
  }
  h4 a {
    color: ${INK};
    text-decoration: none;
    border-bottom: 1px solid ${TEAL};
  }
  .meta {
    font-family: ${MONO};
    font-size: 11px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: ${INK_FAINT};
    margin-top: 4px;
  }
  p {
    margin: 8px 0 0 0;
    font-size: 14.5px;
    line-height: 1.55;
    color: ${INK_SOFT};
  }
`;

const LangGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 26px;
`;

const LangItem = styled.div`
  .lang {
    font-family: ${SERIF};
    font-size: 16px;
    font-weight: 600;
    color: ${INK};
  }
  .fluency {
    font-family: ${MONO};
    font-size: 11px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: ${TEAL_DEEP};
    margin-top: 2px;
  }
`;

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

function Findings({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <FindingsList>
      {items.map((h, i) => (
        <li key={i}>{h}</li>
      ))}
    </FindingsList>
  );
}

// Generic specimen entry: rail (date + meta) on the left, narrative on the right
function Entry({ date, meta, title, href, subtitle, text, highlights }) {
  return (
    <EntryRow>
      <Rail>
        {date && <RailDate>{date}</RailDate>}
        {meta && <RailMeta>{meta}</RailMeta>}
      </Rail>
      <Body>
        <EntryTitle>
          {href ? <Link href={safeUrl(href)}>{title}</Link> : title}
        </EntryTitle>
        {subtitle && <EntrySubtitle>{subtitle}</EntrySubtitle>}
        {text && <EntryText>{text}</EntryText>}
        <Findings items={highlights} />
      </Body>
    </EntryRow>
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
    <Layout>
      <Header>
        {basics.image && (
          <StyledAvatar
            src={basics.image}
            alt={basics.name}
            size="96px"
            rounded={false}
          />
        )}
        <div>
          <Eyebrow>Field Dossier</Eyebrow>
          {basics.name && <Name>{basics.name}</Name>}
          {basics.label && <Label>{basics.label}</Label>}
          <StyledContactInfo basics={basics} />
        </div>
        {basics.summary && <Abstract>{basics.summary}</Abstract>}
      </Header>

      {work.length > 0 && (
        <StyledSection>
          <StyledSectionTitle $index={idx()}>
            Field Experience
          </StyledSectionTitle>
          {work.map((job, i) => (
            <Entry
              key={i}
              date={
                <DateRange startDate={job.startDate} endDate={job.endDate} />
              }
              meta={job.location}
              title={job.position || job.name}
              href={job.url}
              subtitle={job.position && job.name ? job.name : null}
              text={job.summary}
              highlights={job.highlights}
            />
          ))}
        </StyledSection>
      )}

      {projects.length > 0 && (
        <StyledSection>
          <StyledSectionTitle $index={idx()}>
            Research Projects
          </StyledSectionTitle>
          {projects.map((p, i) => (
            <Entry
              key={i}
              date={<DateRange startDate={p.startDate} endDate={p.endDate} />}
              meta={p.type || (p.keywords && p.keywords[0])}
              title={p.name}
              href={p.url}
              text={p.description}
              highlights={p.highlights}
            />
          ))}
        </StyledSection>
      )}

      {publications.length > 0 && (
        <StyledSection>
          <StyledSectionTitle $index={idx()}>Publications</StyledSectionTitle>
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
        </StyledSection>
      )}

      {education.length > 0 && (
        <StyledSection>
          <StyledSectionTitle $index={idx()}>Education</StyledSectionTitle>
          {education.map((e, i) => (
            <Entry
              key={i}
              date={<DateRange startDate={e.startDate} endDate={e.endDate} />}
              meta={e.score ? `GPA ${e.score}` : null}
              title={e.institution}
              href={e.url}
              subtitle={
                [e.studyType, e.area].filter(Boolean).join(', ') || null
              }
              highlights={e.courses}
            />
          ))}
        </StyledSection>
      )}

      {skills.length > 0 && (
        <StyledSection>
          <StyledSectionTitle $index={idx()}>
            Methods &amp; Skills
          </StyledSectionTitle>
          <SkillsGrid>
            {skills.map((skill, i) => (
              <SkillBlock key={i}>
                <h4>{skill.name}</h4>
                <StyledBadgeList>
                  {skill.keywords?.map((k, j) => (
                    <StyledBadge key={j}>{k}</StyledBadge>
                  ))}
                </StyledBadgeList>
              </SkillBlock>
            ))}
          </SkillsGrid>
        </StyledSection>
      )}

      {volunteer.length > 0 && (
        <StyledSection>
          <StyledSectionTitle $index={idx()}>
            Volunteer &amp; Fieldwork
          </StyledSectionTitle>
          {volunteer.map((v, i) => (
            <Entry
              key={i}
              date={<DateRange startDate={v.startDate} endDate={v.endDate} />}
              meta={v.url ? 'Organization' : null}
              title={v.position}
              href={v.url}
              subtitle={v.organization}
              text={v.summary}
              highlights={v.highlights}
            />
          ))}
        </StyledSection>
      )}

      {awards.length > 0 && (
        <StyledSection>
          <StyledSectionTitle $index={idx()}>
            Awards &amp; Honors
          </StyledSectionTitle>
          <CardList $two>
            {awards.map((a, i) => (
              <Card key={i}>
                <h4>{a.title}</h4>
                <div className="meta">
                  {[a.awarder, fmtDate(a.date)].filter(Boolean).join(' · ')}
                </div>
                {a.summary && <p>{a.summary}</p>}
              </Card>
            ))}
          </CardList>
        </StyledSection>
      )}

      {certificates.length > 0 && (
        <StyledSection>
          <StyledSectionTitle $index={idx()}>Certificates</StyledSectionTitle>
          <CardList $two>
            {certificates.map((c, i) => (
              <Card key={i}>
                <h4>
                  {c.url ? <Link href={safeUrl(c.url)}>{c.name}</Link> : c.name}
                </h4>
                <div className="meta">
                  {[c.issuer, fmtDate(c.date)].filter(Boolean).join(' · ')}
                </div>
              </Card>
            ))}
          </CardList>
        </StyledSection>
      )}

      {languages.length > 0 && (
        <StyledSection>
          <StyledSectionTitle $index={idx()}>Languages</StyledSectionTitle>
          <LangGrid>
            {languages.map((l, i) => (
              <LangItem key={i}>
                <div className="lang">{l.language}</div>
                {l.fluency && <div className="fluency">{l.fluency}</div>}
              </LangItem>
            ))}
          </LangGrid>
        </StyledSection>
      )}

      {interests.length > 0 && (
        <StyledSection>
          <StyledSectionTitle $index={idx()}>Interests</StyledSectionTitle>
          <CardList $two>
            {interests.map((it, i) => (
              <Card key={i}>
                <h4>{it.name}</h4>
                {it.keywords && it.keywords.length > 0 && (
                  <p>{it.keywords.join(', ')}</p>
                )}
              </Card>
            ))}
          </CardList>
        </StyledSection>
      )}

      {references.length > 0 && (
        <StyledSection>
          <StyledSectionTitle $index={idx()}>References</StyledSectionTitle>
          <CardList>
            {references.map((r, i) => (
              <Card key={i}>
                <h4>{r.name}</h4>
                {r.reference && <p>{r.reference}</p>}
              </Card>
            ))}
          </CardList>
        </StyledSection>
      )}
    </Layout>
  );
}

export default Resume;
