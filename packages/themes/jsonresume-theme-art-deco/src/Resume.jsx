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
// ART DECO — 1920s Gatsby elegance. Symmetric centered masthead, deep jewel
// (midnight + emerald) panels, metallic-gold accents, geometric chevron /
// sunburst dividers, and a high-contrast Cinzel didone-style display serif.
// Ornamental but legible. styled-components are defined INLINE (a separate
// styles.js crashes the registry webpack with "withConfig undefined").
// ---------------------------------------------------------------------------

const NIGHT = '#0f1418'; // near-black ink panel
const EMERALD = '#103b34'; // deep jewel green panel
const GOLD = '#c9a24b'; // metallic gold
const GOLD_LT = '#e3c98c';
const CREAM = '#f6f1e6'; // warm paper
const INK = '#1c1a16'; // body text on cream

const Page = styled.div`
  max-width: 880px;
  margin: 0 auto;
  background: ${CREAM};
  color: ${INK};
  font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  font-size: 16px;
  line-height: 1.55;
  border: 1px solid ${GOLD};
  box-shadow: inset 0 0 0 6px ${CREAM}, inset 0 0 0 7px ${GOLD};
`;

// --- Geometric chevron / sunburst divider built from CSS only --------------
const Sunburst = styled.div`
  height: 18px;
  background-image: repeating-linear-gradient(
    90deg,
    ${GOLD} 0 2px,
    transparent 2px 14px
  );
  opacity: ${(props) => (props.$muted ? 0.5 : 0.85)};
  margin: ${(props) => (props.$tight ? '0' : '0 0 4px 0')};
`;

const Chevron = styled.div`
  text-align: center;
  color: ${GOLD};
  letter-spacing: 8px;
  font-size: 14px;
  margin: 6px 0 0 0;

  &::before {
    content: '◆ ◇ ◆';
  }
`;

// --- Masthead --------------------------------------------------------------
const Masthead = styled.header`
  background: linear-gradient(160deg, ${NIGHT} 0%, ${EMERALD} 140%);
  color: ${CREAM};
  text-align: center;
  padding: 48px 40px 38px 40px;
  position: relative;
  border-bottom: 3px double ${GOLD};
`;

const TopRule = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: ${GOLD};
  letter-spacing: 6px;
  font-family: 'Poiret One', 'Cinzel', serif;
  text-transform: uppercase;
  font-size: 12px;
  margin-bottom: 24px;

  &::before,
  &::after {
    content: '';
    width: 70px;
    height: 1px;
    background: ${GOLD};
  }
`;

const Name = styled.h1`
  font-family: 'Cinzel', 'Cormorant Garamond', serif;
  font-weight: 700;
  font-size: clamp(34px, 7vw, 58px);
  line-height: 1.04;
  margin: 0;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: ${CREAM};
  text-shadow: 0 1px 0 rgba(201, 162, 75, 0.35);
`;

const Label = styled.div`
  font-family: 'Poiret One', serif;
  font-size: 17px;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: ${GOLD_LT};
  margin-top: 16px;
`;

const MastChevron = styled.div`
  color: ${GOLD};
  letter-spacing: 10px;
  font-size: 15px;
  margin-top: 22px;

  &::before {
    content: '◆ ◇ ◆ ◇ ◆';
  }
`;

const StyledContactInfo = styled(ContactInfo)`
  justify-content: center;
  gap: 8px 18px;
  margin-top: 22px;
  font-family: 'Poiret One', serif;
  font-size: 13px;
  letter-spacing: 1.5px;
  color: ${GOLD_LT};

  a,
  span {
    color: ${GOLD_LT};
    text-decoration: none;
  }

  a:hover {
    color: ${CREAM};
    text-decoration: underline;
  }
`;

// --- Body ------------------------------------------------------------------
const Body = styled.main`
  padding: 40px 46px 48px 46px;
`;

const Summary = styled.p`
  text-align: center;
  font-size: 19px;
  font-style: italic;
  line-height: 1.6;
  color: ${INK};
  max-width: 60ch;
  margin: 0 auto 16px auto;
`;

const Block = styled(Section)`
  margin-top: 38px;

  &:first-of-type {
    margin-top: 8px;
  }
`;

const Heading = styled(SectionTitle)`
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 4px;
  text-transform: uppercase;
  text-align: center;
  color: ${EMERALD};
  margin: 0 0 6px 0;
`;

const HeadingRule = styled.div`
  width: 100%;
  text-align: center;
  margin: 0 0 24px 0;
`;

const Entry = styled.div`
  margin-bottom: 26px;
  padding-bottom: 22px;
  border-bottom: 1px solid rgba(201, 162, 75, 0.4);

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const EntryHead = styled.div`
  text-align: center;
  margin-bottom: 6px;
`;

const EntryTitle = styled.h3`
  font-family: 'Cinzel', serif;
  font-weight: 500;
  font-size: 20px;
  letter-spacing: 1px;
  margin: 0;
  color: ${NIGHT};

  a {
    color: ${EMERALD};
    text-decoration: none;
    border-bottom: 1px solid ${GOLD};
  }
`;

const EntrySub = styled.div`
  font-family: 'Poiret One', serif;
  font-size: 14px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${GOLD};
  margin-top: 6px;
`;

const EntryMeta = styled.div`
  font-family: 'Poiret One', serif;
  font-size: 13px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #6b6552;
  margin-top: 4px;
`;

const Para = styled.p`
  margin: 12px 0 0 0;
  font-size: 16px;
  line-height: 1.6;
  text-align: center;
  max-width: 62ch;
  margin-left: auto;
  margin-right: auto;
`;

const Bullets = styled.ul`
  list-style: none;
  margin: 14px auto 0 auto;
  padding: 0;
  max-width: 62ch;

  li {
    position: relative;
    padding-left: 22px;
    margin-bottom: 8px;
    line-height: 1.55;

    &::before {
      content: '◆';
      position: absolute;
      left: 0;
      top: 1px;
      color: ${GOLD};
      font-size: 11px;
    }
  }
`;

const SkillsWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 22px;
  text-align: center;
`;

const SkillGroup = styled.div`
  h4 {
    font-family: 'Cinzel', serif;
    font-weight: 500;
    font-size: 16px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: ${EMERALD};
    margin: 0 0 10px 0;
  }
`;

const StyledBadgeList = styled(BadgeList)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
`;

const StyledBadge = styled(Badge)`
  font-family: 'Poiret One', serif;
  font-size: 13px;
  letter-spacing: 1px;
  background: transparent;
  color: ${INK};
  border: 1px solid ${GOLD};
  border-radius: 0;
  padding: 4px 12px;
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 22px;
`;

const Card = styled.div`
  text-align: center;
  padding: 18px 18px;
  border: 1px solid rgba(201, 162, 75, 0.55);
  background: rgba(201, 162, 75, 0.06);

  h4 {
    font-family: 'Cinzel', serif;
    font-weight: 500;
    font-size: 17px;
    letter-spacing: 1px;
    margin: 0 0 8px 0;
    color: ${NIGHT};

    a {
      color: ${EMERALD};
      text-decoration: none;
      border-bottom: 1px solid ${GOLD};
    }
  }

  p {
    margin: 6px 0 0 0;
    font-size: 15px;

    &:first-of-type {
      margin-top: 0;
    }
  }
`;

const CardMeta = styled.div`
  font-family: 'Poiret One', serif;
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${GOLD};
  margin-bottom: 8px;
`;

function SectionRule({ children, withTop = false }) {
  return (
    <>
      {withTop && <MastChevron aria-hidden="true" />}
      <HeadingRule>
        <Sunburst aria-hidden="true" />
        {children}
        <Chevron aria-hidden="true" />
      </HeadingRule>
    </>
  );
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

  return (
    <Page>
      <Masthead>
        <TopRule>Curriculum Vitae</TopRule>
        {basics.name && <Name>{basics.name}</Name>}
        {basics.label && <Label>{basics.label}</Label>}
        <MastChevron aria-hidden="true" />
        {(basics.email ||
          basics.phone ||
          basics.url ||
          (basics.profiles && basics.profiles.length > 0)) && (
          <StyledContactInfo basics={basics} separator="◆" />
        )}
      </Masthead>

      <Body>
        {basics.summary && <Summary>{basics.summary}</Summary>}

        {work.length > 0 && (
          <Block>
            <Heading>Experience</Heading>
            <SectionRule />
            {work.map((job, i) => (
              <Entry key={i}>
                <EntryHead>
                  <EntryTitle>{job.position || job.name || 'Role'}</EntryTitle>
                  {job.name && job.position && (
                    <EntrySub>
                      {job.url ? (
                        <Link href={safeUrl(job.url)}>{job.name}</Link>
                      ) : (
                        job.name
                      )}
                    </EntrySub>
                  )}
                  {(job.startDate || job.endDate || job.location) && (
                    <EntryMeta>
                      {(job.startDate || job.endDate) && (
                        <DateRange
                          startDate={job.startDate}
                          endDate={job.endDate}
                        />
                      )}
                      {job.location ? ` · ${job.location}` : ''}
                    </EntryMeta>
                  )}
                </EntryHead>
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
            <Heading>Education</Heading>
            <SectionRule />
            {education.map((edu, i) => (
              <Entry key={i}>
                <EntryHead>
                  <EntryTitle>{edu.institution || 'Institution'}</EntryTitle>
                  {(edu.studyType || edu.area) && (
                    <EntrySub>
                      {[edu.studyType, edu.area].filter(Boolean).join(' · ')}
                    </EntrySub>
                  )}
                  {(edu.startDate || edu.endDate) && (
                    <EntryMeta>
                      <DateRange
                        startDate={edu.startDate}
                        endDate={edu.endDate}
                      />
                    </EntryMeta>
                  )}
                </EntryHead>
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
            <Heading>Skills</Heading>
            <SectionRule />
            <SkillsWrap>
              {skills.map((skill, i) => (
                <SkillGroup key={i}>
                  <h4>
                    {skill.name || 'Skills'}
                    {skill.level ? ` · ${skill.level}` : ''}
                  </h4>
                  {skill.keywords && skill.keywords.length > 0 && (
                    <StyledBadgeList>
                      {skill.keywords.map((kw, ki) => (
                        <StyledBadge key={ki}>{kw}</StyledBadge>
                      ))}
                    </StyledBadgeList>
                  )}
                </SkillGroup>
              ))}
            </SkillsWrap>
          </Block>
        )}

        {projects.length > 0 && (
          <Block>
            <Heading>Projects</Heading>
            <SectionRule />
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
                  {(project.entity || project.type) && (
                    <EntrySub>
                      {[project.entity, project.type]
                        .filter(Boolean)
                        .join(' · ')}
                    </EntrySub>
                  )}
                  {(project.startDate || project.endDate) && (
                    <EntryMeta>
                      <DateRange
                        startDate={project.startDate}
                        endDate={project.endDate}
                      />
                    </EntryMeta>
                  )}
                </EntryHead>
                {project.description && <Para>{project.description}</Para>}
                {project.highlights && project.highlights.length > 0 && (
                  <Bullets>
                    {project.highlights.map((h, hi) => (
                      <li key={hi}>{h}</li>
                    ))}
                  </Bullets>
                )}
                {project.keywords && project.keywords.length > 0 && (
                  <StyledBadgeList style={{ marginTop: '14px' }}>
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
            <Heading>Volunteer</Heading>
            <SectionRule />
            {volunteer.map((vol, i) => (
              <Entry key={i}>
                <EntryHead>
                  <EntryTitle>{vol.position || 'Volunteer'}</EntryTitle>
                  {vol.organization && (
                    <EntrySub>
                      {vol.url ? (
                        <Link href={safeUrl(vol.url)}>{vol.organization}</Link>
                      ) : (
                        vol.organization
                      )}
                    </EntrySub>
                  )}
                  {(vol.startDate || vol.endDate) && (
                    <EntryMeta>
                      <DateRange
                        startDate={vol.startDate}
                        endDate={vol.endDate}
                      />
                    </EntryMeta>
                  )}
                </EntryHead>
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
            <Heading>Awards</Heading>
            <SectionRule />
            <Cards>
              {awards.map((award, i) => (
                <Card key={i}>
                  <h4>{award.title || 'Award'}</h4>
                  {(award.awarder || award.date) && (
                    <CardMeta>
                      {[award.awarder, award.date].filter(Boolean).join(' · ')}
                    </CardMeta>
                  )}
                  {award.summary && <p>{award.summary}</p>}
                </Card>
              ))}
            </Cards>
          </Block>
        )}

        {certificates.length > 0 && (
          <Block>
            <Heading>Certificates</Heading>
            <SectionRule />
            <Cards>
              {certificates.map((cert, i) => (
                <Card key={i}>
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
                    <CardMeta>
                      {[cert.issuer, cert.date].filter(Boolean).join(' · ')}
                    </CardMeta>
                  )}
                </Card>
              ))}
            </Cards>
          </Block>
        )}

        {publications.length > 0 && (
          <Block>
            <Heading>Publications</Heading>
            <SectionRule />
            <Cards>
              {publications.map((pub, i) => (
                <Card key={i}>
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
                    <CardMeta>
                      {[pub.publisher, pub.releaseDate]
                        .filter(Boolean)
                        .join(' · ')}
                    </CardMeta>
                  )}
                  {pub.summary && <p>{pub.summary}</p>}
                </Card>
              ))}
            </Cards>
          </Block>
        )}

        {languages.length > 0 && (
          <Block>
            <Heading>Languages</Heading>
            <SectionRule />
            <StyledBadgeList>
              {languages.map((lang, i) => (
                <StyledBadge key={i}>
                  {lang.language || 'Language'}
                  {lang.fluency ? ` · ${lang.fluency}` : ''}
                </StyledBadge>
              ))}
            </StyledBadgeList>
          </Block>
        )}

        {interests.length > 0 && (
          <Block>
            <Heading>Interests</Heading>
            <SectionRule />
            <Cards>
              {interests.map((interest, i) => (
                <Card key={i}>
                  <h4>{interest.name || 'Interest'}</h4>
                  {interest.keywords && interest.keywords.length > 0 && (
                    <p>{interest.keywords.join(', ')}</p>
                  )}
                </Card>
              ))}
            </Cards>
          </Block>
        )}

        {references.length > 0 && (
          <Block>
            <Heading>References</Heading>
            <SectionRule />
            <Cards>
              {references.map((ref, i) => (
                <Card key={i}>
                  <h4>{ref.name || 'Reference'}</h4>
                  {ref.reference && <p>{ref.reference}</p>}
                </Card>
              ))}
            </Cards>
          </Block>
        )}
      </Body>
    </Page>
  );
}

export default Resume;
