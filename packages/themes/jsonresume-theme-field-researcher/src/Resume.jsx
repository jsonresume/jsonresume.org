import React from 'react';
import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  DateRange,
  Badge,
  BadgeList,
  Link,
  safeUrl,
} from '@jsonresume/core';

/*
 * Field Researcher
 * ----------------
 * Concept: "academic meets exploratory" — a resume styled like a field
 * naturalist's research notebook / specimen log. Tinted paper, classic
 * serif body for narrative, a monospaced "field code" face for metadata
 * labels, and a calm teal-green accent. Each section is a numbered log
 * entry; each role sits in a left metadata margin (a coordinate-style
 * date tag) beside a serif narrative, divided by dotted field rules.
 *
 * Layout structure (built first):
 *   - Single tinted column, max 860px
 *   - Header: name + label, then a "field station" metadata strip
 *   - Sections: numbered log markers (01 / OBSERVATIONS) with teal index
 *   - Entries: 168px metadata margin | 1fr narrative, teal left keyline
 *   - Dividers: dotted field rules between entries
 */

const INK = '#1f2421';
const INK_SOFT = '#4a534d';
const INK_FAINT = '#6f7872';
const TEAL = '#0d9488';
const TEAL_DEEP = '#0b5f57';
const PAPER = '#fbfaf7';
const PAPER_TINT = '#f3f1ea';
const RULE = '#d8d6cc';

const Layout = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 72px 56px 80px;
  background: ${PAPER};
  color: ${INK};
  font-family: 'Spectral', Georgia, 'Times New Roman', serif;
  font-size: 16px;
  line-height: 1.62;
  -webkit-font-smoothing: antialiased;

  @media print {
    padding: 32px 28px;
    background: ${PAPER};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  @media (max-width: 720px) {
    padding: 40px 24px 48px;
  }
`;

/* ---------- Header ---------- */

const Header = styled.header`
  margin-bottom: 44px;
`;

const Eyebrow = styled.div`
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${TEAL_DEEP};
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '';
    width: 28px;
    height: 2px;
    background: ${TEAL};
  }
`;

const Name = styled.h1`
  font-family: 'Spectral', Georgia, serif;
  font-size: 46px;
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.4px;
  margin: 0 0 8px 0;
  color: ${INK};
`;

const Label = styled.div`
  font-size: 19px;
  font-style: italic;
  font-weight: 400;
  color: ${INK_SOFT};
  margin-bottom: 26px;
`;

/* Field-station metadata strip: mono-labelled coordinates */
const Station = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2px 28px;
  border-top: 1.5px solid ${INK};
  border-bottom: 1px solid ${RULE};
  padding: 14px 0;
`;

const StationCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px 0;
`;

const StationKey = styled.span`
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: ${INK_FAINT};
`;

const StationVal = styled.span`
  font-size: 14.5px;
  color: ${INK};

  a {
    color: ${TEAL_DEEP};
    text-decoration: none;
    border-bottom: 1px solid ${RULE};
  }

  a:hover {
    border-bottom-color: ${TEAL};
  }
`;

const Abstract = styled.p`
  margin: 26px 0 0 0;
  font-size: 16.5px;
  line-height: 1.68;
  color: ${INK_SOFT};
  max-width: 64ch;

  &::first-letter {
    color: ${TEAL_DEEP};
  }
`;

/* ---------- Section scaffolding ---------- */

const LogSection = styled(Section)`
  margin-bottom: 40px;
`;

const LogHeading = styled.div`
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 22px;
  padding-bottom: 8px;
  border-bottom: 1.5px solid ${INK};
`;

const LogIndex = styled.span`
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  color: ${TEAL};
  letter-spacing: 0.5px;
`;

const LogTitle = styled(SectionTitle)`
  font-family: 'IBM Plex Mono', monospace;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2.4px;
  text-transform: uppercase;
  color: ${INK};
  margin: 0;
`;

/* ---------- Entry (two-column field log row) ---------- */

const Entry = styled.div`
  display: grid;
  grid-template-columns: 168px 1fr;
  gap: 28px;
  padding: 0 0 26px 0;
  margin-bottom: 26px;
  border-bottom: 1px dotted ${RULE};

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 4px;
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const Margin = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 16px;
  border-left: 2px solid ${TEAL};

  @media (max-width: 720px) {
    border-left: none;
    padding-left: 0;
  }
`;

const DateTag = styled.div`
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12.5px;
  font-weight: 500;
  color: ${TEAL_DEEP};
  letter-spacing: 0.3px;

  .resume-date-range {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    white-space: normal;
  }
`;

const MarginMeta = styled.div`
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: ${INK_FAINT};
  line-height: 1.5;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const EntryTitle = styled.h3`
  font-family: 'Spectral', Georgia, serif;
  font-size: 21px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  color: ${INK};

  a {
    color: inherit;
    text-decoration: none;
    border-bottom: 1px solid ${TEAL};
    padding-bottom: 1px;
  }

  a:hover {
    border-bottom-width: 2px;
  }
`;

const EntrySubtitle = styled.div`
  font-size: 16px;
  font-style: italic;
  color: ${TEAL_DEEP};
  margin-top: 1px;
`;

const EntryText = styled.p`
  margin: 8px 0 0 0;
  font-size: 15.5px;
  line-height: 1.66;
  color: ${INK_SOFT};
`;

const Findings = styled.ul`
  margin: 12px 0 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 7px;

  li {
    position: relative;
    padding-left: 22px;
    font-size: 15.5px;
    line-height: 1.58;
    color: ${INK};

    &::before {
      content: '';
      position: absolute;
      left: 2px;
      top: 0.62em;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      border: 1.5px solid ${TEAL};
      background: ${PAPER};
    }
  }
`;

const Keywords = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
`;

const Tag = styled.span`
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.4px;
  color: ${TEAL_DEEP};
  padding: 2px 9px;
  border: 1px solid ${RULE};
  border-radius: 2px;
  background: ${PAPER_TINT};
`;

/* ---------- Specimen cards (skills / interests) ---------- */

const SpecimenGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(238px, 1fr));
  gap: 18px;
`;

const Specimen = styled.div`
  padding: 16px 18px 18px;
  background: ${PAPER_TINT};
  border: 1px solid ${RULE};
  border-top: 3px solid ${TEAL};
`;

const SpecimenName = styled.h4`
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: ${INK};
  margin: 0 0 12px 0;
`;

const StyledBadgeList = styled(BadgeList)`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

const StyledBadge = styled(Badge)`
  font-family: 'Spectral', Georgia, serif;
  font-size: 14px;
  padding: 3px 10px;
  background: ${PAPER};
  border: 1px solid ${RULE};
  border-radius: 2px;
  color: ${INK};
`;

/* ---------- Ledger (awards / certs / publications / references) ---------- */

const Ledger = styled.div`
  display: flex;
  flex-direction: column;
`;

const LedgerRow = styled.div`
  display: grid;
  grid-template-columns: 168px 1fr;
  gap: 28px;
  padding: 14px 0;
  border-bottom: 1px dotted ${RULE};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`;

const LedgerMeta = styled.div`
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.5px;
  color: ${INK_FAINT};
  padding-left: 16px;
  border-left: 2px solid ${RULE};

  @media (max-width: 720px) {
    border-left: none;
    padding-left: 0;
  }
`;

const LedgerTitle = styled.h4`
  font-family: 'Spectral', Georgia, serif;
  font-size: 17px;
  font-weight: 600;
  margin: 0;
  color: ${INK};

  a {
    color: inherit;
    text-decoration: none;
    border-bottom: 1px solid ${TEAL};
  }
`;

const LedgerText = styled.p`
  margin: 5px 0 0 0;
  font-size: 15px;
  line-height: 1.6;
  color: ${INK_SOFT};
`;

const LangGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
`;

const LangItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${RULE};

  .lang {
    font-family: 'Spectral', Georgia, serif;
    font-size: 16px;
    font-weight: 600;
    color: ${INK};
  }

  .fluency {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: ${INK_FAINT};
  }
`;

const Coda = styled.div`
  margin-top: 56px;
  padding-top: 16px;
  border-top: 1.5px solid ${INK};
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${INK_FAINT};
  display: flex;
  justify-content: space-between;
  gap: 16px;
`;

/* ---------- helpers ---------- */

function locationString(location) {
  if (!location) return null;
  return (
    [location.city, location.region, location.countryCode]
      .filter(Boolean)
      .join(', ') || null
  );
}

function pad(n) {
  return String(n).padStart(2, '0');
}

// JSON Resume convention: a start date with no end date means "ongoing".
// DateRange treats `null` as Present but `undefined` as a single date,
// so coerce a missing end into null whenever a start exists.
function endOf(item = {}) {
  if (!item.startDate) return undefined;
  return item.endDate == null ? null : item.endDate;
}

function Resume({ resume = {} }) {
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

  const headerLocation = locationString(basics.location);

  // Build ordered list of present sections so log indices stay sequential.
  let sectionIndex = 0;
  const nextIndex = () => pad(++sectionIndex);

  return (
    <Layout>
      <Header>
        <Eyebrow>Field Record</Eyebrow>
        {basics.name && <Name>{basics.name}</Name>}
        {basics.label && <Label>{basics.label}</Label>}

        <Station>
          {headerLocation && (
            <StationCell>
              <StationKey>Station</StationKey>
              <StationVal>{headerLocation}</StationVal>
            </StationCell>
          )}
          {basics.email && (
            <StationCell>
              <StationKey>Correspondence</StationKey>
              <StationVal>
                <a href={safeUrl(`mailto:${basics.email}`)}>{basics.email}</a>
              </StationVal>
            </StationCell>
          )}
          {basics.phone && (
            <StationCell>
              <StationKey>Signal</StationKey>
              <StationVal>{basics.phone}</StationVal>
            </StationCell>
          )}
          {basics.url && (
            <StationCell>
              <StationKey>Log</StationKey>
              <StationVal>
                <a
                  href={safeUrl(basics.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {basics.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              </StationVal>
            </StationCell>
          )}
          {(basics.profiles || []).map((p, i) =>
            p.url ? (
              <StationCell key={`profile-${i}`}>
                <StationKey>{p.network || 'Profile'}</StationKey>
                <StationVal>
                  <a
                    href={safeUrl(p.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {p.username ||
                      p.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </a>
                </StationVal>
              </StationCell>
            ) : null
          )}
        </Station>

        {basics.summary && <Abstract>{basics.summary}</Abstract>}
      </Header>

      {work.length > 0 && (
        <LogSection>
          <LogHeading>
            <LogIndex>{nextIndex()}</LogIndex>
            <LogTitle>Field Observations</LogTitle>
          </LogHeading>
          {work.map((job, index) => (
            <Entry key={index}>
              <Margin>
                <DateTag>
                  <DateRange startDate={job.startDate} endDate={endOf(job)} />
                </DateTag>
                {job.location && <MarginMeta>{job.location}</MarginMeta>}
              </Margin>
              <Body>
                <EntryTitle>
                  {job.url ? (
                    <Link href={safeUrl(job.url)}>
                      {job.position || job.name}
                    </Link>
                  ) : (
                    job.position || job.name
                  )}
                </EntryTitle>
                {job.position && job.name && (
                  <EntrySubtitle>{job.name}</EntrySubtitle>
                )}
                {job.summary && <EntryText>{job.summary}</EntryText>}
                {job.highlights && job.highlights.length > 0 && (
                  <Findings>
                    {job.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </Findings>
                )}
              </Body>
            </Entry>
          ))}
        </LogSection>
      )}

      {projects.length > 0 && (
        <LogSection>
          <LogHeading>
            <LogIndex>{nextIndex()}</LogIndex>
            <LogTitle>Field Studies</LogTitle>
          </LogHeading>
          {projects.map((project, index) => (
            <Entry key={index}>
              <Margin>
                <DateTag>
                  <DateRange
                    startDate={project.startDate}
                    endDate={endOf(project)}
                  />
                </DateTag>
                {project.type && <MarginMeta>{project.type}</MarginMeta>}
              </Margin>
              <Body>
                <EntryTitle>
                  {project.url ? (
                    <Link href={safeUrl(project.url)}>{project.name}</Link>
                  ) : (
                    project.name
                  )}
                </EntryTitle>
                {project.description && (
                  <EntryText>{project.description}</EntryText>
                )}
                {project.highlights && project.highlights.length > 0 && (
                  <Findings>
                    {project.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </Findings>
                )}
                {project.keywords && project.keywords.length > 0 && (
                  <Keywords>
                    {project.keywords.map((k, i) => (
                      <Tag key={i}>{k}</Tag>
                    ))}
                  </Keywords>
                )}
              </Body>
            </Entry>
          ))}
        </LogSection>
      )}

      {education.length > 0 && (
        <LogSection>
          <LogHeading>
            <LogIndex>{nextIndex()}</LogIndex>
            <LogTitle>Training &amp; Education</LogTitle>
          </LogHeading>
          {education.map((edu, index) => (
            <Entry key={index}>
              <Margin>
                <DateTag>
                  <DateRange startDate={edu.startDate} endDate={endOf(edu)} />
                </DateTag>
                {edu.score && <MarginMeta>GPA {edu.score}</MarginMeta>}
              </Margin>
              <Body>
                <EntryTitle>
                  {edu.url ? (
                    <Link href={safeUrl(edu.url)}>{edu.institution}</Link>
                  ) : (
                    edu.institution
                  )}
                </EntryTitle>
                {(edu.studyType || edu.area) && (
                  <EntrySubtitle>
                    {[edu.studyType, edu.area].filter(Boolean).join(', ')}
                  </EntrySubtitle>
                )}
                {edu.courses && edu.courses.length > 0 && (
                  <Findings>
                    {edu.courses.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </Findings>
                )}
              </Body>
            </Entry>
          ))}
        </LogSection>
      )}

      {volunteer.length > 0 && (
        <LogSection>
          <LogHeading>
            <LogIndex>{nextIndex()}</LogIndex>
            <LogTitle>Field Service</LogTitle>
          </LogHeading>
          {volunteer.map((vol, index) => (
            <Entry key={index}>
              <Margin>
                <DateTag>
                  <DateRange startDate={vol.startDate} endDate={endOf(vol)} />
                </DateTag>
              </Margin>
              <Body>
                <EntryTitle>
                  {vol.url ? (
                    <Link href={safeUrl(vol.url)}>
                      {vol.position || vol.organization}
                    </Link>
                  ) : (
                    vol.position || vol.organization
                  )}
                </EntryTitle>
                {vol.position && vol.organization && (
                  <EntrySubtitle>{vol.organization}</EntrySubtitle>
                )}
                {vol.summary && <EntryText>{vol.summary}</EntryText>}
                {vol.highlights && vol.highlights.length > 0 && (
                  <Findings>
                    {vol.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </Findings>
                )}
              </Body>
            </Entry>
          ))}
        </LogSection>
      )}

      {skills.length > 0 && (
        <LogSection>
          <LogHeading>
            <LogIndex>{nextIndex()}</LogIndex>
            <LogTitle>Instruments &amp; Methods</LogTitle>
          </LogHeading>
          <SpecimenGrid>
            {skills.map((skill, index) => (
              <Specimen key={index}>
                <SpecimenName>
                  {skill.name}
                  {skill.level ? ` · ${skill.level}` : ''}
                </SpecimenName>
                {skill.keywords && skill.keywords.length > 0 && (
                  <StyledBadgeList>
                    {skill.keywords.map((k, i) => (
                      <StyledBadge key={i}>{k}</StyledBadge>
                    ))}
                  </StyledBadgeList>
                )}
              </Specimen>
            ))}
          </SpecimenGrid>
        </LogSection>
      )}

      {publications.length > 0 && (
        <LogSection>
          <LogHeading>
            <LogIndex>{nextIndex()}</LogIndex>
            <LogTitle>Publications</LogTitle>
          </LogHeading>
          <Ledger>
            {publications.map((pub, index) => (
              <LedgerRow key={index}>
                <LedgerMeta>
                  {[pub.publisher, pub.releaseDate].filter(Boolean).join(' · ')}
                </LedgerMeta>
                <div>
                  <LedgerTitle>
                    {pub.url ? (
                      <Link href={safeUrl(pub.url)}>{pub.name}</Link>
                    ) : (
                      pub.name
                    )}
                  </LedgerTitle>
                  {pub.summary && <LedgerText>{pub.summary}</LedgerText>}
                </div>
              </LedgerRow>
            ))}
          </Ledger>
        </LogSection>
      )}

      {awards.length > 0 && (
        <LogSection>
          <LogHeading>
            <LogIndex>{nextIndex()}</LogIndex>
            <LogTitle>Distinctions</LogTitle>
          </LogHeading>
          <Ledger>
            {awards.map((award, index) => (
              <LedgerRow key={index}>
                <LedgerMeta>{award.date}</LedgerMeta>
                <div>
                  <LedgerTitle>{award.title}</LedgerTitle>
                  {award.awarder && (
                    <LedgerText>
                      {award.awarder}
                      {award.summary ? ` — ${award.summary}` : ''}
                    </LedgerText>
                  )}
                </div>
              </LedgerRow>
            ))}
          </Ledger>
        </LogSection>
      )}

      {certificates.length > 0 && (
        <LogSection>
          <LogHeading>
            <LogIndex>{nextIndex()}</LogIndex>
            <LogTitle>Certifications</LogTitle>
          </LogHeading>
          <Ledger>
            {certificates.map((cert, index) => (
              <LedgerRow key={index}>
                <LedgerMeta>{cert.date}</LedgerMeta>
                <div>
                  <LedgerTitle>
                    {cert.url ? (
                      <Link href={safeUrl(cert.url)}>{cert.name}</Link>
                    ) : (
                      cert.name
                    )}
                  </LedgerTitle>
                  {cert.issuer && <LedgerText>{cert.issuer}</LedgerText>}
                </div>
              </LedgerRow>
            ))}
          </Ledger>
        </LogSection>
      )}

      {languages.length > 0 && (
        <LogSection>
          <LogHeading>
            <LogIndex>{nextIndex()}</LogIndex>
            <LogTitle>Languages</LogTitle>
          </LogHeading>
          <LangGrid>
            {languages.map((lang, index) => (
              <LangItem key={index}>
                <span className="lang">{lang.language}</span>
                {lang.fluency && (
                  <span className="fluency">{lang.fluency}</span>
                )}
              </LangItem>
            ))}
          </LangGrid>
        </LogSection>
      )}

      {interests.length > 0 && (
        <LogSection>
          <LogHeading>
            <LogIndex>{nextIndex()}</LogIndex>
            <LogTitle>Field Interests</LogTitle>
          </LogHeading>
          <SpecimenGrid>
            {interests.map((interest, index) => (
              <Specimen key={index}>
                <SpecimenName>{interest.name}</SpecimenName>
                {interest.keywords && interest.keywords.length > 0 && (
                  <StyledBadgeList>
                    {interest.keywords.map((k, i) => (
                      <StyledBadge key={i}>{k}</StyledBadge>
                    ))}
                  </StyledBadgeList>
                )}
              </Specimen>
            ))}
          </SpecimenGrid>
        </LogSection>
      )}

      {references.length > 0 && (
        <LogSection>
          <LogHeading>
            <LogIndex>{nextIndex()}</LogIndex>
            <LogTitle>Field Correspondents</LogTitle>
          </LogHeading>
          <Ledger>
            {references.map((ref, index) => (
              <LedgerRow key={index}>
                <LedgerMeta>Ref. {pad(index + 1)}</LedgerMeta>
                <div>
                  <LedgerTitle>{ref.name}</LedgerTitle>
                  {ref.reference && <LedgerText>“{ref.reference}”</LedgerText>}
                </div>
              </LedgerRow>
            ))}
          </Ledger>
        </LogSection>
      )}

      <Coda>
        <span>End of Record</span>
        {basics.name && <span>{basics.name}</span>}
      </Coda>
    </Layout>
  );
}

export default Resume;
