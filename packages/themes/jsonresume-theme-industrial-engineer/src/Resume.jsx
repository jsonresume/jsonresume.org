import React from 'react';
import styled from 'styled-components';
import { DateRange, safeUrl } from '@jsonresume/core';

/* ============================================================
   INDUSTRIAL ENGINEER — engineering-datasheet aesthetic.
   Drafting-blue + safety-orange. IBM Plex Mono technical labels,
   IBM Plex Sans body. Spec-table layouts, dimension-line rules,
   part-number section headers. ALL styled-components inline
   (separate styles.js breaks registry webpack default export).
   Never name a styled-component `Date` (shadows global → crash).
   ============================================================ */

const INK = '#16202b';
const BLUE = '#1b3a5b';
const BLUE_MID = '#2f5d8a';
const ORANGE = '#d6480b';
const PAPER = '#f4f6f8';
const PANEL = '#ffffff';
const GRID = '#d4dde4';
const MUTE = '#5d6b78';

const MONO = "'IBM Plex Mono', 'SFMono-Regular', Menlo, monospace";
const SANS = "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const Sheet = styled.div`
  max-width: 940px;
  margin: 0 auto;
  background: ${PAPER};
  color: ${INK};
  font-family: ${SANS};
  font-size: 13.5px;
  line-height: 1.55;
  padding: 40px;
  background-image: linear-gradient(${GRID} 1px, transparent 1px),
    linear-gradient(90deg, ${GRID} 1px, transparent 1px);
  background-size: 28px 28px;
  background-position: -1px -1px;

  @media print {
    background: #fff;
    padding: 0;
  }
`;

const Frame = styled.div`
  border: 2px solid ${BLUE};
  background: ${PANEL};
  position: relative;
`;

/* drafting corner ticks on the outer frame */
const CornerTick = styled.span`
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: ${ORANGE};
  border-style: solid;
  border-width: 0;
  &.tl {
    top: -2px;
    left: -2px;
    border-top-width: 3px;
    border-left-width: 3px;
  }
  &.tr {
    top: -2px;
    right: -2px;
    border-top-width: 3px;
    border-right-width: 3px;
  }
  &.bl {
    bottom: -2px;
    left: -2px;
    border-bottom-width: 3px;
    border-left-width: 3px;
  }
  &.br {
    bottom: -2px;
    right: -2px;
    border-bottom-width: 3px;
    border-right-width: 3px;
  }
`;

/* ---- title-block header, like a drawing's nameplate ---- */
const TitleBlock = styled.header`
  display: grid;
  grid-template-columns: ${(p) => (p.$hasImage ? '96px 1fr' : '1fr')};
  gap: 20px;
  align-items: stretch;
  border-bottom: 2px solid ${BLUE};
  background: ${BLUE};
  color: #eef4f9;
  padding: 22px 24px;
`;

const Portrait = styled.img`
  width: 96px;
  height: 96px;
  object-fit: cover;
  border: 2px solid ${ORANGE};
  filter: grayscale(0.35) contrast(1.05);
  background: #0e1c29;
`;

const TitleMain = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
`;

const DocTag = styled.div`
  font-family: ${MONO};
  font-size: 10.5px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #f2954f;
  margin-bottom: 8px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;

  span {
    position: relative;
    padding-left: 12px;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 5px;
      height: 5px;
      margin-top: -2.5px;
      background: ${ORANGE};
    }
  }
`;

const Name = styled.h1`
  font-family: ${MONO};
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0;
  line-height: 1.05;
  color: #ffffff;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #b9cee0;
  margin-top: 6px;
  letter-spacing: 0.3px;
`;

/* ---- spec table for contact: key | value rows ---- */
const SpecBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  border-bottom: 2px solid ${BLUE};
`;

const SpecCell = styled.div`
  padding: 8px 14px;
  border-right: 1px solid ${GRID};
  border-bottom: 1px solid ${GRID};
  &:last-child {
    border-right: none;
  }
`;

const SpecKey = styled.div`
  font-family: ${MONO};
  font-size: 9.5px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${MUTE};
`;

const SpecVal = styled.div`
  font-family: ${MONO};
  font-size: 12px;
  font-weight: 500;
  color: ${INK};
  word-break: break-word;
  a {
    color: ${BLUE_MID};
    text-decoration: none;
    &:hover {
      color: ${ORANGE};
    }
  }
`;

const Body = styled.div`
  padding: 26px 28px 30px;
`;

/* ---- part-number section headers ---- */
const Section = styled.section`
  margin-bottom: 26px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHead = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const PartNo = styled.span`
  font-family: ${MONO};
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  background: ${ORANGE};
  padding: 3px 8px;
  letter-spacing: 1px;
  flex: none;
`;

const SectionTitle = styled.h2`
  font-family: ${MONO};
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${BLUE};
  margin: 0;
  white-space: nowrap;
`;

/* dimension line: rule with end ticks */
const DimLine = styled.span`
  flex: 1;
  height: 0;
  border-top: 1px solid ${BLUE};
  position: relative;
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -4px;
    width: 1px;
    height: 9px;
    background: ${BLUE};
  }
  &::before {
    left: 0;
  }
  &::after {
    right: 0;
  }
`;

/* ---- experience / timeline entries as data records ---- */
const Record = styled.article`
  display: grid;
  grid-template-columns: 150px 1fr;
  border: 1px solid ${GRID};
  border-left: 3px solid ${BLUE_MID};
  margin-bottom: 12px;
  background: ${PANEL};
  &:last-child {
    margin-bottom: 0;
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const RecordMeta = styled.div`
  padding: 12px 14px;
  border-right: 1px solid ${GRID};
  background: ${PAPER};
  display: flex;
  flex-direction: column;
  gap: 6px;
  @media (max-width: 640px) {
    border-right: none;
    border-bottom: 1px solid ${GRID};
  }
`;

const MetaDate = styled.div`
  font-family: ${MONO};
  font-size: 11px;
  font-weight: 600;
  color: ${BLUE};
  font-variant-numeric: tabular-nums;
  span {
    color: ${BLUE} !important;
  }
`;

const MetaTag = styled.div`
  font-family: ${MONO};
  font-size: 9.5px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${MUTE};
`;

const RecordBody = styled.div`
  padding: 12px 16px;
  min-width: 0;
`;

const RoleTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  margin: 0;
  color: ${INK};
  a {
    color: ${INK};
    text-decoration: none;
    border-bottom: 1px dotted ${ORANGE};
    &:hover {
      color: ${ORANGE};
    }
  }
`;

const RoleOrg = styled.div`
  font-family: ${MONO};
  font-size: 12px;
  font-weight: 500;
  color: ${BLUE_MID};
  margin-top: 3px;
  letter-spacing: 0.3px;
`;

const Para = styled.p`
  font-size: 13px;
  color: #2c3845;
  margin: 8px 0 0 0;
`;

const Highlights = styled.ul`
  margin: 8px 0 0 0;
  padding: 0;
  list-style: none;
  li {
    position: relative;
    padding-left: 18px;
    margin-bottom: 5px;
    font-size: 12.5px;
    line-height: 1.5;
    &::before {
      content: '▸';
      position: absolute;
      left: 0;
      color: ${ORANGE};
      font-size: 11px;
      top: 1px;
    }
  }
`;

const SummaryBlock = styled.div`
  position: relative;
  margin: 0 0 26px 0;
  padding: 18px 16px 14px;
  border: 1px dashed ${BLUE_MID};
  background: ${PAPER};
`;

const SummaryLabel = styled.span`
  position: absolute;
  top: -8px;
  left: 12px;
  font-family: ${MONO};
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${BLUE};
  background: ${PANEL};
  padding: 0 6px;
`;

const SummaryText = styled.p`
  font-size: 13.5px;
  line-height: 1.6;
  color: #28333f;
  margin: 0;
`;

/* ---- skills as a spec matrix ---- */
const SkillMatrix = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 10px;
`;

const SkillCell = styled.div`
  border: 1px solid ${GRID};
  border-top: 3px solid ${BLUE};
  background: ${PANEL};
  padding: 10px 12px;
`;

const SkillName = styled.div`
  font-family: ${MONO};
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${BLUE};
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  span {
    font-size: 9.5px;
    color: ${MUTE};
    letter-spacing: 1px;
  }
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Chip = styled.span`
  font-family: ${MONO};
  font-size: 11px;
  padding: 2px 7px;
  border: 1px solid ${GRID};
  background: ${PAPER};
  color: #33414e;
  letter-spacing: 0.2px;
`;

/* ---- compact data cards for awards/certs/pubs/refs/interests ---- */
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 10px;
`;

const Card = styled.div`
  border: 1px solid ${GRID};
  border-left: 3px solid ${ORANGE};
  background: ${PANEL};
  padding: 11px 13px;
  h4 {
    font-size: 13.5px;
    font-weight: 700;
    margin: 0 0 3px 0;
    color: ${INK};
    a {
      color: ${INK};
      text-decoration: none;
      border-bottom: 1px dotted ${ORANGE};
      &:hover {
        color: ${ORANGE};
      }
    }
  }
  .src {
    font-family: ${MONO};
    font-size: 10.5px;
    letter-spacing: 0.5px;
    color: ${BLUE_MID};
  }
  p {
    font-size: 12.5px;
    color: #2c3845;
    margin: 6px 0 0 0;
  }
`;

/* ---- languages / interests as inline spec ---- */
const InlineList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const InlineItem = styled.span`
  font-family: ${MONO};
  font-size: 11.5px;
  border: 1px solid ${GRID};
  background: ${PANEL};
  padding: 5px 10px;
  color: #33414e;
  b {
    color: ${BLUE};
  }
  small {
    color: ${MUTE};
    font-size: 10px;
    margin-left: 4px;
  }
`;

const Footer = styled.div`
  border-top: 2px solid ${BLUE};
  padding: 8px 16px;
  font-family: ${MONO};
  font-size: 9.5px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${MUTE};
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
`;

function pad(n) {
  return String(n).padStart(2, '0');
}

function locationString(location) {
  if (!location) return '';
  return [location.city, location.region, location.countryCode]
    .filter(Boolean)
    .join(', ');
}

function SectionHeader({ no, title }) {
  return (
    <SectionHead>
      <PartNo>{no}</PartNo>
      <SectionTitle>{title}</SectionTitle>
      <DimLine aria-hidden="true" />
    </SectionHead>
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

  const loc = locationString(basics.location);

  const contactItems = [];
  if (basics.email)
    contactItems.push({
      k: 'E-MAIL',
      v: <a href={safeUrl(`mailto:${basics.email}`)}>{basics.email}</a>,
    });
  if (basics.phone)
    contactItems.push({
      k: 'PHONE',
      v: <a href={safeUrl(`tel:${basics.phone}`)}>{basics.phone}</a>,
    });
  if (loc) contactItems.push({ k: 'LOCATION', v: loc });
  if (basics.url)
    contactItems.push({
      k: 'WEB',
      v: (
        <a href={safeUrl(basics.url)} target="_blank" rel="noopener noreferrer">
          {basics.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </a>
      ),
    });
  (basics.profiles || []).forEach((p) => {
    if (!p) return;
    contactItems.push({
      k: p.network || 'PROFILE',
      v: p.url ? (
        <a href={safeUrl(p.url)} target="_blank" rel="noopener noreferrer">
          {p.username || p.network}
        </a>
      ) : (
        p.username || ''
      ),
    });
  });

  let part = 0;
  const next = () => pad(++part);

  return (
    <Sheet>
      <Frame>
        <CornerTick className="tl" />
        <CornerTick className="tr" />
        <CornerTick className="bl" />
        <CornerTick className="br" />

        <TitleBlock $hasImage={Boolean(basics.image)}>
          {basics.image && <Portrait src={basics.image} alt={basics.name} />}
          <TitleMain>
            <DocTag>
              <span>
                DOC-NO / {(basics.name || 'RESUME').slice(0, 3).toUpperCase()}
                -001
              </span>
              <span>REV / A</span>
              <span>SHEET 1 OF 1</span>
            </DocTag>
            {basics.name && <Name>{basics.name}</Name>}
            {basics.label && <Label>{basics.label}</Label>}
          </TitleMain>
        </TitleBlock>

        {contactItems.length > 0 && (
          <SpecBar>
            {contactItems.map((it, i) => (
              <SpecCell key={i}>
                <SpecKey>{it.k}</SpecKey>
                <SpecVal>{it.v}</SpecVal>
              </SpecCell>
            ))}
          </SpecBar>
        )}

        <Body>
          {basics.summary && (
            <SummaryBlock>
              <SummaryLabel>Notes — Profile</SummaryLabel>
              <SummaryText>{basics.summary}</SummaryText>
            </SummaryBlock>
          )}

          {work.length > 0 && (
            <Section>
              <SectionHeader no={next()} title="Experience" />
              {work.map((job, i) => (
                <Record key={i}>
                  <RecordMeta>
                    <MetaDate>
                      <DateRange
                        startDate={job.startDate}
                        endDate={job.endDate || null}
                      />
                    </MetaDate>
                    {job.location && <MetaTag>{job.location}</MetaTag>}
                  </RecordMeta>
                  <RecordBody>
                    <RoleTitle>
                      {job.url ? (
                        <a
                          href={safeUrl(job.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {job.position || job.name}
                        </a>
                      ) : (
                        job.position || job.name
                      )}
                    </RoleTitle>
                    {job.name && job.position && <RoleOrg>{job.name}</RoleOrg>}
                    {job.summary && <Para>{job.summary}</Para>}
                    {job.highlights && job.highlights.length > 0 && (
                      <Highlights>
                        {job.highlights.map((h, j) => (
                          <li key={j}>{h}</li>
                        ))}
                      </Highlights>
                    )}
                  </RecordBody>
                </Record>
              ))}
            </Section>
          )}

          {projects.length > 0 && (
            <Section>
              <SectionHeader no={next()} title="Projects" />
              {projects.map((proj, i) => (
                <Record key={i}>
                  <RecordMeta>
                    <MetaDate>
                      <DateRange
                        startDate={proj.startDate}
                        endDate={proj.endDate || null}
                      />
                    </MetaDate>
                    {proj.type && <MetaTag>{proj.type}</MetaTag>}
                  </RecordMeta>
                  <RecordBody>
                    <RoleTitle>
                      {proj.url ? (
                        <a
                          href={safeUrl(proj.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {proj.name}
                        </a>
                      ) : (
                        proj.name
                      )}
                    </RoleTitle>
                    {proj.entity && <RoleOrg>{proj.entity}</RoleOrg>}
                    {proj.description && <Para>{proj.description}</Para>}
                    {proj.highlights && proj.highlights.length > 0 && (
                      <Highlights>
                        {proj.highlights.map((h, j) => (
                          <li key={j}>{h}</li>
                        ))}
                      </Highlights>
                    )}
                  </RecordBody>
                </Record>
              ))}
            </Section>
          )}

          {education.length > 0 && (
            <Section>
              <SectionHeader no={next()} title="Education" />
              {education.map((edu, i) => (
                <Record key={i}>
                  <RecordMeta>
                    <MetaDate>
                      <DateRange
                        startDate={edu.startDate}
                        endDate={edu.endDate || null}
                      />
                    </MetaDate>
                    {edu.score && <MetaTag>GPA {edu.score}</MetaTag>}
                  </RecordMeta>
                  <RecordBody>
                    <RoleTitle>{edu.institution}</RoleTitle>
                    {(edu.studyType || edu.area) && (
                      <RoleOrg>
                        {[edu.studyType, edu.area].filter(Boolean).join(' — ')}
                      </RoleOrg>
                    )}
                    {edu.courses && edu.courses.length > 0 && (
                      <Highlights>
                        {edu.courses.map((c, j) => (
                          <li key={j}>{c}</li>
                        ))}
                      </Highlights>
                    )}
                  </RecordBody>
                </Record>
              ))}
            </Section>
          )}

          {skills.length > 0 && (
            <Section>
              <SectionHeader no={next()} title="Skills" />
              <SkillMatrix>
                {skills.map((skill, i) => (
                  <SkillCell key={i}>
                    <SkillName>
                      {skill.name}
                      {skill.level && <span>{skill.level}</span>}
                    </SkillName>
                    {skill.keywords && skill.keywords.length > 0 && (
                      <ChipRow>
                        {skill.keywords.map((kw, j) => (
                          <Chip key={j}>{kw}</Chip>
                        ))}
                      </ChipRow>
                    )}
                  </SkillCell>
                ))}
              </SkillMatrix>
            </Section>
          )}

          {volunteer.length > 0 && (
            <Section>
              <SectionHeader no={next()} title="Volunteer" />
              {volunteer.map((vol, i) => (
                <Record key={i}>
                  <RecordMeta>
                    <MetaDate>
                      <DateRange
                        startDate={vol.startDate}
                        endDate={vol.endDate || null}
                      />
                    </MetaDate>
                  </RecordMeta>
                  <RecordBody>
                    <RoleTitle>
                      {vol.url ? (
                        <a
                          href={safeUrl(vol.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {vol.position}
                        </a>
                      ) : (
                        vol.position
                      )}
                    </RoleTitle>
                    {vol.organization && <RoleOrg>{vol.organization}</RoleOrg>}
                    {vol.summary && <Para>{vol.summary}</Para>}
                    {vol.highlights && vol.highlights.length > 0 && (
                      <Highlights>
                        {vol.highlights.map((h, j) => (
                          <li key={j}>{h}</li>
                        ))}
                      </Highlights>
                    )}
                  </RecordBody>
                </Record>
              ))}
            </Section>
          )}

          {awards.length > 0 && (
            <Section>
              <SectionHeader no={next()} title="Awards" />
              <CardGrid>
                {awards.map((a, i) => (
                  <Card key={i}>
                    <h4>{a.title}</h4>
                    <div className="src">
                      {[a.awarder, a.date].filter(Boolean).join(' / ')}
                    </div>
                    {a.summary && <p>{a.summary}</p>}
                  </Card>
                ))}
              </CardGrid>
            </Section>
          )}

          {certificates.length > 0 && (
            <Section>
              <SectionHeader no={next()} title="Certificates" />
              <CardGrid>
                {certificates.map((c, i) => (
                  <Card key={i}>
                    <h4>
                      {c.url ? (
                        <a
                          href={safeUrl(c.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {c.name}
                        </a>
                      ) : (
                        c.name
                      )}
                    </h4>
                    <div className="src">
                      {[c.issuer, c.date].filter(Boolean).join(' / ')}
                    </div>
                  </Card>
                ))}
              </CardGrid>
            </Section>
          )}

          {publications.length > 0 && (
            <Section>
              <SectionHeader no={next()} title="Publications" />
              <CardGrid>
                {publications.map((p, i) => (
                  <Card key={i}>
                    <h4>
                      {p.url ? (
                        <a
                          href={safeUrl(p.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {p.name}
                        </a>
                      ) : (
                        p.name
                      )}
                    </h4>
                    <div className="src">
                      {[p.publisher, p.releaseDate].filter(Boolean).join(' / ')}
                    </div>
                    {p.summary && <p>{p.summary}</p>}
                  </Card>
                ))}
              </CardGrid>
            </Section>
          )}

          {languages.length > 0 && (
            <Section>
              <SectionHeader no={next()} title="Languages" />
              <InlineList>
                {languages.map((l, i) => (
                  <InlineItem key={i}>
                    <b>{l.language}</b>
                    {l.fluency && <small>{l.fluency}</small>}
                  </InlineItem>
                ))}
              </InlineList>
            </Section>
          )}

          {interests.length > 0 && (
            <Section>
              <SectionHeader no={next()} title="Interests" />
              <CardGrid>
                {interests.map((it, i) => (
                  <Card key={i}>
                    <h4>{it.name}</h4>
                    {it.keywords && it.keywords.length > 0 && (
                      <p>{it.keywords.join(', ')}</p>
                    )}
                  </Card>
                ))}
              </CardGrid>
            </Section>
          )}

          {references.length > 0 && (
            <Section>
              <SectionHeader no={next()} title="References" />
              <CardGrid>
                {references.map((r, i) => (
                  <Card key={i}>
                    <h4>{r.name}</h4>
                    {r.reference && <p>{r.reference}</p>}
                  </Card>
                ))}
              </CardGrid>
            </Section>
          )}
        </Body>

        <Footer>
          <span>
            {basics.name
              ? `${basics.name} // CURRICULUM VITAE`
              : 'CURRICULUM VITAE'}
          </span>
          <span>JSON-RESUME / INDUSTRIAL-ENGINEER</span>
        </Footer>
      </Frame>
    </Sheet>
  );
}

export default Resume;
