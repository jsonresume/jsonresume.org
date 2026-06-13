import React from 'react';
import styled from 'styled-components';
import { DateRange, Link, safeUrl } from '@jsonresume/core';

/*
 * Art School Modern
 * -----------------
 * An avant-garde, gallery/exhibition-catalogue aesthetic for designers and
 * artists. Oversized Archivo Black display type, asymmetric off-grid header,
 * an editorial Fraunces serif for expressive statements, and a single vivid
 * vermilion accent. Sections are numbered like catalogue entries.
 *
 * NOTE: All styled-components are intentionally kept INLINE in this file. A
 * separate styles.js makes the registry webpack resolve the default export as
 * undefined and crashes the route. Never name a styled-component `Date`.
 */

const ACCENT = '#ff3b1d';
const INK = '#111111';
const PAPER = '#f6f4ef';
const MUTE = '#6b6760';

const Page = styled.div`
  background: ${PAPER};
  color: ${INK};
  font-family: 'Archivo', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 15px;
  line-height: 1.6;
  padding: 0;
  margin: 0;
  -webkit-font-smoothing: antialiased;
`;

const Frame = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 88px 72px 120px;

  @media (max-width: 760px) {
    padding: 48px 28px 80px;
  }

  @media print {
    padding: 36px 32px;
  }
`;

/* ---------- Header ---------- */

const Header = styled.header`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 48px;
  align-items: end;
  padding-bottom: 40px;
  margin-bottom: 8px;
  border-bottom: 3px solid ${INK};

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 28px;
    align-items: start;
  }
`;

const Kicker = styled.div`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.42em;
  text-transform: uppercase;
  color: ${ACCENT};
  margin-bottom: 22px;
`;

const Name = styled.h1`
  font-family: 'Archivo Black', 'Archivo', sans-serif;
  font-weight: 400;
  font-size: clamp(56px, 11vw, 132px);
  line-height: 0.86;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  margin: 0;
  color: ${INK};
`;

const Label = styled.div`
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: clamp(20px, 3vw, 30px);
  line-height: 1.2;
  color: ${INK};
  margin-top: 26px;
  max-width: 30ch;
`;

const Plate = styled.figure`
  margin: 0;
  width: 168px;
  flex-shrink: 0;

  @media (max-width: 760px) {
    width: 132px;
  }
`;

const PlateImg = styled.img`
  width: 168px;
  height: 168px;
  object-fit: cover;
  display: block;
  filter: grayscale(100%) contrast(1.05);
  border: 3px solid ${INK};
  box-shadow: 12px 12px 0 ${ACCENT};

  @media (max-width: 760px) {
    width: 132px;
    height: 132px;
  }
`;

const PlateCaption = styled.figcaption`
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${MUTE};
  margin-top: 14px;
  text-align: right;
`;

/* ---------- Contact row ---------- */

const ContactBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 28px;
  padding: 22px 0 0;
  margin-bottom: 64px;
  font-size: 13px;
  letter-spacing: 0.04em;

  a {
    color: ${INK};
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.18s ease;
  }
  a:hover {
    border-color: ${ACCENT};
  }
`;

const ContactKey = styled.span`
  color: ${MUTE};
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 10px;
  margin-right: 8px;
  font-weight: 600;
`;

/* ---------- Intro statement ---------- */

const Statement = styled.section`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 56px;
  margin: 0 0 24px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const StatementMark = styled.div`
  font-family: 'Archivo Black', 'Archivo', sans-serif;
  font-size: 13px;
  letter-spacing: 0.1em;
  color: ${ACCENT};
  padding-top: 14px;
`;

const StatementText = styled.p`
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(24px, 3vw, 40px);
  line-height: 1.18;
  letter-spacing: -0.015em;
  margin: 0;
  max-width: 30ch;
  color: ${INK};

  &::first-letter {
    color: ${ACCENT};
  }
`;

/* ---------- Sections ---------- */

const Block = styled.section`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 56px;
  padding: 56px 0;
  border-top: 1px solid rgba(17, 17, 17, 0.16);

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 40px 0;
  }
`;

const BlockHead = styled.div`
  position: relative;
`;

const Index = styled.div`
  font-family: 'Archivo Black', 'Archivo', sans-serif;
  font-size: 13px;
  letter-spacing: 0.1em;
  color: ${ACCENT};
  margin-bottom: 12px;
`;

const BlockTitle = styled.h2`
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 30px;
  line-height: 0.96;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  margin: 0;
  color: ${INK};
`;

const BlockBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  min-width: 0;
`;

/* ---------- Entries ---------- */

const Entry = styled.article`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const EntryTop = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 10px 16px;
`;

const EntryTitle = styled.h3`
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 21px;
  letter-spacing: -0.01em;
  margin: 0;
  color: ${INK};

  a {
    color: inherit;
    text-decoration: none;
    border-bottom: 2px solid ${ACCENT};
  }
`;

const EntryMeta = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${MUTE};
  font-variant-numeric: tabular-nums;
`;

const EntrySub = styled.div`
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: 17px;
  color: ${ACCENT};
`;

const EntryText = styled.p`
  margin: 6px 0 0;
  font-size: 14.5px;
  line-height: 1.62;
  color: #2a2722;
`;

const Bullets = styled.ul`
  list-style: none;
  margin: 10px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;

  li {
    position: relative;
    padding-left: 24px;
    font-size: 14px;
    line-height: 1.56;
    color: #2a2722;
  }
  li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 9px;
    width: 9px;
    height: 9px;
    background: ${ACCENT};
  }
`;

/* ---------- Skills / tags ---------- */

const TagWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 6px;
`;

const Tag = styled.span`
  font-size: 12.5px;
  letter-spacing: 0.02em;
  padding: 5px 12px;
  border: 1.5px solid ${INK};
  color: ${INK};
  background: transparent;
`;

const SkillGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SkillName = styled.div`
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

/* ---------- Simple rows ---------- */

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 26px;
`;

const InlineList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 26px;
`;

const Pair = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const PairKey = styled.span`
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: ${INK};
`;

const PairVal = styled.span`
  font-size: 13px;
  color: ${MUTE};
`;

const Colophon = styled.footer`
  margin-top: 88px;
  padding-top: 22px;
  border-top: 3px solid ${INK};
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: ${MUTE};
`;

/* ---------- helpers ---------- */

function pad(num) {
  return String(num).padStart(2, '0');
}

function locationString(loc) {
  if (!loc) return '';
  return [loc.city, loc.region, loc.countryCode].filter(Boolean).join(', ');
}

function Highlights({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <Bullets>
      {items.map((h, i) => (
        <li key={i}>{h}</li>
      ))}
    </Bullets>
  );
}

function SectionBlock({ index, title, children }) {
  return (
    <Block>
      <BlockHead>
        <Index>{`(${pad(index)})`}</Index>
        <BlockTitle>{title}</BlockTitle>
      </BlockHead>
      <BlockBody>{children}</BlockBody>
    </Block>
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

  const profiles = basics.profiles || [];
  const loc = locationString(basics.location);

  let counter = 0;
  const next = () => (counter += 1);

  return (
    <Page>
      <Frame>
        <Header>
          <div>
            <Kicker>Portfolio / Curriculum Vitae</Kicker>
            {basics.name && <Name>{basics.name}</Name>}
            {basics.label && <Label>{basics.label}</Label>}
          </div>
          {basics.image && (
            <Plate>
              <PlateImg src={safeUrl(basics.image)} alt={basics.name || ''} />
              <PlateCaption>Plate I — Self</PlateCaption>
            </Plate>
          )}
        </Header>

        <ContactBar>
          {basics.email && (
            <span>
              <ContactKey>Email</ContactKey>
              <a href={safeUrl(`mailto:${basics.email}`)}>{basics.email}</a>
            </span>
          )}
          {basics.phone && (
            <span>
              <ContactKey>Tel</ContactKey>
              <a href={safeUrl(`tel:${basics.phone}`)}>{basics.phone}</a>
            </span>
          )}
          {basics.url && (
            <span>
              <ContactKey>Web</ContactKey>
              <a href={safeUrl(basics.url)}>
                {basics.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>
            </span>
          )}
          {loc && (
            <span>
              <ContactKey>Locale</ContactKey>
              {loc}
            </span>
          )}
          {profiles.map((p, i) =>
            p.url ? (
              <span key={i}>
                <ContactKey>{p.network || 'Link'}</ContactKey>
                <a href={safeUrl(p.url)}>{p.username || p.network}</a>
              </span>
            ) : null
          )}
        </ContactBar>

        {basics.summary && (
          <Statement>
            <StatementMark>{'— Statement'}</StatementMark>
            <StatementText>{basics.summary}</StatementText>
          </Statement>
        )}

        {work.length > 0 && (
          <SectionBlock index={next()} title="Work">
            {work.map((job, i) => (
              <Entry key={i}>
                <EntryTop>
                  <EntryTitle>{job.position || job.name}</EntryTitle>
                  <EntryMeta>
                    <DateRange
                      startDate={job.startDate}
                      endDate={job.endDate}
                    />
                  </EntryMeta>
                </EntryTop>
                {job.name && job.position && <EntrySub>{job.name}</EntrySub>}
                {job.location && <EntryMeta>{job.location}</EntryMeta>}
                {job.summary && <EntryText>{job.summary}</EntryText>}
                <Highlights items={job.highlights} />
              </Entry>
            ))}
          </SectionBlock>
        )}

        {projects.length > 0 && (
          <SectionBlock index={next()} title="Works">
            {projects.map((proj, i) => (
              <Entry key={i}>
                <EntryTop>
                  <EntryTitle>
                    {proj.url ? (
                      <Link href={safeUrl(proj.url)}>{proj.name}</Link>
                    ) : (
                      proj.name
                    )}
                  </EntryTitle>
                  <EntryMeta>
                    <DateRange
                      startDate={proj.startDate}
                      endDate={proj.endDate}
                    />
                  </EntryMeta>
                </EntryTop>
                {proj.type && <EntrySub>{proj.type}</EntrySub>}
                {proj.description && <EntryText>{proj.description}</EntryText>}
                <Highlights items={proj.highlights} />
                {proj.keywords && proj.keywords.length > 0 && (
                  <TagWrap>
                    {proj.keywords.map((k, j) => (
                      <Tag key={j}>{k}</Tag>
                    ))}
                  </TagWrap>
                )}
              </Entry>
            ))}
          </SectionBlock>
        )}

        {education.length > 0 && (
          <SectionBlock index={next()} title="Study">
            {education.map((edu, i) => (
              <Entry key={i}>
                <EntryTop>
                  <EntryTitle>{edu.institution}</EntryTitle>
                  <EntryMeta>
                    <DateRange
                      startDate={edu.startDate}
                      endDate={edu.endDate}
                    />
                  </EntryMeta>
                </EntryTop>
                {(edu.studyType || edu.area) && (
                  <EntrySub>
                    {[edu.studyType, edu.area].filter(Boolean).join(', ')}
                  </EntrySub>
                )}
                {edu.score && <EntryText>Result: {edu.score}</EntryText>}
                {edu.courses && edu.courses.length > 0 && (
                  <Highlights items={edu.courses} />
                )}
              </Entry>
            ))}
          </SectionBlock>
        )}

        {skills.length > 0 && (
          <SectionBlock index={next()} title="Skills">
            {skills.map((skill, i) => (
              <SkillGroup key={i}>
                <SkillName>
                  {skill.name}
                  {skill.level ? ` — ${skill.level}` : ''}
                </SkillName>
                {skill.keywords && skill.keywords.length > 0 && (
                  <TagWrap>
                    {skill.keywords.map((k, j) => (
                      <Tag key={j}>{k}</Tag>
                    ))}
                  </TagWrap>
                )}
              </SkillGroup>
            ))}
          </SectionBlock>
        )}

        {awards.length > 0 && (
          <SectionBlock index={next()} title="Awards">
            <Rows>
              {awards.map((a, i) => (
                <Entry key={i}>
                  <EntryTop>
                    <EntryTitle>{a.title}</EntryTitle>
                    {a.date && <EntryMeta>{a.date}</EntryMeta>}
                  </EntryTop>
                  {a.awarder && <EntrySub>{a.awarder}</EntrySub>}
                  {a.summary && <EntryText>{a.summary}</EntryText>}
                </Entry>
              ))}
            </Rows>
          </SectionBlock>
        )}

        {certificates.length > 0 && (
          <SectionBlock index={next()} title="Certificates">
            <Rows>
              {certificates.map((c, i) => (
                <Entry key={i}>
                  <EntryTop>
                    <EntryTitle>
                      {c.url ? (
                        <Link href={safeUrl(c.url)}>{c.name}</Link>
                      ) : (
                        c.name
                      )}
                    </EntryTitle>
                    {c.date && <EntryMeta>{c.date}</EntryMeta>}
                  </EntryTop>
                  {c.issuer && <EntrySub>{c.issuer}</EntrySub>}
                </Entry>
              ))}
            </Rows>
          </SectionBlock>
        )}

        {publications.length > 0 && (
          <SectionBlock index={next()} title="Published">
            <Rows>
              {publications.map((p, i) => (
                <Entry key={i}>
                  <EntryTop>
                    <EntryTitle>
                      {p.url ? (
                        <Link href={safeUrl(p.url)}>{p.name}</Link>
                      ) : (
                        p.name
                      )}
                    </EntryTitle>
                    {p.releaseDate && <EntryMeta>{p.releaseDate}</EntryMeta>}
                  </EntryTop>
                  {p.publisher && <EntrySub>{p.publisher}</EntrySub>}
                  {p.summary && <EntryText>{p.summary}</EntryText>}
                </Entry>
              ))}
            </Rows>
          </SectionBlock>
        )}

        {volunteer.length > 0 && (
          <SectionBlock index={next()} title="Service">
            {volunteer.map((v, i) => (
              <Entry key={i}>
                <EntryTop>
                  <EntryTitle>{v.position || v.organization}</EntryTitle>
                  <EntryMeta>
                    <DateRange startDate={v.startDate} endDate={v.endDate} />
                  </EntryMeta>
                </EntryTop>
                {v.organization && v.position && (
                  <EntrySub>{v.organization}</EntrySub>
                )}
                {v.summary && <EntryText>{v.summary}</EntryText>}
                <Highlights items={v.highlights} />
              </Entry>
            ))}
          </SectionBlock>
        )}

        {languages.length > 0 && (
          <SectionBlock index={next()} title="Languages">
            <InlineList>
              {languages.map((l, i) => (
                <Pair key={i}>
                  <PairKey>{l.language}</PairKey>
                  {l.fluency && <PairVal>{l.fluency}</PairVal>}
                </Pair>
              ))}
            </InlineList>
          </SectionBlock>
        )}

        {interests.length > 0 && (
          <SectionBlock index={next()} title="Interests">
            <Rows>
              {interests.map((it, i) => (
                <Entry key={i}>
                  <EntryTitle>{it.name}</EntryTitle>
                  {it.keywords && it.keywords.length > 0 && (
                    <TagWrap>
                      {it.keywords.map((k, j) => (
                        <Tag key={j}>{k}</Tag>
                      ))}
                    </TagWrap>
                  )}
                </Entry>
              ))}
            </Rows>
          </SectionBlock>
        )}

        {references.length > 0 && (
          <SectionBlock index={next()} title="References">
            <Rows>
              {references.map((r, i) => (
                <Entry key={i}>
                  <EntryTitle>{r.name}</EntryTitle>
                  {r.reference && <EntryText>“{r.reference}”</EntryText>}
                </Entry>
              ))}
            </Rows>
          </SectionBlock>
        )}

        <Colophon>
          <span>{basics.name || 'Curriculum Vitae'}</span>
          <span>Art School Modern</span>
        </Colophon>
      </Frame>
    </Page>
  );
}

export default Resume;
