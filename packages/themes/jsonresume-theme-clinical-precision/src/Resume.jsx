import React from 'react';
import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  DateRange,
  Badge,
  BadgeList,
  ContactInfo,
  Link,
  safeUrl,
} from '@jsonresume/core';

/*
 * CLINICAL PRECISION
 * Vibe: clean, clinical, calm — a medical chart record.
 * Layout: single column. Each entry is a "chart row": a green-railed
 *   left vital column (monospaced date code + location) and a content
 *   column on the right. Section titles carry a monospace "chart code".
 * Type:  IBM Plex Sans body, IBM Plex Mono for codes/metadata.
 * Color: clinical green #059669, deep ink #0f2a25, mint tints, gray meta.
 */

const GREEN = '#059669';
const GREEN_DARK = '#047857';
const INK = '#0f2a25';
const BODY = '#26433d';
const META = '#5b746e';
const MINT = '#f0fdf9';
const MINT_LINE = '#cdeee2';
const HAIR = '#dfeae6';

const Layout = styled.div`
  max-width: 840px;
  margin: 0 auto;
  padding: 56px 52px 72px;
  background: #ffffff;
  font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  color: ${BODY};
  font-size: 14.5px;
  line-height: 1.6;

  @media print {
    padding: 32px 28px;
  }
`;

/* ---- header: the chart band ---- */
const Header = styled.header`
  margin-bottom: 38px;
`;

const ChartRule = styled.div`
  height: 6px;
  background: ${GREEN};
  border-radius: 3px;
  margin-bottom: 18px;
`;

const ChartTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
`;

const Name = styled.h1`
  font-size: 38px;
  font-weight: 700;
  letter-spacing: -0.6px;
  margin: 0;
  color: ${INK};
`;

const RecordCode = styled.div`
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.5px;
  color: ${META};
  text-align: right;
  white-space: nowrap;

  b {
    display: block;
    color: ${GREEN_DARK};
    font-weight: 600;
  }
`;

const Label = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: ${GREEN_DARK};
  margin: 8px 0 0;
  letter-spacing: 0.2px;
`;

const VitalsStrip = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 16px;
  margin-top: 18px;
  padding: 11px 16px;
  background: ${MINT};
  border: 1px solid ${MINT_LINE};
  border-radius: 6px;
`;

const VitalsLabel = styled.span`
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.4px;
  color: ${GREEN_DARK};
  border-right: 1px solid ${MINT_LINE};
  padding-right: 14px;
`;

const StyledContactInfo = styled(ContactInfo)`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 6px 22px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12.5px;
  color: ${BODY};

  a {
    color: ${BODY};
    text-decoration: none;
  }

  a:hover {
    color: ${GREEN_DARK};
    text-decoration: underline;
  }
`;

const ChartNote = styled.div`
  margin-top: 22px;
  padding: 16px 20px 16px 18px;
  background: ${MINT};
  border-left: 4px solid ${GREEN};
  border-radius: 0 6px 6px 0;

  span {
    display: block;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10.5px;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    color: ${GREEN_DARK};
    margin-bottom: 6px;
  }

  p {
    margin: 0;
    font-size: 15px;
    line-height: 1.65;
    color: ${INK};
  }
`;

/* ---- sections ---- */
const StyledSection = styled(Section)`
  margin-bottom: 34px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  border-bottom: 1.5px solid ${GREEN};
  padding-bottom: 8px;
`;

const SectionCode = styled.span`
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
  background: ${GREEN};
  padding: 2px 7px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  flex-shrink: 0;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${INK};
  margin: 0;
  padding-bottom: 0;
  border-bottom: none;
`;

/* ---- chart rows ---- */
const ChartRow = styled.div`
  display: grid;
  grid-template-columns: 158px 1fr;
  gap: 22px;
  padding: 14px 0 16px;
  border-bottom: 1px solid ${HAIR};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const VitalRail = styled.div`
  border-left: 3px solid ${GREEN};
  padding-left: 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;

  @media (max-width: 720px) {
    border-left: none;
    padding-left: 0;
    border-top: 2px solid ${MINT_LINE};
    padding-top: 8px;
  }
`;

const RailDate = styled.div`
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  color: ${GREEN_DARK};
  font-variant-numeric: tabular-nums;
`;

const RailMeta = styled.div`
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${META};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemTitle = styled.h3`
  font-size: 17px;
  font-weight: 700;
  margin: 0;
  color: ${INK};

  a {
    color: ${INK};
    text-decoration: none;
    border-bottom: 1.5px solid ${MINT_LINE};
  }
  a:hover {
    border-color: ${GREEN};
  }
`;

const ItemSub = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${GREEN_DARK};
`;

const ItemDesc = styled.p`
  margin: 6px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: ${BODY};
`;

const Highlights = styled.ul`
  margin: 8px 0 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    padding-left: 20px;
    margin-bottom: 6px;
    font-size: 14px;
    line-height: 1.55;
    color: ${BODY};

    &::before {
      content: '+';
      position: absolute;
      left: 2px;
      top: -1px;
      color: ${GREEN};
      font-weight: 700;
      font-family: 'IBM Plex Mono', monospace;
    }
  }
`;

/* ---- skills: lab-panel cards ---- */
const PanelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
`;

const Panel = styled.div`
  border: 1px solid ${MINT_LINE};
  border-radius: 6px;
  overflow: hidden;
  background: #ffffff;
`;

const PanelHead = styled.div`
  background: ${MINT};
  border-bottom: 1px solid ${MINT_LINE};
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${GREEN_DARK};

  small {
    float: right;
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 500;
    letter-spacing: 0.3px;
    text-transform: none;
    color: ${META};
  }
`;

const PanelBody = styled.div`
  padding: 10px 12px 12px;
`;

const StyledBadgeList = styled(BadgeList)`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const StyledBadge = styled(Badge)`
  font-size: 12px;
  padding: 2px 9px;
  border-radius: 3px;
  background: ${MINT};
  border: 1px solid ${MINT_LINE};
  color: ${BODY};
  font-weight: 500;
`;

/* ---- simple records ---- */
const RecordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RecordItem = styled.div`
  padding: 12px 16px;
  border: 1px solid ${HAIR};
  border-left: 3px solid ${GREEN};
  border-radius: 0 6px 6px 0;

  h4 {
    margin: 0 0 3px;
    font-size: 15px;
    font-weight: 700;
    color: ${INK};

    a {
      color: ${INK};
      text-decoration: none;
      border-bottom: 1.5px solid ${MINT_LINE};
    }
    a:hover {
      border-color: ${GREEN};
    }
  }

  .meta {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11.5px;
    color: ${META};
    margin: 0 0 4px;
  }

  p {
    margin: 4px 0 0;
    font-size: 14px;
    color: ${BODY};
    line-height: 1.55;
  }
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

function recordCode(name) {
  const initials = (name || 'Resume')
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);
  let hash = 0;
  for (let i = 0; i < (name || '').length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 100000;
  }
  return `${initials}-${String(hash).padStart(5, '0')}`;
}

function Resume({ resume }) {
  const {
    basics = {},
    work = [],
    education = [],
    skills = [],
    projects = [],
    volunteer = [],
    awards = [],
    certificates = [],
    publications = [],
    languages = [],
    interests = [],
    references = [],
  } = resume;

  let code = 0;
  const nextCode = () => String((code += 1)).padStart(2, '0');

  return (
    <Layout>
      <Header>
        <ChartRule />
        <ChartTop>
          <div>{basics.name && <Name>{basics.name}</Name>}</div>
          <RecordCode>
            RECORD
            <b>{recordCode(basics.name)}</b>
            STATUS: ACTIVE
          </RecordCode>
        </ChartTop>
        {basics.label && <Label>{basics.label}</Label>}
        <VitalsStrip>
          <VitalsLabel>VITALS</VitalsLabel>
          <StyledContactInfo basics={basics} separator="·" />
        </VitalsStrip>
        {basics.summary && (
          <ChartNote>
            <span>Chart Note · Summary</span>
            <p>{basics.summary}</p>
          </ChartNote>
        )}
      </Header>

      {work.length > 0 && (
        <StyledSection>
          <TitleRow>
            <SectionCode>§{nextCode()}</SectionCode>
            <StyledSectionTitle>
              Clinical History · Experience
            </StyledSectionTitle>
          </TitleRow>
          {work.map((job, i) => (
            <ChartRow key={i}>
              <VitalRail>
                <RailDate>
                  <DateRange startDate={job.startDate} endDate={job.endDate} />
                </RailDate>
                {job.location && <RailMeta>{job.location}</RailMeta>}
              </VitalRail>
              <Content>
                <ItemTitle>
                  {job.url ? (
                    <Link href={safeUrl(job.url)}>
                      {job.position || job.name}
                    </Link>
                  ) : (
                    job.position || job.name
                  )}
                </ItemTitle>
                {job.name && job.position && <ItemSub>{job.name}</ItemSub>}
                {job.summary && <ItemDesc>{job.summary}</ItemDesc>}
                {job.highlights?.length > 0 && (
                  <Highlights>
                    {job.highlights.map((h, j) => (
                      <li key={j}>{h}</li>
                    ))}
                  </Highlights>
                )}
              </Content>
            </ChartRow>
          ))}
        </StyledSection>
      )}

      {education.length > 0 && (
        <StyledSection>
          <TitleRow>
            <SectionCode>§{nextCode()}</SectionCode>
            <StyledSectionTitle>Education</StyledSectionTitle>
          </TitleRow>
          {education.map((edu, i) => (
            <ChartRow key={i}>
              <VitalRail>
                <RailDate>
                  <DateRange startDate={edu.startDate} endDate={edu.endDate} />
                </RailDate>
                {edu.score && <RailMeta>GPA {edu.score}</RailMeta>}
              </VitalRail>
              <Content>
                <ItemTitle>{edu.institution}</ItemTitle>
                {(edu.studyType || edu.area) && (
                  <ItemSub>
                    {[edu.studyType, edu.area].filter(Boolean).join(' · ')}
                  </ItemSub>
                )}
                {edu.courses?.length > 0 && (
                  <Highlights>
                    {edu.courses.map((c, j) => (
                      <li key={j}>{c}</li>
                    ))}
                  </Highlights>
                )}
              </Content>
            </ChartRow>
          ))}
        </StyledSection>
      )}

      {skills.length > 0 && (
        <StyledSection>
          <TitleRow>
            <SectionCode>§{nextCode()}</SectionCode>
            <StyledSectionTitle>Diagnostic Panel · Skills</StyledSectionTitle>
          </TitleRow>
          <PanelGrid>
            {skills.map((skill, i) => (
              <Panel key={i}>
                <PanelHead>
                  {skill.name}
                  {skill.level && <small>{skill.level}</small>}
                </PanelHead>
                <PanelBody>
                  {skill.keywords?.length > 0 && (
                    <StyledBadgeList>
                      {skill.keywords.map((k, j) => (
                        <StyledBadge key={j}>{k}</StyledBadge>
                      ))}
                    </StyledBadgeList>
                  )}
                </PanelBody>
              </Panel>
            ))}
          </PanelGrid>
        </StyledSection>
      )}

      {projects.length > 0 && (
        <StyledSection>
          <TitleRow>
            <SectionCode>§{nextCode()}</SectionCode>
            <StyledSectionTitle>Procedures · Projects</StyledSectionTitle>
          </TitleRow>
          {projects.map((p, i) => (
            <ChartRow key={i}>
              <VitalRail>
                <RailDate>
                  <DateRange startDate={p.startDate} endDate={p.endDate} />
                </RailDate>
                {p.type && <RailMeta>{p.type}</RailMeta>}
              </VitalRail>
              <Content>
                <ItemTitle>
                  {p.url ? <Link href={safeUrl(p.url)}>{p.name}</Link> : p.name}
                </ItemTitle>
                {p.description && <ItemDesc>{p.description}</ItemDesc>}
                {p.highlights?.length > 0 && (
                  <Highlights>
                    {p.highlights.map((h, j) => (
                      <li key={j}>{h}</li>
                    ))}
                  </Highlights>
                )}
              </Content>
            </ChartRow>
          ))}
        </StyledSection>
      )}

      {volunteer.length > 0 && (
        <StyledSection>
          <TitleRow>
            <SectionCode>§{nextCode()}</SectionCode>
            <StyledSectionTitle>Community Care · Volunteer</StyledSectionTitle>
          </TitleRow>
          {volunteer.map((v, i) => (
            <ChartRow key={i}>
              <VitalRail>
                <RailDate>
                  <DateRange startDate={v.startDate} endDate={v.endDate} />
                </RailDate>
              </VitalRail>
              <Content>
                <ItemTitle>{v.position}</ItemTitle>
                {v.organization && <ItemSub>{v.organization}</ItemSub>}
                {v.summary && <ItemDesc>{v.summary}</ItemDesc>}
                {v.highlights?.length > 0 && (
                  <Highlights>
                    {v.highlights.map((h, j) => (
                      <li key={j}>{h}</li>
                    ))}
                  </Highlights>
                )}
              </Content>
            </ChartRow>
          ))}
        </StyledSection>
      )}

      {awards.length > 0 && (
        <StyledSection>
          <TitleRow>
            <SectionCode>§{nextCode()}</SectionCode>
            <StyledSectionTitle>Awards</StyledSectionTitle>
          </TitleRow>
          <RecordList>
            {awards.map((a, i) => (
              <RecordItem key={i}>
                <h4>{a.title}</h4>
                <p className="meta">
                  {[a.awarder, a.date].filter(Boolean).join(' · ')}
                </p>
                {a.summary && <p>{a.summary}</p>}
              </RecordItem>
            ))}
          </RecordList>
        </StyledSection>
      )}

      {certificates.length > 0 && (
        <StyledSection>
          <TitleRow>
            <SectionCode>§{nextCode()}</SectionCode>
            <StyledSectionTitle>Certificates</StyledSectionTitle>
          </TitleRow>
          <RecordList>
            {certificates.map((c, i) => (
              <RecordItem key={i}>
                <h4>
                  {c.url ? <Link href={safeUrl(c.url)}>{c.name}</Link> : c.name}
                </h4>
                <p className="meta">
                  {[c.issuer, c.date].filter(Boolean).join(' · ')}
                </p>
              </RecordItem>
            ))}
          </RecordList>
        </StyledSection>
      )}

      {publications.length > 0 && (
        <StyledSection>
          <TitleRow>
            <SectionCode>§{nextCode()}</SectionCode>
            <StyledSectionTitle>Publications</StyledSectionTitle>
          </TitleRow>
          <RecordList>
            {publications.map((pub, i) => (
              <RecordItem key={i}>
                <h4>
                  {pub.url ? (
                    <Link href={safeUrl(pub.url)}>{pub.name}</Link>
                  ) : (
                    pub.name
                  )}
                </h4>
                <p className="meta">
                  {[pub.publisher, pub.releaseDate].filter(Boolean).join(' · ')}
                </p>
                {pub.summary && <p>{pub.summary}</p>}
              </RecordItem>
            ))}
          </RecordList>
        </StyledSection>
      )}

      {languages.length > 0 && (
        <StyledSection>
          <TitleRow>
            <SectionCode>§{nextCode()}</SectionCode>
            <StyledSectionTitle>Languages</StyledSectionTitle>
          </TitleRow>
          <StyledBadgeList>
            {languages.map((l, i) => (
              <StyledBadge key={i}>
                {l.language}
                {l.fluency && ` — ${l.fluency}`}
              </StyledBadge>
            ))}
          </StyledBadgeList>
        </StyledSection>
      )}

      {interests.length > 0 && (
        <StyledSection>
          <TitleRow>
            <SectionCode>§{nextCode()}</SectionCode>
            <StyledSectionTitle>Interests</StyledSectionTitle>
          </TitleRow>
          <TwoCol>
            {interests.map((it, i) => (
              <RecordItem key={i}>
                <h4>{it.name}</h4>
                {it.keywords?.length > 0 && <p>{it.keywords.join(', ')}</p>}
              </RecordItem>
            ))}
          </TwoCol>
        </StyledSection>
      )}

      {references.length > 0 && (
        <StyledSection>
          <TitleRow>
            <SectionCode>§{nextCode()}</SectionCode>
            <StyledSectionTitle>References</StyledSectionTitle>
          </TitleRow>
          <RecordList>
            {references.map((r, i) => (
              <RecordItem key={i}>
                <h4>{r.name}</h4>
                {r.reference && <p>{r.reference}</p>}
              </RecordItem>
            ))}
          </RecordList>
        </StyledSection>
      )}
    </Layout>
  );
}

export default Resume;
