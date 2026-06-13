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

// ---------------------------------------------------------------------------
// BRUTALIST — raw concrete. Heavy 4px black rules, oversized UPPERCASE
// grotesque/mono headings, hard edges (zero border-radius), stark
// black-on-white with ONE harsh accent: safety yellow (#FFE600). A visible
// structural grid and hard offset block-shadows make the structure literal.
// styled-components are defined INLINE (a separate styles.js crashes the
// registry webpack with "withConfig undefined").
// ---------------------------------------------------------------------------

const INK = '#0a0a0a';
const PAPER = '#ffffff';
const ACCENT = '#ffe600'; // safety yellow
const RULE = '4px solid #0a0a0a';
const HAIR = '2px solid #0a0a0a';

const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: ${PAPER};
  color: ${INK};
  font-family: 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
  font-size: 15px;
  line-height: 1.5;
  padding: 0;
  border-left: ${RULE};
  border-right: ${RULE};

  @media print {
    border: none;
  }
`;

const Masthead = styled.header`
  border-bottom: ${RULE};
  background: ${PAPER};
`;

const SpecBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  border-bottom: ${HAIR};
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;

  span {
    padding: 8px 16px;
  }

  span + span {
    border-left: ${HAIR};
  }
`;

const SpecTag = styled.span`
  background: ${ACCENT};
  font-weight: 700;
`;

const NameBlock = styled.div`
  padding: 36px 32px 28px 32px;
`;

const Name = styled.h1`
  font-family: 'Archivo Black', 'Space Grotesk', sans-serif;
  font-size: clamp(40px, 9vw, 76px);
  line-height: 0.92;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: -1px;
  word-break: break-word;
`;

const Label = styled.div`
  display: inline-block;
  margin-top: 16px;
  background: ${INK};
  color: ${PAPER};
  font-family: 'Space Mono', monospace;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 13px;
  padding: 6px 12px;
`;

const ContactRow = styled.div`
  border-top: ${HAIR};
  padding: 14px 32px;
  background: ${PAPER};
`;

const StyledContactInfo = styled(ContactInfo)`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 22px;
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  a,
  span {
    color: ${INK};
    text-decoration: none;
    font-weight: 700;
  }

  a {
    border-bottom: 3px solid ${ACCENT};
    padding-bottom: 1px;
  }
`;

const Summary = styled.p`
  margin: 0;
  padding: 24px 32px;
  border-top: ${HAIR};
  font-size: 18px;
  font-weight: 500;
  line-height: 1.45;
`;

const Body = styled.main`
  padding: 0;
`;

const Block = styled(Section)`
  border-bottom: ${RULE};
  padding: 28px 32px 32px 32px;

  &:last-child {
    border-bottom: none;
  }
`;

const Heading = styled(SectionTitle)`
  font-family: 'Archivo Black', 'Space Grotesk', sans-serif;
  font-size: clamp(22px, 4vw, 32px);
  text-transform: uppercase;
  letter-spacing: -0.5px;
  margin: 0 0 22px 0;
  display: flex;
  align-items: baseline;
  gap: 14px;

  &::before {
    content: attr(data-index);
    font-family: 'Space Mono', monospace;
    font-size: 14px;
    background: ${ACCENT};
    color: ${INK};
    padding: 4px 8px;
    letter-spacing: 0;
    align-self: center;
  }
`;

const Entry = styled.div`
  border: ${HAIR};
  box-shadow: 8px 8px 0 ${INK};
  background: ${PAPER};
  padding: 18px 20px;
  margin-bottom: 26px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const EntryHead = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 6px 16px;
  border-bottom: ${HAIR};
  padding-bottom: 10px;
  margin-bottom: 12px;
`;

const EntryTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 21px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.3px;
  margin: 0;

  a {
    color: ${INK};
    text-decoration: none;
    box-shadow: inset 0 -8px 0 ${ACCENT};
  }
`;

const EntryMeta = styled.div`
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
`;

const EntrySub = styled.div`
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;

  a {
    color: ${INK};
    text-decoration: none;
    box-shadow: inset 0 -6px 0 ${ACCENT};
  }
`;

const Para = styled.p`
  margin: 0 0 10px 0;
  font-size: 15px;
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Bullets = styled.ul`
  list-style: none;
  margin: 12px 0 0 0;
  padding: 0;

  li {
    position: relative;
    padding-left: 26px;
    margin-bottom: 8px;
    line-height: 1.45;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 6px;
      width: 12px;
      height: 12px;
      background: ${ACCENT};
      border: 2px solid ${INK};
    }
  }
`;

const SkillGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0;
  border: ${HAIR};

  @media print {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SkillCell = styled.div`
  border: ${HAIR};
  margin: -1px;
  padding: 14px 16px;

  h4 {
    font-family: 'Archivo Black', sans-serif;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 10px 0;
  }
`;

const StyledBadgeList = styled(BadgeList)`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const StyledBadge = styled(Badge)`
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${PAPER};
  color: ${INK};
  border: 2px solid ${INK};
  border-radius: 0;
  padding: 3px 8px;
`;

const PlainGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
`;

const PlainCard = styled.div`
  border: ${HAIR};
  border-left: ${RULE};
  padding: 14px 16px;

  h4 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    margin: 0 0 6px 0;

    a {
      color: ${INK};
      text-decoration: none;
      box-shadow: inset 0 -7px 0 ${ACCENT};
    }
  }

  p {
    margin: 0 0 6px 0;
    font-size: 14px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const MetaTag = styled.span`
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${INK};
  display: block;
`;

function pad(n) {
  return String(n).padStart(2, '0');
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
  } = resume || {};

  const loc = basics.location || {};
  const locParts = [loc.city, loc.region, loc.countryCode].filter(Boolean);
  const locLine = locParts.join(', ');

  let section = 0;
  const next = () => pad(++section);

  return (
    <Page>
      <Masthead>
        <SpecBar>
          <SpecTag>Curriculum Vitae</SpecTag>
          {locLine && <span>{locLine}</span>}
          <span>Rev. 0.1</span>
        </SpecBar>
        <NameBlock>
          {basics.name && <Name>{basics.name}</Name>}
          {basics.label && <Label>{basics.label}</Label>}
        </NameBlock>
        {(basics.email ||
          basics.phone ||
          basics.url ||
          (basics.profiles && basics.profiles.length > 0)) && (
          <ContactRow>
            <StyledContactInfo basics={basics} />
          </ContactRow>
        )}
        {basics.summary && <Summary>{basics.summary}</Summary>}
      </Masthead>

      <Body>
        {work.length > 0 && (
          <Block>
            <Heading data-index={next()}>Experience</Heading>
            {work.map((job, i) => (
              <Entry key={i}>
                <EntryHead>
                  <EntryTitle>{job.position || job.name || 'Role'}</EntryTitle>
                  {(job.startDate || job.endDate) && (
                    <EntryMeta>
                      <DateRange
                        startDate={job.startDate}
                        endDate={job.endDate}
                      />
                    </EntryMeta>
                  )}
                </EntryHead>
                {job.name && job.position && (
                  <EntrySub>
                    {job.url ? (
                      <Link href={safeUrl(job.url)}>{job.name}</Link>
                    ) : (
                      job.name
                    )}
                    {job.location ? ` // ${job.location}` : ''}
                  </EntrySub>
                )}
                {job.summary && <Para>{job.summary}</Para>}
                {job.highlights && job.highlights.length > 0 && (
                  <Bullets>
                    {job.highlights.map((h, hi) => (
                      <li key={hi}>{h}</li>
                    ))}
                  </Bullets>
                )}
              </Entry>
            ))}
          </Block>
        )}

        {education.length > 0 && (
          <Block>
            <Heading data-index={next()}>Education</Heading>
            {education.map((edu, i) => (
              <Entry key={i}>
                <EntryHead>
                  <EntryTitle>{edu.institution || 'Institution'}</EntryTitle>
                  {(edu.startDate || edu.endDate) && (
                    <EntryMeta>
                      <DateRange
                        startDate={edu.startDate}
                        endDate={edu.endDate}
                      />
                    </EntryMeta>
                  )}
                </EntryHead>
                {(edu.studyType || edu.area) && (
                  <EntrySub>
                    {[edu.studyType, edu.area].filter(Boolean).join(' // ')}
                  </EntrySub>
                )}
                {edu.score && <Para>GPA: {edu.score}</Para>}
                {edu.courses && edu.courses.length > 0 && (
                  <Bullets>
                    {edu.courses.map((c, ci) => (
                      <li key={ci}>{c}</li>
                    ))}
                  </Bullets>
                )}
              </Entry>
            ))}
          </Block>
        )}

        {skills.length > 0 && (
          <Block>
            <Heading data-index={next()}>Skills</Heading>
            <SkillGrid>
              {skills.map((skill, i) => (
                <SkillCell key={i}>
                  <h4>
                    {skill.name || 'Skills'}
                    {skill.level ? ` — ${skill.level}` : ''}
                  </h4>
                  {skill.keywords && skill.keywords.length > 0 && (
                    <StyledBadgeList>
                      {skill.keywords.map((kw, ki) => (
                        <StyledBadge key={ki}>{kw}</StyledBadge>
                      ))}
                    </StyledBadgeList>
                  )}
                </SkillCell>
              ))}
            </SkillGrid>
          </Block>
        )}

        {projects.length > 0 && (
          <Block>
            <Heading data-index={next()}>Projects</Heading>
            {projects.map((project, i) => (
              <Entry key={i}>
                <EntryHead>
                  <EntryTitle>
                    {project.url ? (
                      <Link href={safeUrl(project.url)}>
                        {project.name || 'Project'}
                      </Link>
                    ) : (
                      project.name || 'Project'
                    )}
                  </EntryTitle>
                  {(project.startDate || project.endDate) && (
                    <EntryMeta>
                      <DateRange
                        startDate={project.startDate}
                        endDate={project.endDate}
                      />
                    </EntryMeta>
                  )}
                </EntryHead>
                {(project.entity || project.type) && (
                  <EntrySub>
                    {[project.entity, project.type]
                      .filter(Boolean)
                      .join(' // ')}
                  </EntrySub>
                )}
                {project.description && <Para>{project.description}</Para>}
                {project.highlights && project.highlights.length > 0 && (
                  <Bullets>
                    {project.highlights.map((h, hi) => (
                      <li key={hi}>{h}</li>
                    ))}
                  </Bullets>
                )}
                {project.keywords && project.keywords.length > 0 && (
                  <StyledBadgeList>
                    {project.keywords.map((kw, ki) => (
                      <StyledBadge key={ki}>{kw}</StyledBadge>
                    ))}
                  </StyledBadgeList>
                )}
              </Entry>
            ))}
          </Block>
        )}

        {volunteer.length > 0 && (
          <Block>
            <Heading data-index={next()}>Volunteer</Heading>
            {volunteer.map((vol, i) => (
              <Entry key={i}>
                <EntryHead>
                  <EntryTitle>{vol.position || 'Volunteer'}</EntryTitle>
                  {(vol.startDate || vol.endDate) && (
                    <EntryMeta>
                      <DateRange
                        startDate={vol.startDate}
                        endDate={vol.endDate}
                      />
                    </EntryMeta>
                  )}
                </EntryHead>
                {vol.organization && (
                  <EntrySub>
                    {vol.url ? (
                      <Link href={safeUrl(vol.url)}>{vol.organization}</Link>
                    ) : (
                      vol.organization
                    )}
                  </EntrySub>
                )}
                {vol.summary && <Para>{vol.summary}</Para>}
                {vol.highlights && vol.highlights.length > 0 && (
                  <Bullets>
                    {vol.highlights.map((h, hi) => (
                      <li key={hi}>{h}</li>
                    ))}
                  </Bullets>
                )}
              </Entry>
            ))}
          </Block>
        )}

        {awards.length > 0 && (
          <Block>
            <Heading data-index={next()}>Awards</Heading>
            <PlainGrid>
              {awards.map((award, i) => (
                <PlainCard key={i}>
                  <h4>{award.title || 'Award'}</h4>
                  {(award.awarder || award.date) && (
                    <MetaTag>
                      {[award.awarder, award.date].filter(Boolean).join(' // ')}
                    </MetaTag>
                  )}
                  {award.summary && <p>{award.summary}</p>}
                </PlainCard>
              ))}
            </PlainGrid>
          </Block>
        )}

        {certificates.length > 0 && (
          <Block>
            <Heading data-index={next()}>Certificates</Heading>
            <PlainGrid>
              {certificates.map((cert, i) => (
                <PlainCard key={i}>
                  <h4>
                    {cert.url ? (
                      <Link href={safeUrl(cert.url)}>
                        {cert.name || 'Certificate'}
                      </Link>
                    ) : (
                      cert.name || 'Certificate'
                    )}
                  </h4>
                  {(cert.issuer || cert.date) && (
                    <MetaTag>
                      {[cert.issuer, cert.date].filter(Boolean).join(' // ')}
                    </MetaTag>
                  )}
                </PlainCard>
              ))}
            </PlainGrid>
          </Block>
        )}

        {publications.length > 0 && (
          <Block>
            <Heading data-index={next()}>Publications</Heading>
            <PlainGrid>
              {publications.map((pub, i) => (
                <PlainCard key={i}>
                  <h4>
                    {pub.url ? (
                      <Link href={safeUrl(pub.url)}>
                        {pub.name || 'Publication'}
                      </Link>
                    ) : (
                      pub.name || 'Publication'
                    )}
                  </h4>
                  {(pub.publisher || pub.releaseDate) && (
                    <MetaTag>
                      {[pub.publisher, pub.releaseDate]
                        .filter(Boolean)
                        .join(' // ')}
                    </MetaTag>
                  )}
                  {pub.summary && <p>{pub.summary}</p>}
                </PlainCard>
              ))}
            </PlainGrid>
          </Block>
        )}

        {languages.length > 0 && (
          <Block>
            <Heading data-index={next()}>Languages</Heading>
            <StyledBadgeList>
              {languages.map((lang, i) => (
                <StyledBadge key={i}>
                  {lang.language || 'Language'}
                  {lang.fluency ? ` — ${lang.fluency}` : ''}
                </StyledBadge>
              ))}
            </StyledBadgeList>
          </Block>
        )}

        {interests.length > 0 && (
          <Block>
            <Heading data-index={next()}>Interests</Heading>
            <PlainGrid>
              {interests.map((interest, i) => (
                <PlainCard key={i}>
                  <h4>{interest.name || 'Interest'}</h4>
                  {interest.keywords && interest.keywords.length > 0 && (
                    <p>{interest.keywords.join(', ')}</p>
                  )}
                </PlainCard>
              ))}
            </PlainGrid>
          </Block>
        )}

        {references.length > 0 && (
          <Block>
            <Heading data-index={next()}>References</Heading>
            <PlainGrid>
              {references.map((ref, i) => (
                <PlainCard key={i}>
                  <h4>{ref.name || 'Reference'}</h4>
                  {ref.reference && <p>{ref.reference}</p>}
                </PlainCard>
              ))}
            </PlainGrid>
          </Block>
        )}
      </Body>
    </Page>
  );
}

export default Resume;
